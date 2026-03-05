import "./NavBar.css";

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

function Icon({ name }: { name: NavItemKey }) {

    switch (name) {
        case "dashboard":
            return (
                <svg viewBox="0 0 24 24" className="fe-nav__icon" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M4 13h7V4H4v9zm9 7h7V11h-7v9zM4 20h7v-5H4v5zm9-16v5h7V4h-7z"
                    />
                </svg>
            );
        case "clientes":
            return (
                <svg viewBox="0 0 24 24" className="fe-nav__icon" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.93 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                    />
                </svg>
            );
        case "servicios":
            return (
                <svg viewBox="0 0 24 24" className="fe-nav__icon" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"
                    />
                </svg>
            );
        case "facturas":
            return (
                <svg viewBox="0 0 24 24" className="fe-nav__icon" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M6 2h9l3 3v17l-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1V3c0-.55.45-1 1-1zm2 7h8v2H8V9zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"
                    />
                </svg>
            );
        default:
            return null;
    }
}

export default function NavBar({ active = "dashboard", onChange }: NavBarProps) {
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
                            <Icon name={item.key} />
                            <span className="fe-nav__label">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}