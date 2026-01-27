/*
 * ============================================================================
 * Separator – UI Trennelement (visuelle Trennung)
 * ============================================================================
 */

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/util/index.util";

export interface SeparatorProps
    extends React.ComponentProps<typeof SeparatorPrimitive.Root> {}

export const Separator: React.FC<SeparatorProps> = ({
                                                        className,
                                                        orientation = "horizontal",
                                                        decorative = true,
                                                        ...props
                                                    }) => {
    return (
        <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className={cn(
                "shrink-0 bg-border",
                orientation === "horizontal"
                    ? "h-px w-full"
                    : "h-full w-px",
                className
            )}
            {...props}
        />
    );
};
