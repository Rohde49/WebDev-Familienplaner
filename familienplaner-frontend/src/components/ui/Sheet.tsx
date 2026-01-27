/*
 * ============================================================================
 * Sheet – UI Drawer / Side Panel (seitliche Overlays)
 * ============================================================================
 */

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/util/index.util";

/* ============================================================================
 * Root primitives
 * ============================================================================
 */

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

/* ============================================================================
 * Overlay
 * ============================================================================
 */

export function SheetOverlay({
                                 className,
                                 ...props
                             }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
    return (
        <SheetPrimitive.Overlay
            className={cn(
                "fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
                className
            )}
            {...props}
        />
    );
}

/* ============================================================================
 * Content
 * ============================================================================
 */

export function SheetContent({
                                 className,
                                 children,
                                 side = "right",
                                 ...props
                             }: React.ComponentProps<typeof SheetPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
}) {
    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                className={cn(
                    "fixed z-50 flex flex-col gap-4 bg-background shadow-lg",
                    "border border-border",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=open]:duration-500 data-[state=closed]:duration-300",
                    side === "right" &&
                    "inset-y-0 right-0 h-full w-3/4 max-w-sm " +
                    "data-[state=open]:slide-in-from-right " +
                    "data-[state=closed]:slide-out-to-right",
                    side === "left" &&
                    "inset-y-0 left-0 h-full w-3/4 max-w-sm " +
                    "data-[state=open]:slide-in-from-left " +
                    "data-[state=closed]:slide-out-to-left",
                    side === "top" &&
                    "inset-x-0 top-0 h-auto " +
                    "data-[state=open]:slide-in-from-top " +
                    "data-[state=closed]:slide-out-to-top",
                    side === "bottom" &&
                    "inset-x-0 bottom-0 h-auto " +
                    "data-[state=open]:slide-in-from-bottom " +
                    "data-[state=closed]:slide-out-to-bottom",
                    className
                )}
                {...props}
            >
                {children}

                {/* Close button */}
                <SheetPrimitive.Close
                    className="
                        absolute right-4 top-4 rounded-md p-1
                        text-muted-foreground
                        transition-colors
                        hover:text-foreground
                        focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-ring
                        disabled:pointer-events-none
                    "
                >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </SheetPrimitive.Close>
            </SheetPrimitive.Content>
        </SheetPortal>
    );
}

/* ============================================================================
 * Layout helpers
 * ============================================================================
 */

export function SheetHeader({
                                className,
                                ...props
                            }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex flex-col gap-1.5 px-6 pt-6",
                className
            )}
            {...props}
        />
    );
}

export function SheetFooter({
                                className,
                                ...props
                            }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "mt-auto flex flex-col gap-2 px-6 pb-6",
                className
            )}
            {...props}
        />
    );
}

export function SheetTitle({
                               className,
                               ...props
                           }: React.ComponentProps<typeof SheetPrimitive.Title>) {
    return (
        <SheetPrimitive.Title
            className={cn(
                "text-lg font-semibold text-foreground",
                className
            )}
            {...props}
        />
    );
}

export function SheetDescription({
                                     className,
                                     ...props
                                 }: React.ComponentProps<typeof SheetPrimitive.Description>) {
    return (
        <SheetPrimitive.Description
            className={cn(
                "text-sm text-muted-foreground",
                className
            )}
            {...props}
        />
    );
}
