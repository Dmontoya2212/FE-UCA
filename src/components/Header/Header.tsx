// src/components/Header/Header.tsx
import "./header.css";

type HeaderProps = {
    title: string;
    subtitle: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
    return (
        <header className="app-header">
            <div className="app-header__content">
                <h1 className="app-header__title">{title}</h1>
                <p className="app-header__subtitle">{subtitle}</p>
            </div>
        </header>
    );
}