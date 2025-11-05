import { useState, useRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type TitleInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  isOptional?: boolean;
  variant?: "default" | "compact";
  onFocusChange?: (focused: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

const TitleInput = <T extends FieldValues>({
  control,
  name,
  label = "Title",
  placeholder = "Enter a title",
  isOptional = false,
  variant = "default",
  onFocusChange,
  inputRef: externalInputRef,
}: TitleInputProps<T>) => {
  // Compact variant states
  const [isFocused, setIsFocused] = useState(false);
  const internalInputRef = useRef<HTMLInputElement>(null);

  // Use external ref if provided, otherwise use internal ref
  const inputRef = externalInputRef || internalInputRef;

  const handleTextClick = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    if (variant === "compact") {
      setTimeout(() => {
        setIsFocused(false);
        onFocusChange?.(false);
      }, 0);
    }
  };

  // Compact variant rendering
  if (variant === "compact") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const hasValue = field.value && field.value.trim() !== "";
          const showAsText = hasValue && !isFocused;

          return (
            <div className="flex flex-col">
              <FormControl>
                <div className="relative">
                  {showAsText ? (
                    <div
                      className="group h-9 flex items-center font-medium text-base px-1 rounded outline-none focus:ring-2 focus:ring-ring/20 hover:cursor-text"
                      onClick={handleTextClick}
                      onFocus={handleTextClick}
                      tabIndex={0}
                    >
                      <span className="relative inline-block">
                        {field.value}
                        <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-current opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </span>
                    </div>
                  ) : (
                    <Input
                      placeholder={placeholder}
                      className="h-9 w-full"
                      type="text"
                      autoFocus={isFocused}
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        if (inputRef && "current" in inputRef) {
                          (
                            inputRef as React.MutableRefObject<HTMLInputElement | null>
                          ).current = e;
                        }
                      }}
                      value={field.value || ""}
                      onChange={field.onChange}
                      onFocus={() => {
                        setIsFocused(true);
                        onFocusChange?.(true);
                      }}
                      onBlur={handleInputBlur}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </div>
          );
        }}
      />
    );
  }

  // Default variant rendering
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <div className="form-label-row">
            <FormLabel className="form-item-label">
              {label}
              {isOptional && (
                <span className="text-muted-foreground font-normal text-sm">
                  {" "}
                  (optional)
                </span>
              )}
            </FormLabel>
            <FormMessage className="form-item-message" />
          </div>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type="text"
                id={name}
                {...field}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
          </div>
        </div>
      )}
    />
  );
};

export default TitleInput;
