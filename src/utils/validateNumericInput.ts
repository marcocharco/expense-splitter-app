export function validateNumericInput(rawInput: string): {
  value: string;
  isValid: boolean;
} {
  const cleanInput = rawInput.replace(/[^0-9. +*/()\-]/g, "");
  let invalidInputFlag = false;

  // Only allow up to 2 decimal places, and only one decimal point per expression term
  if (cleanInput.includes(".")) {
    const terms = cleanInput.split(/[ +*/\-]/g);

    for (const term of terms) {
      // no more than one decimal point per term in expression
      if (term.replace(/[^.]/g, "").length > 1) {
        invalidInputFlag = true;
        break;
      } else {
        // no more than two decimal places per term
        const [, decimal] = term.split(".");
        if (decimal && decimal.length > 2) {
          invalidInputFlag = true;
          break;
        }
      }
    }
  }

  return { value: cleanInput, isValid: !invalidInputFlag };
}
