"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Control,
  useFieldArray,
  useWatch,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { Member } from "@/features/users/types/user";
import { Button } from "@/components/ui/button";
import {
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import TitleInput from "@/components/forms/TitleInput";
import AmountInput from "@/components/forms/AmountInput";
import CompactSplitTypeSelect from "@/features/expenses/components/forms/CompactSplitTypeSelect";
import { Checkbox } from "@/components/ui/checkbox";
import MemberSplitRow from "@/features/expenses/components/forms/MemberSplitRow";
import {
  getSelectedTotal,
  isOverTotalLimit,
  errorMsgForLimit,
} from "@/features/expenses/utils/splitsHelpers";
import { Trash2 } from "lucide-react";
import { MultiItemExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";
import { formatCurrency } from "@/utils/formatCurrency";

// Constants for timing delays
const SCROLL_DELAY_MS = 100; // Wait for DOM to render new card before scrolling

type ExpenseMultiItemSectionProps = {
  control: Control<z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>>;
  setValue: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["setValue"];
  setError: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["setError"];
  clearErrors: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["clearErrors"];
  groupMembers: Member[];
};

const ExpenseMultiItemSection = ({
  control,
  setValue,
  setError,
  clearErrors,
  groupMembers,
}: ExpenseMultiItemSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [expandedIndex, setExpandedIndex] = useState<number>(-1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // Create empty item structure (reusable)
  const createEmptyItem = useCallback(
    () => ({
      title: "",
      amount: 0,
      splitType: "even" as const,
      memberSplits: groupMembers.map((m) => ({ userId: m.id, weight: 0 })),
      selectedMembers: [],
    }),
    [groupMembers]
  );

  // Scroll to bottom function - memoized to prevent recreation
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, SCROLL_DELAY_MS);
  }, []);

  const handleAddItem = useCallback(() => {
    const newIndex = fields.length;
    append(createEmptyItem());
    setExpandedIndex(newIndex);
    scrollToBottom();
  }, [fields.length, append, createEmptyItem, scrollToBottom]);

  const handleRemove = useCallback(
    (index: number) => {
      const newItemCount = fields.length - 1;
      remove(index);

      // If only one item remains, always expand it
      if (newItemCount === 1) {
        setExpandedIndex(0);
        return;
      }

      // Adjust expanded index based on which item was removed
      setExpandedIndex((currentExpanded) => {
        if (index === currentExpanded) {
          return -1;
        } else if (index < currentExpanded) {
          return currentExpanded - 1;
        }
        return currentExpanded;
      });
    },
    [fields.length, remove]
  );

  const items = useWatch({ control, name: "items" });

  const itemCount = fields.length;
  const totalAmount = useMemo(
    () => items?.reduce((sum, item) => sum + (item?.amount || 0), 0) || 0,
    [items]
  );

  // Check if any item has no title and no amount
  const hasIncompleteItem = useMemo(() => {
    return (
      items?.some((item) => {
        const hasTitle = item?.title && item.title.trim() !== "";
        const hasAmount = (item?.amount || 0) > 0;
        return !hasTitle && !hasAmount;
      }) || false
    );
  }, [items]);

  // Initialize with one empty item on first load if items array is empty
  useEffect(() => {
    if (!hasInitializedRef.current && itemCount === 0) {
      hasInitializedRef.current = true;
      append(createEmptyItem());
      setExpandedIndex(0);
    }
  }, [itemCount, append, createEmptyItem]);

  // Ensure single item is always expanded
  useEffect(() => {
    if (itemCount === 1 && expandedIndex !== 0) {
      setExpandedIndex(0);
    }
  }, [itemCount, expandedIndex]);

  return (
    <div className="flex flex-col flex-1 min-h-0 form-item">
      <div className="form-label-row flex-shrink-0">
        <FormLabel className="form-item-label">Items</FormLabel>
        <div
          className="ml-auto pr-2 overflow-y-auto"
          style={{ scrollbarGutter: "stable", height: "fit-content" }}
        >
          <div className="text-sm text-muted-foreground text-right whitespace-nowrap">
            Count: {itemCount} · Total: {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 space-y-3 overflow-y-auto pr-2 min-h-0 mt-1"
        style={{ scrollbarGutter: "stable" }}
      >
        {fields.map((field, index) => (
          <ItemCard
            key={field.id}
            index={index}
            control={control}
            setValue={setValue}
            setError={setError}
            clearErrors={clearErrors}
            groupMembers={groupMembers}
            onRemove={() => handleRemove(index)}
            isExpanded={expandedIndex === index}
            onExpand={() => {
              // If another item is expanded, collapse it first for smooth transition
              if (expandedIndex !== -1 && expandedIndex !== index) {
                setExpandedIndex(-1);
                // Use requestAnimationFrame for smoother transition
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    setExpandedIndex(index);
                  });
                });
              } else {
                setExpandedIndex(index);
              }
            }}
            onCollapse={() => setExpandedIndex(-1)}
            cardRef={index === fields.length - 1 ? lastCardRef : undefined}
            totalItemCount={fields.length}
            onExpandOtherCard={(targetIndex, onComplete) => {
              // Adjust target index if deleted item was before the target
              const adjustedIndex =
                index < targetIndex ? targetIndex - 1 : targetIndex;
              setExpandedIndex(-1);
              setTimeout(() => {
                setExpandedIndex(adjustedIndex);
                // Call completion callback after expansion
                onComplete?.();
              }, 100);
            }}
            scrollToBottom={scrollToBottom}
          />
        ))}

        {/* Add Item Button - fixed at end of list */}
        <button
          type="button"
          onClick={handleAddItem}
          disabled={hasIncompleteItem}
          data-ignore-outside-click
          className="w-full border-2 border-dashed rounded-lg p-3 bg-transparent hover:bg-muted/30 transition-all duration-200 ease-in-out text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center mb-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
        >
          <span className="text-sm font-medium">New Item</span>
        </button>
      </div>
    </div>
  );
};

type ItemCardProps = {
  index: number;
  control: Control<z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>>;
  setValue: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["setValue"];
  setError: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["setError"];
  clearErrors: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["clearErrors"];
  groupMembers: Member[];
  onRemove: () => void;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  totalItemCount: number;
  onExpandOtherCard?: (targetIndex: number, onComplete?: () => void) => void;
  scrollToBottom: () => void;
};

const ItemCard = ({
  index,
  control,
  setValue,
  setError,
  clearErrors,
  groupMembers,
  onRemove,
  isExpanded,
  onExpand,
  onCollapse,
  cardRef: externalCardRef,
  totalItemCount,
  onExpandOtherCard,
  scrollToBottom,
}: ItemCardProps) => {
  // Watch the entire item to avoid multiple subscriptions
  const item = useWatch({ control, name: `items.${index}` });
  const {
    title = "",
    amount: currentAmount = 0,
    splitType = "even",
    selectedMembers = [],
    memberSplits = [],
  } = item || {};

  // Track if title is being edited for dynamic sizing
  const [isTitleInputFocused, setIsTitleInputFocused] = useState(false);

  const hasTitle = title && title.trim() !== "";
  const hasAmount = currentAmount > 0;
  const isOnlyItem = totalItemCount === 1;

  // Collapsibility rules:
  // - If there's only 1 item: never collapsible (always expanded)
  // - If there are 2+ items: collapsible only if this item has title or amount
  const isCollapsible = !isOnlyItem && (hasTitle || hasAmount);

  // Ref for the expanded card to detect clicks outside
  const cardRef = useRef<HTMLDivElement>(null);

  // Refs to trigger focus on inputs
  const titleInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Use external ref if provided, otherwise use internal ref
  const activeCardRef = externalCardRef || cardRef;

  // Reset title input focus state when card collapses
  useEffect(() => {
    if (!isExpanded) {
      setIsTitleInputFocused(false);
      // Blur the input to ensure it loses focus
      titleInputRef.current?.blur();
    }
  }, [isExpanded]);

  // Smart auto-focus when card expands
  useEffect(() => {
    if (!isExpanded) return;

    // Capture the current state at expansion time
    const titleAtExpand = title && title.trim() !== "";
    const amountAtExpand = currentAmount > 0;

    // Delay to ensure DOM is ready
    setTimeout(() => {
      if (!titleAtExpand) {
        // No title → focus title
        titleInputRef.current?.focus();
      } else if (titleAtExpand && !amountAtExpand) {
        // Has title but no amount → focus amount
        amountInputRef.current?.focus();
      }
      // If both exist, don't auto-focus
    }, 50);
    // Only run when card expands/collapses, NOT when title/amount change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if click is outside this card
      if (activeCardRef.current && !activeCardRef.current.contains(target)) {
        // Check if the click is on another card
        const clickedOnAnotherCard = target.closest("[data-item-card]");

        // Check if the click is on a button or element that should be ignored
        const clickedOnIgnoredElement = target.closest(
          "[data-ignore-outside-click]"
        );

        if (clickedOnAnotherCard && !clickedOnIgnoredElement) {
          // If clicking on another card and this item is incomplete, delete it
          const isIncomplete = !hasTitle && !hasAmount;
          if (isIncomplete && onExpandOtherCard) {
            // Get the index of the clicked card from the data attribute
            const clickedCardIndex =
              clickedOnAnotherCard.getAttribute("data-item-index");
            if (clickedCardIndex !== null) {
              const targetIndex = parseInt(clickedCardIndex, 10);
              // Check if the clicked card is the one immediately before this incomplete item
              const isItemRightBefore = targetIndex === index - 1;
              // First collapse this item, then delete and expand target
              onCollapse();
              onRemove();
              // Use a small delay to ensure deletion completes before expanding
              setTimeout(() => {
                // Only scroll to bottom if clicking on the item right before the incomplete one
                onExpandOtherCard(
                  targetIndex,
                  isItemRightBefore ? scrollToBottom : undefined
                );
              }, 50);
            } else {
              onCollapse();
              onRemove();
            }
          }
          // Otherwise, let the clicked card handle its own expansion
        } else if (!clickedOnAnotherCard && !clickedOnIgnoredElement) {
          // Clicked outside all cards - only collapse if allowed
          if (isCollapsible) {
            onCollapse();
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isExpanded,
    onCollapse,
    activeCardRef,
    isCollapsible,
    hasTitle,
    hasAmount,
    onRemove,
    onExpandOtherCard,
    scrollToBottom,
    index,
  ]);

  const handleSelectAllToggle = () => {
    const newValue = areAllMembersSelected
      ? []
      : groupMembers.map((member) => member.id);

    const total = getSelectedTotal(memberSplits, newValue);
    const overLimit = isOverTotalLimit(total, splitType, currentAmount);

    if (overLimit) {
      setError(`items.${index}.memberSplits`, {
        type: "manual",
        message:
          splitType === "custom" || splitType === "percentage"
            ? errorMsgForLimit(splitType, currentAmount)
            : "Invalid split type",
      });
    } else {
      clearErrors(`items.${index}.memberSplits`);
    }

    setValue(`items.${index}.selectedMembers`, newValue);
  };

  // Create Set for O(1) lookup - memoized for performance
  const selectedMembersSet = useMemo(
    () => new Set(selectedMembers || []),
    [selectedMembers]
  );

  // Memoize check for performance
  const areAllMembersSelected = useMemo(
    () => selectedMembersSet.size === groupMembers.length,
    [selectedMembersSet.size, groupMembers.length]
  );

  // Get names of selected members for collapsed view - memoized for performance
  const selectedMemberNames = useMemo(() => {
    if (!selectedMembersSet.size) return "";
    return groupMembers
      .filter((member) => selectedMembersSet.has(member.id))
      .map((member) => member.name)
      .join(", ");
  }, [selectedMembersSet, groupMembers]);

  if (!isExpanded) {
    return (
      <div
        ref={activeCardRef}
        data-item-card
        data-item-index={index}
        className="border rounded-lg p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-all duration-200 ease-in-out"
        onClick={onExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-medium truncate">
                {title || "Untitled item"}
              </span>
              <span className="text-muted-foreground">
                {formatCurrency(currentAmount)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground truncate mt-1">
              {selectedMemberNames || "No members selected"}
            </div>
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="h-6 w-6 p-0 ml-2 mr-1 group"
          >
            <Trash2 className="h-4 w-4 transition-colors group-hover:text-destructive" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={activeCardRef}
      data-item-card
      data-item-index={index}
      className="border rounded-lg p-4 bg-muted/30 transition-all duration-200 ease-in-out min-h-[200px]"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className={`${
              hasTitle && !isTitleInputFocused ? "w-auto shrink-0" : "flex-1"
            } min-w-0 transition-[flex,width] duration-0 animate-slide-in-top`}
          >
            <TitleInput
              control={control}
              name={`items.${index}.title`}
              placeholder="Item name"
              variant="compact"
              onFocusChange={setIsTitleInputFocused}
              inputRef={titleInputRef}
            />
          </div>
          <div
            className={`${
              hasTitle && !isTitleInputFocused ? "flex-1" : "w-[120px] shrink-0"
            } transition-[flex,width] duration-0 animate-slide-in-top`}
          >
            <AmountInput
              control={control}
              name={`items.${index}.amount`}
              variant="compact"
              inputRef={amountInputRef}
            />
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="h-6 w-6 p-0 ml-2 shrink-0 group"
          >
            <Trash2 className="h-4 w-4 icon-destructive-hover" />
          </Button>
        </div>

        {/* Split Details */}
        <div className="form-item animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FormField
                control={control}
                name={`items.${index}.selectedMembers`}
                render={() => <FormMessage className="form-item-message" />}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAllToggle}
                className="text-xs h-7"
              >
                {areAllMembersSelected ? "Deselect All" : "Select All"}
              </Button>
            </div>
            <CompactSplitTypeSelect
              control={control}
              name={`items.${index}.splitType`}
            />
          </div>
          <FormField
            control={control}
            name={`items.${index}.memberSplits`}
            render={() => (
              <div className="flex flex-col gap-y-3">
                {groupMembers.map((member) => {
                  const isSelected = selectedMembersSet.has(member.id);

                  return (
                    <FormItem
                      key={member.id}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            id={`${index}-${member.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(selectedMembers || []), member.id]
                                : selectedMembers.filter(
                                    (id: string) => id !== member.id
                                  );

                              const total = getSelectedTotal(
                                memberSplits,
                                newValue
                              );
                              const overLimit = isOverTotalLimit(
                                total,
                                splitType,
                                currentAmount
                              );

                              if (overLimit) {
                                setError(`items.${index}.memberSplits`, {
                                  type: "manual",
                                  message:
                                    splitType === "custom" ||
                                    splitType === "percentage"
                                      ? errorMsgForLimit(
                                          splitType,
                                          currentAmount
                                        )
                                      : "Invalid split type",
                                });
                              } else {
                                clearErrors(`items.${index}.memberSplits`);
                              }

                              setValue(
                                `items.${index}.selectedMembers`,
                                newValue
                              );
                            }}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={`${index}-${member.id}`}
                          className="font-normal text-base min-w-0"
                        >
                          <span className="cursor-pointer">{member.name}</span>
                        </FormLabel>
                      </div>
                      <MemberSplitRow
                        control={control}
                        member={member}
                        isSelected={isSelected}
                        splitType={splitType}
                        memberSplits={memberSplits}
                        selectedMembers={selectedMembers}
                        currentAmount={currentAmount}
                        setError={setError}
                        clearErrors={clearErrors}
                        fieldPrefix={`items.${index}`}
                      />
                    </FormItem>
                  );
                })}
                <FormMessage className="form-item-message" />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseMultiItemSection;
