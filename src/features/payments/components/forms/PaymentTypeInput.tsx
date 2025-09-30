import { FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, FormTabsList, FormTabsTrigger } from "@/components/ui/tabs";

type PaymentTypeInputProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const PaymentTypeInput = ({ value, onValueChange }: PaymentTypeInputProps) => {
  return (
    <div className="form-item">
      <div className="form-label-row">
        <FormLabel className="form-item-label">Payment Type</FormLabel>
        <FormMessage className="form-item-message" />
      </div>
      <FormControl>
        <div className="input-class">
          <Tabs value={value} onValueChange={onValueChange}>
            <FormTabsList>
              <FormTabsTrigger value="expense">Expenses</FormTabsTrigger>
              <FormTabsTrigger value="settlement">Settlements</FormTabsTrigger>
            </FormTabsList>
          </Tabs>
        </div>
      </FormControl>
    </div>
  );
};

export default PaymentTypeInput;
