import "./DashboardIndicator.css";
import type { ReactNode } from "react";

export type DashboardIndicatorMode =
    | "default"
    | "info"
    | "success"
    | "warning"
    | "danger";

export interface DashboardIndicatorProps {
    title: string;
    value: string;
    subtitle?: string;
    icon?: ReactNode;
    mode?: DashboardIndicatorMode;
}

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
                {subtitle && <p className="di__subtitle">{subtitle}</p>}
            </div>

            {icon && (
                <div className="di__iconWrap" aria-hidden="true">
                    {icon}
                </div>
            )}
        </article>
    );
}