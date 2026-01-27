/*
 * ============================================================================
 * NavItem – zentrales Navigationselement (sanfte Pills)
 * ============================================================================
 */

import * as React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/util/index.util";

export interface NavItemProps {
    to: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    mobile?: boolean;
}

/* ============================================================================
 * Styles
 * ============================================================================
 */

const base =
    "inline-flex items-center gap-2 rounded-xl font-medium transition-all " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const desktop =
    "px-4 py-2 text-sm";

const mobile =
    "px-4 py-3 text-sm";

const inactive =
    "bg-muted/60 text-muted-foreground " +
    "hover:bg-muted/90 hover:text-foreground";

const active =
    "bg-primary/15 text-primary " +
    "shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]";

/* ============================================================================
 * Component
 * ============================================================================
 */

export const NavItem: React.FC<NavItemProps> = ({
                                                    to,
                                                    label,
                                                    icon,
                                                    onClick,
                                                    mobile: isMobile = false,
                                                }) => {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                cn(
                    base,
                    isMobile ? mobile : desktop,
                    isActive ? active : inactive
                )
            }
        >
            {icon && (
                <span className="shrink-0 opacity-80">
                    {icon}
                </span>
            )}
            <span className="whitespace-nowrap">
                {label}
            </span>
        </NavLink>
    );
};
