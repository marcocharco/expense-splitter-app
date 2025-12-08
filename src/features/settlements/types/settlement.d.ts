export type SettlementStatus = "open" | "closed";

export type Settlement = {
  id: string;
  title: string;
  created_by: {
    id: string;
    name: string;
  };
  status: SettlementStatus;
  participants: {
    user: {
      id: string;
      name: string;
    };
    initial_balance: number;
    remaining_balance: number;
  }[];
};

