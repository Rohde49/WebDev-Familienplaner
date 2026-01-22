import React from "react";
import {
    AlertTriangle,
    Info,
    CheckCircle2,
} from "lucide-react";

type AlertVariant = "error" | "success" | "info";

type AlertProps = {
    variant: AlertVariant;
    children: React.ReactNode;
};

export const Alert: React.FC<AlertProps> = ({ variant, children }) => {
    const cls =
        variant === "error"
            ? "border-destructive/30 bg-destructive/10"
            : variant === "success"
                ? "border-primary/30 bg-primary/10"
                : "border-border bg-muted";

    const Icon =
        variant === "error"
            ? AlertTriangle
            : variant === "success"
                ? CheckCircle2
                : Info;

    return (
        <div className={`rounded-2xl border p-4 text-sm text-foreground ${cls}`}>
            <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">{children}</div>
            </div>
        </div>
    );
};
