/*
 * ============================================================================
 * Alert – zentrales UI Hinweis-Element (statische Hinweise)
 * ============================================================================
 */

import * as React from "react";
import {
    AlertTriangle,
    Info,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/util/index.util";

export type AlertVariant = "error" | "success" | "info";

export interface AlertProps
    extends React.HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
}

/* ============================================================================
 * Styles
 * ============================================================================
 */

const base =
    "rounded-lg border p-4 text-sm text-foreground";

const variants: Record<AlertVariant, string> = {
    error:
        "border-destructive/30 bg-destructive/10",

    success:
        "border-primary/30 bg-primary/10",

    info:
        "border-border bg-muted",
};

const iconStyles =
    "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground";

/* ============================================================================
 * Icons
 * ============================================================================
 */

const icons: Record<AlertVariant, React.ElementType> = {
    error: AlertTriangle,
    success: CheckCircle2,
    info: Info,
};

/* ============================================================================
 * Component
 * ============================================================================
 */

export const Alert: React.FC<AlertProps> = ({
                                                variant = "info",
                                                className,
                                                children,
                                                ...props
                                            }) => {
    const Icon = icons[variant];

    return (
        <div
            className={cn(
                base,
                variants[variant],
                className
            )}
            {...props}
        >
            <div className="flex items-start gap-3">
                <Icon className={iconStyles} />
                <div className="min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
};
