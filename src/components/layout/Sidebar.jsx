import {
  RefreshCw,
  RotateCcw,
  X,
  LayoutDashboard,
  Lightbulb,
  MoonStar,
  ReceiptText,
  ShieldCheck,
  SunMedium,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  User,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useFinance } from "../../context/useFinance";
import { API_STATUS } from "../../context/FinanceContextObject";
import { ROLES } from "../../data/categories";

const navigationItems = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, desc: "Overview" },
  { id: "transactions", label: "Transactions", icon: ReceiptText,     desc: "Manage" },
  { id: "insights",     label: "Insights",     icon: Lightbulb,       desc: "Analytics" },
];

function SyncIndicator({ apiStatus, lastSyncedAt, onSync, isCollapsed }) {
  const formatTime = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const configs = {
    [API_STATUS.LOADING]: {
      icon: <RefreshCw size={12} className="animate-spin-slow" style={{ color: "#818CF8" }} />,
      label: "Syncing…",
      color: "#818CF8",
      bg: "rgba(99,102,241,0.12)",
    },
    [API_STATUS.SYNCED]: {
      icon: <CheckCircle2 size={12} style={{ color: "var(--success)" }} />,
      label: `Synced ${formatTime(lastSyncedAt)}`,
      color: "var(--success)",
      bg: "var(--success-light)",
    },
    [API_STATUS.ERROR]: {
      icon: <AlertCircle size={12} style={{ color: "var(--danger)" }} />,
      label: "Sync failed",
      color: "var(--danger)",
      bg: "var(--danger-light)",
    },
    [API_STATUS.IDLE]: {
      icon: <Clock size={12} style={{ color: "var(--text-muted)" }} />,
      label: "Idle",
      color: "var(--text-muted)",
      bg: "var(--bg-subtle)",
    },
  };

  const cfg = configs[apiStatus] || configs[API_STATUS.IDLE];

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div 
          className="flex h-8 w-8 items-center justify-center rounded-full" 
          style={{ background: cfg.bg }}
          title={cfg.label}
        >
          {cfg.icon}
        </div>
        {apiStatus !== API_STATUS.LOADING && (
          <button
            type="button"
            onClick={onSync}
            className="chip !h-8 !w-8 !px-0"
            aria-label="Sync now"
            title="Sync now"
          >
            <RefreshCw size={11} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div
        className="flex min-w-0 items-center gap-2 rounded-full px-2.5 py-1"
        style={{ background: cfg.bg }}
      >
        {cfg.icon}
        <span className="truncate text-[11px] font-medium" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
      </div>
      {apiStatus !== API_STATUS.LOADING && (
        <button
          type="button"
          onClick={onSync}
          className="chip !h-7 !w-7 !px-0 shrink-0"
          aria-label="Sync now"
          title="Sync now"
        >
          <RefreshCw size={11} />
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ activePage, onPageChange, isOpen, onClose }) {
  const [isCollapsed, setIsCollapsed] = useLocalStorage("finance-dashboard-sidebar-v1", false);

  const {
    role, setRole, theme, toggleTheme,
    apiStatus, lastSyncedAt, triggerSync, resetToDefaults,
  } = useFinance();

  const handleReset = () => {
    if (window.confirm("Reset all transactions to demo data? This cannot be undone.")) {
      resetToDefaults();
    }
  };

  const isAdmin = role === ROLES.ADMIN;

  return (
    <aside
      className={`fixed inset-y-3 left-3 z-50 flex shrink-0 transform flex-col transition-all duration-300 ease-in-out md:p-5 lg:sticky lg:inset-y-auto lg:left-auto lg:top-6 lg:z-auto lg:h-[calc(100vh-3rem)] lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-[115%]"
      } ${
        isCollapsed ? "lg:w-20 lg:p-3" : "lg:w-72 lg:p-4"
      } w-[min(86vw,320px)] p-4 overflow-y-auto overflow-x-hidden`}
      style={{
        background: "var(--sidebar-bg)",
        border: "1px solid var(--sidebar-border)",
        borderRadius: "1.25rem",
        boxShadow: "var(--shadow-md)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* ── Brand ── */}
      <div className={`flex items-center justify-between gap-3 ${isCollapsed ? "flex-col" : "flex-row"}`}>
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              boxShadow: "0 4px 14px rgba(79,70,229,0.45)",
            }}
          >
            <Zap size={16} color="#fff" fill="#fff" />
          </span>
          {!isCollapsed && (
            <div className="min-w-0 animate-fade-in whitespace-nowrap">
              <p className="fintech-title truncate text-base font-bold" style={{ color: "var(--text-primary)" }}>
                Nova Finance
              </p>
              <p className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
                Personal intelligence
              </p>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-1.5 ${isCollapsed ? "flex-col" : "flex-row"}`}>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="chip hidden !h-8 !w-8 !px-0 lg:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
          
          <button
            type="button"
            onClick={toggleTheme}
            className={`chip !h-8 !w-8 !px-0 ${isCollapsed ? "flex" : "flex"}`}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "light" ? <MoonStar size={15} /> : <SunMedium size={15} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="chip !h-8 !w-8 !px-0 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="section-divider my-4" />

      {/* ── Nav ── */}
      <nav className="grid grid-cols-1 gap-1">
        {navigationItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-pill animate-fade-in-up stagger-${i + 1} ${isActive ? "nav-pill-active" : "nav-pill-idle"} ${isCollapsed ? "justify-center px-0" : ""}`}
              onClick={() => onPageChange(item.id)}
              title={isCollapsed ? item.label : ""}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white/20"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Icon size={15} />
              </span>
              {!isCollapsed && <span className="flex-1 text-left text-sm font-semibold truncate animate-fade-in">{item.label}</span>}
              {isActive && !isCollapsed && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide animate-fade-in">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Sync status ── */}
      <div
        className="mt-4 rounded-xl p-3"
        style={{
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-soft)",
        }}
      >
        {!isCollapsed && (
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
            API Status
          </p>
        )}
        <SyncIndicator apiStatus={apiStatus} lastSyncedAt={lastSyncedAt} onSync={triggerSync} isCollapsed={isCollapsed} />
      </div>

      {/* ── Role ── */}
      <div
        className={`mt-3 rounded-xl ${isCollapsed ? "p-2" : "p-3.5"}`}
        style={{
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-soft)",
        }}
      >
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                Active Role
              </p>
              <span
                className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  background: isAdmin ? "var(--primary-light)" : "var(--bg-card)",
                  color: isAdmin ? "var(--primary)" : "var(--text-secondary)",
                  border: `1px solid ${isAdmin ? "rgba(79,70,229,0.2)" : "var(--border-soft)"}`,
                }}
              >
                {isAdmin ? <ShieldCheck size={10} /> : <Eye size={10} />}
                {isAdmin ? "Admin" : "Viewer"}
              </span>
            </div>

            <select
              className="input-base mt-3 text-xs"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Select role"
            >
              <option value={ROLES.VIEWER}>👁 Viewer — read only</option>
              <option value={ROLES.ADMIN}>🛡 Admin — full access</option>
            </select>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => setRole(role === ROLES.ADMIN ? ROLES.VIEWER : ROLES.ADMIN)}
              className="chip !h-8 !w-8 !px-0"
              title={`Switch to ${role === ROLES.ADMIN ? "Viewer" : "Admin"}`}
            >
              {isAdmin ? <ShieldCheck size={15} className="text-indigo-500" /> : <Eye size={15} />}
            </button>
          </div>
        )}
      </div>

      {/* ── User stub ── */}
      <div
        className={`mt-3 flex items-center rounded-xl ${isCollapsed ? "justify-center p-2" : "gap-3 p-3"}`}
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-soft)" }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            color: "#fff",
          }}
          title="Nova User (nova@finance.app)"
        >
          NF
        </span>
        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1 animate-fade-in">
              <p className="truncate text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                Nova User
              </p>
              <p className="truncate text-[10px]" style={{ color: "var(--text-muted)" }}>
                nova@finance.app
              </p>
            </div>
            <User size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          </>
        )}
      </div>

      {/* ── Reset ── */}
      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={handleReset}
          className={`flex items-center justify-center gap-2 rounded-xl text-xs font-medium transition-all duration-150 ${isCollapsed ? "h-10 w-full" : "w-full px-3 py-2.5"}`}
          style={{
            color: "var(--text-muted)",
            border: "1px solid var(--border-soft)",
            background: "transparent",
          }}
          title={isCollapsed ? "Reset to Demo Data" : ""}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--danger)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)";
            e.currentTarget.style.background = "var(--danger-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.borderColor = "var(--border-soft)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <RotateCcw size={13} />
          {!isCollapsed && "Reset to Demo Data"}
        </button>
      </div>
    </aside>
  );
}
