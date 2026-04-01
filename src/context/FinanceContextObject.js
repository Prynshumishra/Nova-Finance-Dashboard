import { createContext } from "react";

export const FinanceContext = createContext(undefined);

/** API status values */
export const API_STATUS = {
  IDLE:    "idle",
  LOADING: "loading",
  SYNCED:  "synced",
  ERROR:   "error",
};
