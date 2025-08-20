import * as React from "react";
import { Column } from "@tanstack/react-table";
import { ListFilterPlus, X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ExpenseTableDateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

type DateFilterType = "before" | "after" | "between";

interface DateFilter {
  type: DateFilterType;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
}

export function ExpenseTableDateFilter<TData, TValue>({
  column,
  title,
}: ExpenseTableDateFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);
  const [filterType, setFilterType] = React.useState<DateFilterType>("after");
  const [date, setDate] = React.useState<Date>();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const currentFilter = column?.getFilterValue() as DateFilter | undefined;

  const applyFilter = () => {
    let filter: DateFilter;

    if (filterType === "between") {
      if (dateRange?.from && dateRange?.to) {
        filter = {
          type: "between",
          startDate: dateRange.from,
          endDate: dateRange.to,
        };
      } else {
        return; // Don't apply if range is incomplete
      }
    } else {
      if (date) {
        filter = {
          type: filterType,
          date: date,
        };
      } else {
        return; // Don't apply if no date selected
      }
    }

    column?.setFilterValue(filter);
    setOpen(false);
  };

  const clearFilter = () => {
    column?.setFilterValue(undefined);
    setDate(undefined);
    setDateRange(undefined);
    setOpen(false);
  };

  const getFilterLabel = () => {
    if (!currentFilter) return null;

    if (
      currentFilter.type === "between" &&
      currentFilter.startDate &&
      currentFilter.endDate
    ) {
      return `${format(currentFilter.startDate, "MMM dd")} - ${format(
        currentFilter.endDate,
        "MMM dd"
      )}`;
    } else if (currentFilter.date) {
      const prefix = currentFilter.type === "before" ? "Before" : "After";
      return `${prefix} ${format(currentFilter.date, "MMM dd, yyyy")}`;
    }
    return null;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <ListFilterPlus className="h-4 w-4" />
          {title}
          {currentFilter && (
            <>
              <div className="hidden lg:flex">
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal ml-2"
                >
                  {getFilterLabel()}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Filter Type
            </label>
            <Select
              value={filterType}
              onValueChange={(value: DateFilterType) => setFilterType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after">After</SelectItem>
                <SelectItem value="before">Before</SelectItem>
                <SelectItem value="between">Between</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filterType === "between" ? (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Date Range
              </label>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className=""
              />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium mb-2 block">
                {filterType === "before" ? "Before Date" : "After Date"}
              </label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className=""
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={applyFilter} size="sm">
              Apply Filter
            </Button>
            {currentFilter && (
              <Button onClick={clearFilter} variant="outline" size="sm">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
