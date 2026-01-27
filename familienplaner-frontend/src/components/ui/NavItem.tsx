/*
 * ============================================================================
 * NavItem – zentrales Navigationselement
 * ============================================================================
 */

import * as React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/util/index.util";

export interface NavItemProps {
    to: string;
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
    mobile?: boolean;
}

/* ============================================================================
 * Styles
 * ============================================================================
 */

const base =
    "ui-focus inline-flex items-center gap-2 " +
    "rounded-xl font-medium transition-colors";

const desktop =
    "px-4 py-2 text-sm";

const mobile =
    "px-4 py-3 text-sm";

const inactive =
    "text-muted-foreground hover:text-foreground hover:bg-accent";

const active =
    "bg-primary text-primary-foreground shadow-sm";

/* ============================================================================
 * Component
 * ============================================================================
 */

export const NavItem: React.FC<NavItemProps> = ({
    to,
    label,
    icon,
    active: isActive,
    onClick,
    mobile: isMobile = false,
}) => {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={cn(
                base,
                isMobile ? mobile : desktop,
                isActive ? active : inactive
            )}
            aria-current={isActive ? "page" : undefined}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            <span className="whitespace-nowrap">{label}</span>
        </NavLink>
    );
};
