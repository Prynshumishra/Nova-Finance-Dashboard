import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Zap } from "lucide-react";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import InsightsPage from "./pages/InsightsPage";
import { FinanceProvider } from "./context/FinanceContext";

const PAGE_META = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Your financial pulse in one glance",
  },
  transactions: {
    title: "Transactions",
    subtitle: "Explore and manage money movement",
  },
  insights: {
    title: "Insights",
    subtitle: "Smart spending patterns and observations",
  },
};

/** Wraps a page in a keyed fade+slide transition */
function PageTransition({ pageKey, children }) {
  return (
    <div key={pageKey} className="animate-fade-in-up" style={{ animationDuration: "0.35s" }}>
      {children}
    </div>
  );
}

function AppShell() {
  const [activePage, setActivePage]     = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [displayPage, setDisplayPage]   = useState("dashboard");
  const transitionTimer                 = useRef(null);

  const pageMeta = useMemo(
    () => PAGE_META[activePage] || PAGE_META.dashboard,
    [activePage],
  );

  const handlePageChange = (pageId) => {
    if (pageId === activePage) {
      setIsSidebarOpen(false);
      return;
    }
    clearTimeout(transitionTimer.current);
    
    // Reset scroll back to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    setActivePage(pageId);
    setDisplayPage(pageId);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen">
      {/* ── Mobile topbar ── */}
      <header
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 lg:hidden"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border-soft)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 1px 12px rgba(79,70,229,0.08)",
        }}
      >
        <button
          type="button"
          className="chip !h-9 !w-9 !px-0"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={17} />
        </button>

        {/* Brand mark */}
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              boxShadow: "0 2px 8px rgba(79,70,229,0.4)",
            }}
          >
            <Zap size={13} color="#fff" fill="#fff" />
          </span>
          <p className="fintech-title text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Nova Finance
          </p>
        </div>

        {/* Divider */}
        <div className="mx-1 h-5 w-px" style={{ background: "var(--border-soft)" }} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {pageMeta.title}
          </p>
        </div>

        {/* Live dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: "var(--success)", animation: "ping-ring 1.4s cubic-bezier(0,0,0.2,1) infinite" }}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
        </span>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ backgroundColor: "rgba(8, 14, 30, 0.55)" }}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="mx-auto flex w-full max-w-[1440px] gap-0 lg:gap-7 lg:px-6 lg:py-6">
        <Sidebar
          activePage={activePage}
          onPageChange={handlePageChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 sm:px-5 lg:px-0 lg:py-0">
          {displayPage === "dashboard" && (
            <PageTransition pageKey={`dashboard-${displayPage}`}>
              <DashboardPage onViewTransactions={() => handlePageChange("transactions")} />
            </PageTransition>
          )}
          {displayPage === "transactions" && (
            <PageTransition pageKey={`transactions-${displayPage}`}>
              <TransactionsPage />
            </PageTransition>
          )}
          {displayPage === "insights" && (
            <PageTransition pageKey={`insights-${displayPage}`}>
              <InsightsPage />
            </PageTransition>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppShell />
    </FinanceProvider>
  );
}

export default App;