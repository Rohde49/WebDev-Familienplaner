/*
 * ============================================================================
 * Label – zentrales UI Label (semantische Beschriftungen)
 * ============================================================================
 */

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/util/index.util";

export interface LabelProps
    extends React.ComponentProps<typeof LabelPrimitive.Root> {}

export const Label: React.FC<LabelProps> = ({
                                                className,
                                                ...props
                                            }) => {
    return (
        <LabelPrimitive.Root
            className={cn(
                "text-sm font-medium text-foreground leading-none",
                className
            )}
            {...props}
        />
    );
};
