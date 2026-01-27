/*
 * ============================================================================
 * Dialog – zentrales UI Modal (modale Fenster)
 * ============================================================================
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/util/index.util";

/* ============================================================================
 * Root primitives
 * ============================================================================
 */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

/* ============================================================================
 * Overlay
 * ============================================================================
 */

export function DialogOverlay({
                                  className,
                                  ...props
                              }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
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

export function DialogContent({
                                  className,
                                  children,
                                  showCloseButton = true,
                                  ...props
                              }: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                className={cn(
                    "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
                    "rounded-lg border border-border bg-background p-6 shadow-lg",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
                    "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
                    className
                )}
                {...props}
            >
                {children}

                {showCloseButton && (
                    <DialogPrimitive.Close
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
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}

/* ============================================================================
 * Layout helpers
 * ============================================================================
 */

export function DialogHeader({
                                 className,
                                 ...props
                             }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex flex-col gap-2 text-center sm:text-left",
                className
            )}
            {...props}
        />
    );
}

export function DialogFooter({
                                 className,
                                 ...props
                             }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className
            )}
            {...props}
        />
    );
}

export function DialogTitle({
                                className,
                                ...props
                            }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            className={cn(
                "text-lg font-semibold text-foreground",
                className
            )}
            {...props}
        />
    );
}

export function DialogDescription({
                                      className,
                                      ...props
                                  }: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            className={cn(
                "text-sm text-muted-foreground",
                className
            )}
            {...props}
        />
    );
}
