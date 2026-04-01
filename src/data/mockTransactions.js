import { TRANSACTION_TYPES } from "./categories";

const toIsoDate = (date) => date.toISOString().slice(0, 10);

const createDate = (monthOffset, day) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(day);
  date.setMonth(date.getMonth() + monthOffset);
  return toIsoDate(date);
};

export const mockTransactions = [
  {
    id: "tx-001",
    date: createDate(-3, 1),
    description: "TechCorp Inc. Payroll",
    category: "Salary",
    amount: 8500,
    type: TRANSACTION_TYPES.INCOME,
  },
  {
    id: "tx-002",
    date: createDate(-3, 3),
    description: "Downtown Penthouse Lease",
    category: "Housing",
    amount: 2800,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-003",
    date: createDate(-3, 6),
    description: "Acme Corp Consulting Retainer",
    category: "Freelance",
    amount: 3200,
    type: TRANSACTION_TYPES.INCOME,
  },
  {
    id: "tx-004",
    date: createDate(-3, 9),
    description: "Whole Foods Premium Market",
    category: "Food",
    amount: 450,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-005",
    date: createDate(-2, 1),
    description: "TechCorp Inc. Payroll",
    category: "Salary",
    amount: 8500,
    type: TRANSACTION_TYPES.INCOME,
  },
  {
    id: "tx-006",
    date: createDate(-2, 4),
    description: "ConEdison Utilities",
    category: "Utilities",
    amount: 310,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-007",
    date: createDate(-2, 7),
    description: "Uber Black Premium",
    category: "Transport",
    amount: 180,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-008",
    date: createDate(-2, 11),
    description: "Vanguard S&P 500 Dividend",
    category: "Investments",
    amount: 650,
    type: TRANSACTION_TYPES.INCOME,
  },
  {
    id: "tx-009",
    date: createDate(-2, 13),
    description: "Michelin Star Dinner",
    category: "Food",
    amount: 520,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-010",
    date: createDate(-1, 1),
    description: "TechCorp Inc. Payroll",
    category: "Salary",
    amount: 8500,
    type: TRANSACTION_TYPES.INCOME,
  },
  {
    id: "tx-011",
    date: createDate(-1, 2),
    description: "Downtown Penthouse Lease",
    category: "Housing",
    amount: 2800,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-012",
    date: createDate(-1, 5),
    description: "Emirates Business Class",
    category: "Travel",
    amount: 1800,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-013",
    date: createDate(-1, 10),
    description: "Series A Advisory Fee",
    category: "Freelance",
    amount: 4500,
    type: TRANSACTION_TYPES.INCOME,
  },
  {
    id: "tx-014",
    date: createDate(-1, 12),
    description: "Symphony Orchestra Tickets",
    category: "Entertainment",
    amount: 250,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-015",
    date: createDate(0, 1),
    description: "TechCorp Inc. Payroll",
    category: "Salary",
    amount: 8500,
    type: TRANSACTION_TYPES.INCOME,
  },
  {
    id: "tx-016",
    date: createDate(0, 3),
    description: "Downtown Penthouse Lease",
    category: "Housing",
    amount: 2800,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-017",
    date: createDate(0, 6),
    description: "Artisan Coffee Roasters",
    category: "Food",
    amount: 85,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-018",
    date: createDate(0, 8),
    description: "Venture Capital Deal Sourcing",
    category: "Freelance",
    amount: 2750,
    type: TRANSACTION_TYPES.INCOME,
  },
  {
    id: "tx-019",
    date: createDate(0, 11),
    description: "Concierge Medical Serivce",
    category: "Healthcare",
    amount: 450,
    type: TRANSACTION_TYPES.EXPENSE,
  },
  {
    id: "tx-020",
    date: createDate(0, 13),
    description: "Equinox Elite Membership",
    category: "Healthcare",
    amount: 320,
    type: TRANSACTION_TYPES.EXPENSE,
  },
];
