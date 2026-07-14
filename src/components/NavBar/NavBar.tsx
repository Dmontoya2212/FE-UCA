import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import './NavBar.css';
import {
  FaTableCellsLarge,
  FaBuilding,
  FaUsers,
  FaFileInvoice,
  FaBox,
  FaUserShield,
} from 'react-icons/fa6';

type NavItemKey = 'dashboard' | 'empresa' | 'usuarios' | 'clientes' | 'servicios' | 'facturas';

type NavItem = {
  key: NavItemKey;
  label: string;
  requiredRoles?: string[];
};

interface NavBarProps {
  active?: NavItemKey;
  onChange?: (key: NavItemKey) => void;
}

const ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'empresa', label: 'Empresa', requiredRoles: ['SUPERADMIN'] },
  { key: 'usuarios', label: 'Usuarios', requiredRoles: ['SUPERADMIN'] },
  { key: 'clientes', label: 'Clientes' },
  { key: 'servicios', label: 'Servicios' },
  { key: 'facturas', label: 'Facturas' },
];

function NavIcon({ name }: { name: NavItemKey }) {
  switch (name) {
    case 'dashboard':
      return <FaTableCellsLarge className="fe-nav__icon" />;
    case 'empresa':
      return <FaBuilding className="fe-nav__icon" />;
    case 'usuarios':
      return <FaUserShield className="fe-nav__icon" />;
    case 'clientes':
      return <FaUsers className="fe-nav__icon" />;
    case 'servicios':
      return <FaBox className="fe-nav__icon" />;
    case 'facturas':
      return <FaFileInvoice className="fe-nav__icon" />;
    default:
      return null;
  }
}

export default function NavBar({
  active = 'dashboard',
  onChange,
}: NavBarProps) {
  const { user } = useAuth();
  const userRol = user?.rol || 'USUARIO';

  return (
    <nav className="fe-nav" aria-label="Navegación principal">
      <div className="fe-nav__pill">
        {ITEMS
          .filter((item) => {
            // If item has required roles, check user has one
            if (item.requiredRoles && item.requiredRoles.length > 0) {
              return item.requiredRoles.includes(userRol);
            }
            return true;
          })
          .map((item) => {
            const isActive = item.key === active;

            return (
              <Link
                key={item.key}
                to={`${item.key === 'dashboard' ? '/' : `/${item.key}`}`}
                type="button"
                className={`fe-nav__item ${isActive ? 'is-active' : ''}`}
                onClick={() => onChange?.(item.key)}
                aria-current={isActive ? 'page' : undefined}
              >
                <NavIcon name={item.key} />
                <span className="fe-nav__label">{item.label}</span>
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
