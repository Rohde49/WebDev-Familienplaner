/*
 * ============================================================================
 * Badge – zentrale UI Badge-Komponente (Kategorien)
 * ============================================================================
 */

import * as React from "react";
import { cn } from "@/util/index.util";

export type BadgeVariant =
    | "default"
    | "secondary"
    | "outline"
    | "destructive";

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

/* ============================================================================
 * Styles
 * ============================================================================
 */

const base =
    "inline-flex items-center rounded-md px-2.5 py-0.5 " +
    "text-xs font-medium select-none whitespace-nowrap";

const variants: Record<BadgeVariant, string> = {
    default:
        "bg-primary text-primary-foreground",

    secondary:
        "bg-secondary text-secondary-foreground",

    outline:
        "border border-border bg-background text-foreground",

    destructive:
        "bg-destructive text-destructive-foreground",
};

/* ============================================================================
 * Component
 * ============================================================================
 */

export const Badge: React.FC<BadgeProps> = ({
                                                className,
                                                variant = "default",
                                                ...props
                                            }) => {
    return (
        <span
            className={cn(
                base,
                variants[variant],
                className
            )}
            {...props}
        />
    );
};
