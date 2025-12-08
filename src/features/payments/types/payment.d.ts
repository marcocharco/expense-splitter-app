export type Payment = {
  id: string;
  group_id: string;
  paid_by: {
    id: string;
    name: string;
  };
  paid_to: {
    id: string;
    name: string;
  };
  settlement: {
    id: string;
    status: string;
    title: string;
  } | null;
  amount: number;
  date: string;
  expense_allocations: {
    amount: number;
    expense: {
      id: string;
      title: string;
    };
  }[];
};

