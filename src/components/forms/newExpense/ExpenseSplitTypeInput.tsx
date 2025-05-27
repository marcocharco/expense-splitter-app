import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ExpenseSplitTypeInput = () => {
  return (
    <FormField
      name="splitType"
      render={({ field }) => (
        <>
          <FormLabel className="form-label">Split Type</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a split type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="even">Even</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="shares">Shares</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="form-message" />
        </>
      )}
    />
  );
};

export default ExpenseSplitTypeInput;
