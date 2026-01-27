/*
 * ============================================================================
 * Skeleton – UI Platzhalter für Ladezustände (Platzhalter beim Laden)
 * ============================================================================
 */

import * as React from "react";
import { cn } from "@/util/index.util";

export interface SkeletonProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({
                                                      className,
                                                      ...props
                                                  }) => {
    return (
        <div
            aria-hidden
            className={cn(
                "animate-pulse rounded-lg bg-muted",
                className
            )}
            {...props}
        />
    );
};
