/*
 * ============================================================================
 * Textarea – zentrale UI Textarea-Komponente
 * ============================================================================
 */

import * as React from "react";
import { cn } from "@/util/index.util";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    hint?: string;
    error?: string;
}

/* ============================================================================
 * Styles
 * ============================================================================
 */

const textareaBase =
    "ui-focus w-full rounded-xl border bg-input px-3 py-2 text-sm " +
    "text-foreground shadow-sm transition-colors " +
    "placeholder:text-muted-foreground resize-y " +
    "disabled:cursor-not-allowed disabled:opacity-60";

const textareaError =
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

export const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    TextareaProps
>(function Textarea(
    {
        className,
        label,
        hint,
        error,
        id,
        disabled,
        rows = 4,
        ...props
    },
    ref
) {
    const textareaId = id ?? React.useId();

    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={textareaId}
                    className={labelBase}
                >
                    {label}
                </label>
            )}

            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                disabled={disabled}
                className={cn(
                    textareaBase,
                    error && textareaError,
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
