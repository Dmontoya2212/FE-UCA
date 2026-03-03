import "./DashboardIndicator.css";
import type { ReactNode } from "react";

export type DashboardIndicatorMode = "default" | "info" | "success" | "warning" | "danger";

export type DashboardIndicatorProps = {
    title: string;
    value: string;          // monto o cantidad (ej: "€0.00" o "0")
    subtitle?: string;      // label pequeño abajo (ej: "0 facturas totales")
    icon?: ReactNode;       // el icono (svg o componente)
    mode?: DashboardIndicatorMode; // <-- lo que te pidió tu jefe
};

export default function DashboardIndicator({
                                               title,
                                               value,
                                               subtitle,
                                               icon,
                                               mode = "default",
                                           }: DashboardIndicatorProps) {
    return (
        <article className={`di di--${mode}`}>
            <div className="di__left">
                <p className="di__title">{title}</p>
                <p className="di__value">{value}</p>
                {subtitle ? <p className="di__subtitle">{subtitle}</p> : null}
            </div>

            {icon ? (
                <div className="di__iconWrap" aria-hidden="true">
                    {icon}
                </div>
            ) : null}
        </article>
    );
}