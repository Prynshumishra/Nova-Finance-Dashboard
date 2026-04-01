const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) => USD_FORMATTER.format(Number(value) || 0);

export const formatAmount = (value, type) => {
  const sign = type === "expense" ? "-" : "+";
  return `${sign}${formatCurrency(Math.abs(Number(value) || 0))}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
