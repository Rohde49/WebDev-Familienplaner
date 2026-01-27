/*
 * ============================================================================
 * Skeleton – UI Platzhalter für Ladezustände
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
                "animate-pulse rounded-md bg-muted",
                className
            )}
            {...props}
        />
    );
};
