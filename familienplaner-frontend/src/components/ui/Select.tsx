/*
 * ============================================================================
 * Select – zentrale UI Select-Komponente
 * ============================================================================
 */

import * as React from "react";
import { cn } from "@/util/index.util";

export type SelectOption = {
    value: string;
    label: string;
};

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    hint?: string;
    error?: string;
    options: SelectOption[];
}

/* ============================================================================
 * Styles
 * ============================================================================
 */

const selectBase =
    "ui-focus w-full appearance-none rounded-xl border bg-input px-3 py-2 pr-9 " +
    "text-sm text-foreground shadow-sm transition-colors " +
    "disabled:cursor-not-allowed disabled:opacity-60";

const selectError =
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

export const Select = React.forwardRef<
    HTMLSelectElement,
    SelectProps
>(function Select(
    {
        className,
        label,
        hint,
        error,
        options,
        id,
        disabled,
        ...props
    },
    ref
) {
    const selectId = id ?? React.useId();

    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={selectId}
                    className={labelBase}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    disabled={disabled}
                    className={cn(
                        selectBase,
                        error && selectError,
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Dropdown Arrow */}
                <span
                    aria-hidden
                    className="
                        pointer-events-none absolute right-3 top-1/2
                        -translate-y-1/2 text-muted-foreground
                    "
                >
                    ▾
                </span>
            </div>

            {error ? (
                <p className={errorBase}>{error}</p>
            ) : hint ? (
                <p className={hintBase}>{hint}</p>
            ) : null}
        </div>
    );
});
