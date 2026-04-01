# ⚡ Nova Finance | Universal Financial Intelligence

Nova Finance is a premium, high-performance financial dashboard built with **React 19**, **Tailwind CSS**, and **Vite**. It features a state-of-the-art "Glassmorphism" design system, real-time algorithmic insights, and a fully reactive data layer.

![Nova Finance Preview](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=Nova+Finance+Dashboard+Preview)

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nova-finance.git
   cd nova-finance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🎨 Design System: "Glassmorphism Premium"

Nova Finance uses a custom-built design system defined in `src/index.css` and `tailwind.config.js`.

- **Visual Language**: Translucent "glass" surfaces, mesh radial gradients, and high-contrast typography.
- **Color Logic**: Dynamic Light/Dark mode transitions using CSS variables (`:root` tokens).
- **Typography**: `Space Grotesk` for data-heavy displays and `Inter` for functional UI components.
- **Motion**: Spring-based transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) and staggered entry animations for list items.

---

## 🧠 Approach & Architecture

### 1. State Management (Context & Hooks)
The application uses a centralized **Finance Engine** via React Context.
- `FinanceProvider`: Manages the global state for transactions, user roles, and theme synchronization.
- `useFinance`: A custom hook used by components to access and mutate financial data without prop-drilling.

### 2. Persistence Layer
All user interactions (adding transactions, changing roles, theme preference) are automatically persisted to **IndexedDB/localStorage** via the `useLocalStorage` hook, ensuring data survives page reloads.

### 3. Intelligence Engine
The `src/utils/finance.js` utility contains the "Algorithmic Observation" logic:
- **Velocity Tracking**: Analyzes spending habits by the day of the week.
- **Projection Logic**: Predicts month-end expenses based on current daily burn rates.
- **Trend Analysis**: Compares current spending sectors against historical benchmarks.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Universal Dashboard** | Holistic view of balance, income, and outflow trends using Recharts. |
| **Financial Intelligence** | Real-time automated insights and spending velocity tracking. |
| **Transaction Hub** | Advanced filtering, sorting, and full CRUD capabilities for expenses/income. |
| **Multi-Mode Navigation** | Collapsible "Icon Mode" sidebar for maximized workspace on desktop. |
| **Simulated RBAC** | Switch between "Viewer" and "Admin" roles to experience different permission levels. |
| **Dark Mode** | Full-spectrum dark theme optimized for low-light financial monitoring. |

---

## 📂 Project Structure

```text
src/
├── components/      # Atomic UI components (Common, Layout, Graphs)
├── context/         # Centralized state (FinanceContext)
├── hooks/           # Reusable logic (useLocalStorage, useViewport)
├── pages/           # High-level views (Dashboard, Insights, Transactions)
├── services/        # Simulated API & Sync layer
├── utils/           # Math & Formatting utilities
└── index.css        # Design tokens & Global styles
```

---

## 🛠 Calibration & Reset

To reset the dashboard to its original demo state:
1. Click the **"Reset to Demo Data"** button in the sidebar.
2. This clears all local modifications and re-seeds the application from `src/data/mockTransactions.js`.

---

👨‍💻 Author

Priyanshu Mishra

Final Year B.Tech – Information Technology
Madan Mohan Malaviya University of Technology (MMMUT)
