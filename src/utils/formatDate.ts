/** Converts yyyy-mm-dd string to Date object */
export const YMDToDate = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
};

/** Converts Date object to yyyy-mm-dd string */
export const DateToYMD = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

/** Formate date as text */
export const formatDisplayDate = (value: string): string => {
  const date = YMDToDate(value);
  return date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
};
