import { useState } from "react";
import { X } from "lucide-react";
import { TRANSACTION_TYPES } from "../../data/categories";

const EMPTY_FORM = {
  description: "",
  category: "Food",
  amount: "",
  type: TRANSACTION_TYPES.EXPENSE,
};

const getEmptyForm = () => ({
  ...EMPTY_FORM,
  date: new Date().toISOString().slice(0, 10),
});

const getInitialForm = (initialTransaction) => {
  if (!initialTransaction) {
    return getEmptyForm();
  }

  return {
    date: initialTransaction.date,
    description: initialTransaction.description,
    category: initialTransaction.category,
    amount: String(initialTransaction.amount),
    type: initialTransaction.type,
  };
};

export default function TransactionFormModal({
  onClose,
  onSubmit,
  initialTransaction,
  categories,
}) {
  const [form, setForm] = useState(() => getInitialForm(initialTransaction));
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setError("");
    setForm((previousForm) => ({ ...previousForm, [field]: value }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const amountValue = Number(form.amount);

    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    onSubmit({
      ...form,
      description: form.description.trim(),
      amount: amountValue,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl max-sm:max-h-[92vh] max-sm:overflow-y-auto rounded-t-3xl border border-slate-200/70 bg-white p-4 shadow-2xl dark:border-slate-700/70 dark:bg-slate-900 sm:rounded-3xl sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="fintech-title text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">
            {initialTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <button type="button" onClick={onClose} className="chip" aria-label="Close form">
            <X size={16} />
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-slate-500 dark:text-slate-400">Date</span>
              <input
                type="date"
                className="input-base"
                value={form.date}
                onChange={(event) => handleChange("date", event.target.value)}
                required
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-slate-500 dark:text-slate-400">Type</span>
              <select
                className="input-base"
                value={form.type}
                onChange={(event) => handleChange("type", event.target.value)}
              >
                <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
                <option value={TRANSACTION_TYPES.INCOME}>Income</option>
              </select>
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Description</span>
            <input
              type="text"
              placeholder="Add a short description"
              className="input-base"
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              required
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-slate-500 dark:text-slate-400">Category</span>
              <select
                className="input-base"
                value={form.category}
                onChange={(event) => handleChange("category", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-slate-500 dark:text-slate-400">Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                className="input-base"
                value={form.amount}
                onChange={(event) => handleChange("amount", event.target.value)}
                required
              />
            </label>
          </div>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialTransaction ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
