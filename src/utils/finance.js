import { DEFAULT_CATEGORIES, TRANSACTION_TYPES } from "../data/categories";

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short" });

const toMonthKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const fromMonthKey = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
};

const safeDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getSummaryTotals = (transactions) => {
  const totals = transactions.reduce(
    (accumulator, transaction) => {
      const amount = Number(transaction.amount) || 0;

      if (transaction.type === TRANSACTION_TYPES.INCOME) {
        accumulator.income += amount;
      } else {
        accumulator.expenses += amount;
      }

      return accumulator;
    },
    { income: 0, expenses: 0 },
  );

  return {
    ...totals,
    balance: totals.income - totals.expenses,
  };
};

export const getLastMonthKeys = (count, now = new Date()) => {
  const keys = [];

  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    keys.push(toMonthKey(date));
  }

  return keys;
};

export const getMonthlyBalanceSeries = (transactions, monthCount = 6) => {
  const monthKeys = getLastMonthKeys(monthCount);
  const monthBucket = monthKeys.reduce((accumulator, key) => {
    accumulator[key] = { income: 0, expenses: 0 };
    return accumulator;
  }, {});

  transactions.forEach((transaction) => {
    const date = safeDate(transaction.date);
    if (!date) {
      return;
    }

    const key = toMonthKey(date);
    if (!monthBucket[key]) {
      return;
    }

    const amount = Number(transaction.amount) || 0;

    if (transaction.type === TRANSACTION_TYPES.INCOME) {
      monthBucket[key].income += amount;
    } else {
      monthBucket[key].expenses += amount;
    }
  });

  let rollingBalance = 0;
  return monthKeys.map((key) => {
    const monthData = monthBucket[key];
    const monthNet = monthData.income - monthData.expenses;
    rollingBalance += monthNet;

    return {
      key,
      month: MONTH_FORMATTER.format(fromMonthKey(key)),
      income: monthData.income,
      expenses: monthData.expenses,
      net: monthNet,
      balance: rollingBalance,
    };
  });
};

export const getExpenseCategoryBreakdown = (transactions) => {
  const categoryTotals = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== TRANSACTION_TYPES.EXPENSE) {
      return accumulator;
    }

    const category = transaction.category || "Other";
    accumulator[category] = (accumulator[category] || 0) + (Number(transaction.amount) || 0);
    return accumulator;
  }, {});

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value);
};

export const getUniqueCategories = (transactions) => {
  const dynamicCategories = transactions
    .map((transaction) => transaction.category)
    .filter(Boolean);

  return [...new Set([...DEFAULT_CATEGORIES, ...dynamicCategories])].sort((left, right) =>
    left.localeCompare(right),
  );
};

export const filterAndSortTransactions = (transactions, filters) => {
  const normalizedSearch = (filters.search || "").trim().toLowerCase();
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const dateTo   = filters.dateTo   ? new Date(filters.dateTo)   : null;
  // dateTo should be inclusive — set to end of that day
  if (dateTo) dateTo.setHours(23, 59, 59, 999);

  const amountMin = filters.amountMin !== "" && filters.amountMin != null ? Number(filters.amountMin) : null;
  const amountMax = filters.amountMax !== "" && filters.amountMax != null ? Number(filters.amountMax) : null;

  const filtered = transactions.filter((transaction) => {
    const matchesType     = filters.type === "all" || transaction.type === filters.type;
    const matchesCategory = filters.category === "all" || transaction.category === filters.category;
    const matchesSearch   =
      !normalizedSearch ||
      transaction.description.toLowerCase().includes(normalizedSearch) ||
      transaction.category.toLowerCase().includes(normalizedSearch);

    // Date range
    const txDate = safeDate(transaction.date);
    const matchesDateFrom = !dateFrom || !txDate || txDate >= dateFrom;
    const matchesDateTo   = !dateTo   || !txDate || txDate <= dateTo;

    // Amount range
    const txAmount = Number(transaction.amount);
    const matchesAmountMin = amountMin === null || txAmount >= amountMin;
    const matchesAmountMax = amountMax === null || txAmount <= amountMax;

    return (
      matchesType &&
      matchesCategory &&
      matchesSearch &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesAmountMin &&
      matchesAmountMax
    );
  });

  const sorted = [...filtered].sort((left, right) => {
    switch (filters.sortBy) {
      case "date-asc":
        return new Date(left.date) - new Date(right.date);
      case "amount-desc":
        return Number(right.amount) - Number(left.amount);
      case "amount-asc":
        return Number(left.amount) - Number(right.amount);
      case "date-desc":
      default:
        return new Date(right.date) - new Date(left.date);
    }
  });

  return sorted;
};

const MONTH_LABEL_FMT = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const DAY_LABEL_FMT   = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

/**
 * Groups a flat transaction array into labelled sections.
 * @param {"none"|"day"|"month"|"category"} groupBy
 * @returns {{ key: string, label: string, transactions: object[], total: number, income: number, expenses: number }[]}
 */
export const groupTransactions = (transactions, groupBy) => {
  if (!groupBy || groupBy === "none") {
    return [{ key: "all", label: "All Transactions", transactions, total: 0, income: 0, expenses: 0 }];
  }

  const groups = new Map();

  transactions.forEach((tx) => {
    let key;
    let label;

    if (groupBy === "category") {
      key   = tx.category || "Other";
      label = key;
    } else {
      const date = safeDate(tx.date);
      if (!date) {
        key   = "unknown";
        label = "Unknown Date";
      } else if (groupBy === "day") {
        key   = tx.date.slice(0, 10);
        label = DAY_LABEL_FMT.format(date);
      } else {
        // month
        key   = toMonthKey(date);
        label = MONTH_LABEL_FMT.format(date);
      }
    }

    if (!groups.has(key)) {
      groups.set(key, { key, label, transactions: [], income: 0, expenses: 0 });
    }

    const group = groups.get(key);
    group.transactions.push(tx);
    if (tx.type === TRANSACTION_TYPES.INCOME) {
      group.income += Number(tx.amount) || 0;
    } else {
      group.expenses += Number(tx.amount) || 0;
    }
  });

  return Array.from(groups.values()).map((g) => ({
    ...g,
    total: g.income - g.expenses,
  }));
};

export const getMonthComparison = (transactions, now = new Date()) => {
  const currentMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentKey = toMonthKey(currentMonthDate);
  const previousKey = toMonthKey(previousMonthDate);

  const monthTotals = transactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type !== TRANSACTION_TYPES.EXPENSE) {
        return accumulator;
      }

      const date = safeDate(transaction.date);
      if (!date) {
        return accumulator;
      }

      const key = toMonthKey(date);
      if (!accumulator[key]) {
        accumulator[key] = 0;
      }

      accumulator[key] += Number(transaction.amount) || 0;
      return accumulator;
    },
    { [currentKey]: 0, [previousKey]: 0 },
  );

  const currentTotal = monthTotals[currentKey] || 0;
  const previousTotal = monthTotals[previousKey] || 0;

  const changePercent =
    previousTotal === 0 ? (currentTotal > 0 ? 100 : 0) : ((currentTotal - previousTotal) / previousTotal) * 100;

  return {
    currentTotal,
    previousTotal,
    changePercent,
    currentLabel: MONTH_FORMATTER.format(currentMonthDate),
    previousLabel: MONTH_FORMATTER.format(previousMonthDate),
  };
};

export const getHighestSpendingCategory = (transactions, now = new Date()) => {
  const currentKey = toMonthKey(new Date(now.getFullYear(), now.getMonth(), 1));

  const categoryTotals = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== TRANSACTION_TYPES.EXPENSE) {
      return accumulator;
    }

    const date = safeDate(transaction.date);
    if (!date || toMonthKey(date) !== currentKey) {
      return accumulator;
    }

    const category = transaction.category || "Other";
    accumulator[category] = (accumulator[category] || 0) + (Number(transaction.amount) || 0);
    return accumulator;
  }, {});

  const entries = Object.entries(categoryTotals).sort((left, right) => right[1] - left[1]);
  if (!entries.length) {
    return null;
  }

  return {
    name: entries[0][0],
    total: entries[0][1],
  };
};

export const getCategoryTrendObservation = (transactions, now = new Date()) => {
  const currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentKey = toMonthKey(currentDate);
  const previousKey = toMonthKey(previousDate);

  const spendByMonthCategory = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== TRANSACTION_TYPES.EXPENSE) {
      return accumulator;
    }

    const date = safeDate(transaction.date);
    if (!date) {
      return accumulator;
    }

    const key = toMonthKey(date);
    const category = transaction.category || "Other";

    if (!accumulator[key]) {
      accumulator[key] = {};
    }

    accumulator[key][category] = (accumulator[key][category] || 0) + (Number(transaction.amount) || 0);
    return accumulator;
  }, {});

  const currentCategories = spendByMonthCategory[currentKey] || {};
  const topCurrent = Object.entries(currentCategories).sort((left, right) => right[1] - left[1])[0];

  if (!topCurrent) {
    return "No expense transactions recorded this month yet.";
  }

  const [category, currentAmount] = topCurrent;
  const previousAmount = (spendByMonthCategory[previousKey] || {})[category] || 0;

  if (previousAmount === 0) {
    return `${category} is a new major spending category this month.`;
  }

  const delta = ((currentAmount - previousAmount) / previousAmount) * 100;
  const direction = delta >= 0 ? "more" : "less";

  return `You spent ${Math.abs(delta).toFixed(0)}% ${direction} on ${category} compared to last month.`;
};

/**
 * Aggregates expense data by day of the week.
 * @returns {{ day: string, total: number, percent: number }[]}
 */
export const getSpendingByDayOfWeek = (transactions) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayTotals = Array(7).fill(0);

  transactions.forEach((tx) => {
    if (tx.type === TRANSACTION_TYPES.EXPENSE) {
      const date = safeDate(tx.date);
      if (date) {
        dayTotals[date.getDay()] += Number(tx.amount) || 0;
      }
    }
  });

  const max = Math.max(...dayTotals, 1);
  return dayTotals.map((total, i) => ({
    day: days[i],
    total,
    percent: (total / max) * 100,
  }));
};

/**
 * Projects current month's expenses based on the daily average so far.
 */
export const getMonthlyPrediction = (transactions, now = new Date()) => {
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayOfMonth = now.getDate();

  const currentMonthExpenses = transactions
    .filter((tx) => {
      const date = safeDate(tx.date);
      return (
        tx.type === TRANSACTION_TYPES.EXPENSE &&
        date &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  if (dayOfMonth === 0) return { predictedTotal: 0, currentMonthExpenses: 0 };

  const dailyAvg = currentMonthExpenses / dayOfMonth;
  const predictedTotal = dailyAvg * daysInMonth;

  return {
    predictedTotal,
    currentMonthExpenses,
  };
};
