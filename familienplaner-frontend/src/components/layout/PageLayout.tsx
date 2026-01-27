/*
 * ============================================================================
 * PageLayout – zentrale Seiten-Layout-Shell
 * ============================================================================
 * - zentriert den Seiteninhalt
 * - stellt eine große Card als Content-Fläche bereit
 * - keine Seitenlogik, kein Header
 * ============================================================================
 */

import * as React from "react";
import { cn } from "@/util/index.util";
import { Card } from "@/components/ui/Card";

export interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
    cardClassName?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
                                                          children,
                                                          className,
                                                          cardClassName,
                                                      }) => {
    return (
        <div
            className={cn(
                // zentrierter Seitenbereich
                "mx-auto w-full max-w-6xl px-4 sm:px-6",
                // Abstand zur Navbar
                "pt-6 sm:pt-8",
                className
            )}
        >
            <Card
                className={cn(
                    // große, ruhige Content-Card
                    "p-6 sm:p-8",
                    cardClassName
                )}
            >
                {children}
            </Card>
        </div>
    );
};
