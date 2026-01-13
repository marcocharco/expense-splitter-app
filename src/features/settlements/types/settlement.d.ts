export type SettlementStatus = "open" | "closed";

export type Settlement = {
  id: string;
  title: string;
  status: SettlementStatus;
  created_at: string;
  created_by: {
    id: string;
    name: string;
  };
  participants: {
    user: {
      id: string;
      name: string;
    };
    initial_balance: number;
    remaining_balance: number;
  }[];
};
