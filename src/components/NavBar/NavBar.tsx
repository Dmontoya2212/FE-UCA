import "./NavBar.css";
import { FaTableCellsLarge, FaUsers, FaFileInvoice, FaBox } from "react-icons/fa6";

type NavItemKey = "dashboard" | "clientes" | "servicios" | "facturas";

type NavItem = {
    key: NavItemKey;
    label: string;
};

interface NavBarProps {
    active?: NavItemKey;
    onChange?: (key: NavItemKey) => void;
}

const ITEMS: NavItem[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "clientes", label: "Clientes" },
    { key: "servicios", label: "Servicios" },
    { key: "facturas", label: "Facturas" },
];

function NavIcon({ name }: { name: NavItemKey }) {
    switch (name) {
        case "dashboard":
            return <FaTableCellsLarge className="fe-nav__icon" />;
        case "clientes":
            return <FaUsers className="fe-nav__icon" />;
        case "servicios":
            return <FaBox className="fe-nav__icon" />;
        case "facturas":
            return <FaFileInvoice className="fe-nav__icon" />;
        default:
            return null;
    }
}

export default function NavBar({
                                   active = "dashboard",
                                   onChange,
                               }: NavBarProps) {
    return (
        <nav className="fe-nav" aria-label="Navegación principal">
            <div className="fe-nav__pill">
                {ITEMS.map((item) => {
                    const isActive = item.key === active;

                    return (
                        <button
                            key={item.key}
                            type="button"
                            className={`fe-nav__item ${isActive ? "is-active" : ""}`}
                            onClick={() => onChange?.(item.key)}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <NavIcon name={item.key} />
                            <span className="fe-nav__label">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}