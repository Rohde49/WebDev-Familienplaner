/*
 * ============================================================================
 * zentrale UI Input-Komponente
 * ============================================================================
 */

import * as React from "react";
import { cn } from "@/util/index.util";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
}

/* ============================================================================
 * Styles
 * ============================================================================
 */

const inputBase =
    "ui-focus w-full rounded-xl border bg-input px-3 py-2 text-sm " +
    "text-foreground shadow-sm transition-colors " +
    "placeholder:text-muted-foreground " +
    "disabled:cursor-not-allowed disabled:opacity-60";

const inputError =
    "border-destructive focus-visible:ring-destructive";

const labelBase =
    "text-sm font-medium text-foreground";

const hintBase =
    "text-xs text-muted-foreground";

const errorBase =
    "text-xs text-destructive";

/* ============================================================================
 * Component
 * ============================================================================
 */

export const Input = React.forwardRef<
    HTMLInputElement,
    InputProps
>(function Input(
    {
        className,
        label,
        hint,
        error,
        id,
        disabled,
        ...props
    },
    ref
) {
    const inputId = id ?? React.useId();

    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className={labelBase}
                >
                    {label}
                </label>
            )}

            <input
                ref={ref}
                id={inputId}
                disabled={disabled}
                className={cn(
                    inputBase,
                    error && inputError,
                    className
                )}
                {...props}
            />

            {error ? (
                <p className={errorBase}>{error}</p>
            ) : hint ? (
                <p className={hintBase}>{hint}</p>
            ) : null}
        </div>
    );
});
