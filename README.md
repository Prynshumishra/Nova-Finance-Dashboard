# ⚡ Nova Finance | Universal Financial Intelligence

Nova Finance is a premium, high-performance financial dashboard built with **React 19**, **Tailwind CSS**, and **Vite**. It features a state-of-the-art "Glassmorphism" design system, real-time algorithmic insights, and a fully reactive data layer.

## 🔗 [Live Demo Link](https://nova-finance-dashboard-five-pearl.vercel.app/)

---

## 🛠️ Tech Stack

### Frontend Core
- **React 19**: Utilizing the latest features for efficient rendering and state management.
- **Vite**: Ultra-fast build tool and development server for an optimized DX.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development and consistent styling.

### Data & Visualization
- **Recharts**: A composable charting library built on React components for beautiful, responsive data visualization.
- **Lucide React**: A suite of clean, consistent icons for a modern UI.

### State & Logic
- **React Context API**: Centralized state management for transactions, roles, and themes.
- **Custom Hooks**: specialized logic for persistence (`useLocalStorage`) and window management.
- **Vite Plugins**: For optimized asset handling and fast refresh.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Universal Dashboard** | Holistic view of balance, income, and outflow trends using interactive Recharts. |
| **Financial Intelligence** | Real-time automated insights, spending velocity tracking, and trend analysis. |
| **Transaction Hub** | Advanced filtering, sorting, and full CRUD capabilities for financial records. |
| **Multi-Mode Navigation** | Collapsible "Icon Mode" sidebar that persists user preference for an optimized workspace. |
| **RBAC Simulation** | Switch between "Viewer" and "Admin" roles to experience role-based permission levels. |
| **Dynamic Themes** | Full-spectrum Light/Dark mode optimized for low-light financial monitoring. |

---

## 🎨 Design System: "Glassmorphism Premium"

Nova Finance uses a custom-built design system defined in `src/index.css` and `tailwind.config.js`.

- **Visual Language**: Translucent "glass" surfaces, mesh radial gradients, and high-contrast typography.
- **Color Logic**: Dynamic Light/Dark mode transitions using CSS variables (`:root` tokens).
- **Typography**: `Space Grotesk` for data-heavy displays and `Inter` for functional UI components.
- **Motion**: Spring-based transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) and staggered entry animations for list items.

---

## 📂 Project Structure

```text
src/
├── components/      # Atomic UI components 
│   ├── common/      # Reusable UI elements (Buttons, Inputs, Skeletons)
│   ├── dashboard/   # Dashboard-specific charts and cards
│   ├── layout/      # Sidebar, Header, and Page wrappers
│   └── transactions/# Transaction forms and lists
├── context/         # Centralized state (FinanceContext)
├── data/            # Mock data and category definitions
├── hooks/           # Reusable logic (useLocalStorage, useViewport)
├── pages/           # High-level views (Dashboard, Insights, Transactions)
├── services/        # Simulated API & Sync layer
├── utils/           # Math & Formatting utilities
└── index.css        # Design tokens & Global styles
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
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

## 📊 Future Roadmap
- [ ] **Full Backend Integration**: Migration from local simulation to a Node.js/Express or Firebase backend.
- [ ] **Financial Exports**: Add capability to export transaction history to PDF/CSV.
- [ ] **Advanced Search**: Implementation of range-based date filtering and multi-category selection.
- [ ] **PWA Support**: Offline capabilities and installation support for mobile devices.

---

👨‍💻 **Author**

**Priyanshu Mishra**  
Final Year B.Tech – Information Technology  
Madan Mohan Malaviya University of Technology (MMMUT)
