/*
 * ============================================================================
 * Zentrale UI Input-Komponente (einzeilige Texteingaben)
 * ============================================================================
 */

import * as React from "react";
import { cn } from "@/util/index.util";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;

    /** ✅ optional: zeigt "gültig"-State (grüne Border) */
    valid?: boolean;
}

/* ============================================================================
 * Styles
 * ============================================================================
 */

const inputBase =
    "w-full rounded-lg border bg-background px-3 py-2 text-sm " +
    "text-foreground shadow-sm transition-colors " +
    "placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 " +
    "disabled:cursor-not-allowed disabled:opacity-60";

const inputNeutral =
    "border-border focus-visible:ring-ring";

const inputError =
    "border-destructive focus-visible:ring-destructive";

const inputValid =
    "border-success focus-visible:ring-success";

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

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    function Input(
        {
            className,
            label,
            hint,
            error,
            valid,
            id,
            disabled,
            ...props
        },
        ref
    ) {
        const inputId = id ?? React.useId();

        const hasError = Boolean(error);
        const isValid = Boolean(valid) && !hasError;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className={labelBase}>
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    aria-invalid={hasError}
                    className={cn(
                        inputBase,
                        hasError ? inputError : isValid ? inputValid : inputNeutral,
                        className
                    )}
                    {...props}
                />

                {hasError ? (
                    <p className={errorBase}>{error}</p>
                ) : hint ? (
                    <p className={hintBase}>{hint}</p>
                ) : null}
            </div>
        );
    }
);
