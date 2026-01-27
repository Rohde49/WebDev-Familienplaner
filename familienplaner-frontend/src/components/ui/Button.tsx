/*
 * ============================================================================
 * zentrale UI Button-Komponente
 * ============================================================================
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/util/index.util";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost";

export type ButtonSize =
    | "sm"
    | "md"
    | "lg";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
}

/* ============================================================================
 * Styles
 * ============================================================================
 */

const base =
    "ui-focus inline-flex items-center justify-center gap-2 " +
    "rounded-xl font-medium transition-colors " +
    "disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-primary-foreground shadow-sm " +
        "hover:brightness-95 active:brightness-90",

    secondary:
        "border bg-secondary text-secondary-foreground shadow-sm " +
        "hover:bg-accent active:brightness-95",

    destructive:
        "bg-destructive text-destructive-foreground shadow-sm " +
        "hover:brightness-95 active:brightness-90",

    ghost:
        "bg-transparent text-foreground " +
        "hover:bg-accent",
};

const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-base",
};

/* ============================================================================
 * Component
 * ============================================================================
 */

export const Button = React.forwardRef<
    HTMLButtonElement,
    ButtonProps
>(function Button(
    {
        className,
        variant = "primary",
        size = "md",
        asChild = false,
        type = "button",
        ...props
    },
    ref
) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            ref={ref}
            type={asChild ? undefined : type}
            className={cn(
                base,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});
