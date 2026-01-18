export type ActivityType =
  | 'create_expense'
  | 'update_expense'
  | 'delete_expense'
  | 'create_settlement'
  | 'create_payment'
  | 'pay_expense';

export type EntityType = 'expense' | 'settlement' | 'payment' | 'group';

export type ActivityMeta =
  | ExpenseCreateMeta
  | ExpenseUpdateMeta
  | ExpenseDeleteMeta
  | ExpensePaymentMeta
  | PaymentCreateMeta
  | SettlementCreateMeta;

export type ExpenseCreateMeta = {
  action: 'created';
  expense: {
    title: string;
    amount: number;
    paid_by: string;
    date: string;
  };
};

export type ExpenseUpdateMeta = {
  action: 'updated';
  changes: Array<{
    field: string;
    before: unknown;
    after: unknown;
  }>;
  expense: {
    id: string;
    title: string;
  };
};

export type ExpenseDeleteMeta = {
  action: 'deleted';
  expense: {
    id: string;
    title: string;
    amount: number;
  };
};

export type ExpensePaymentMeta = {
  action: 'payment_applied';
  payment: {
    id: string;
    amount: number;
    paid_by: string;
    paid_to: string;
  };
  expense: {
    id: string;
    title: string;
  };
  allocations: Array<{
    expense_id: string;
    amount: number;
  }>;
};

export type PaymentCreateMeta = {
  action: 'created';
  payment: {
    id: string;
    amount: number;
    paid_by: string;
    paid_to: string;
    type: 'expense' | 'settlement';
  };
  targets?: Array<{
    type: 'expense' | 'settlement';
    id: string;
    amount: number;
    title?: string;
  }>;
};

export type SettlementCreateMeta = {
  action: 'created';
  settlement: {
    id: string;
    title: string;
    expense_count: number;
  };
};

export type Activity = {
  id: string;
  group_id: string;
  actor_id: string;
  activity_type: ActivityType;
  entity_type: EntityType;
  entity_id: string;
  target_user_id: string | null;
  meta: ActivityMeta;
  created_at: string;
  actor?: {
    id: string;
    name: string;
  };
};



