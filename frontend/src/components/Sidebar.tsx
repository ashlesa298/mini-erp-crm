import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      label: "Dashboard",
      icon: "📊",
      path: "/",
    },
    {
      label: "Customers",
      icon: "👥",
      path: "/customers",
    },
    {
      label: "Products & Inventory",
      icon: "📦",
      path: "/products",
    },
    {
      label: "Sales Challans",
      icon: "🧾",
      path: "/sales-challans",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">M</div>

        <div>
          <h2>Mini ERP</h2>
          <span>CRM Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;