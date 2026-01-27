import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Menu,
    LogOut,
    User,
    Home,
    ChefHat,
    Shield,
    LogIn,
    UserPlus,
} from "lucide-react";

import { ROUTES } from "@/router/paths";
import { useAuth } from "@/context/AuthContext";
import { getDisplayName, isAdmin } from "@/util/index.util";

import { Button } from "@/components/ui/Button";
import { NavItem } from "@/components/navigation/NavItem";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/Sheet";
import { Separator } from "@/components/ui/Separator";

/* ============================================================================
 * Types
 * ============================================================================
 */

type Item = {
    label: string;
    to: string;
    icon: React.ReactNode;
};

/* ============================================================================
 * Component
 * ============================================================================
 */

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);

    const displayName = useMemo(() => getDisplayName(user), [user]);
    const showAdmin = useMemo(() => isAdmin(user), [user]);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate(ROUTES.home, { replace: true });
    };

    /* -------------------------
     * Navigation items
     * ------------------------- */

    const publicItems: Item[] = [
        {
            label: "Home",
            to: ROUTES.home,
            icon: <Home className="h-4 w-4" />,
        },
    ];

    const authItems: Item[] = isAuthenticated
        ? [
            {
                label: "Rezepte",
                to: ROUTES.recipes,
                icon: <ChefHat className="h-4 w-4" />,
            },
            ...(showAdmin
                ? [
                    {
                        label: "Admin",
                        to: ROUTES.admin,
                        icon: <Shield className="h-4 w-4" />,
                    },
                ]
                : []),
            {
                label: displayName || "Profil",
                to: ROUTES.profile,
                icon: <User className="h-4 w-4" />,
            },
        ]
        : [
            {
                label: "Login",
                to: ROUTES.login,
                icon: <LogIn className="h-4 w-4" />,
            },
            {
                label: "Registrieren",
                to: ROUTES.register,
                icon: <UserPlus className="h-4 w-4" />,
            },
        ];

    const items = [...publicItems, ...authItems];

    /* ============================================================================
     * Render
     * ============================================================================
     */

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                {/* Brand */}
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.home)}
                    className="
                        inline-flex items-center gap-2 rounded-lg px-3 py-2
                        text-lg font-semibold tracking-tight
                        transition-colors
                        hover:bg-muted
                        focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-ring
                    "
                >
                    <span aria-hidden>👨‍👩‍👧‍👦</span>
                    Familienplaner
                </button>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-2 sm:flex">
                    {items.map((item) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            label={item.label}
                            icon={item.icon}
                        />
                    ))}

                    {isAuthenticated && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            Abmelden
                        </Button>
                    )}
                </div>

                {/* Mobile navigation */}
                <div className="sm:hidden">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="secondary"
                                size="md"
                                aria-label="Menü öffnen"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-[320px]">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <span aria-hidden>👨‍👩‍👧‍👦</span>
                                    Familienplaner
                                </SheetTitle>
                            </SheetHeader>

                            <div className="mt-6 flex flex-col gap-2">
                                {items.map((item) => (
                                    <NavItem
                                        key={item.to}
                                        to={item.to}
                                        label={item.label}
                                        icon={item.icon}
                                        mobile
                                        onClick={() =>
                                            setMobileOpen(false)
                                        }
                                    />
                                ))}

                                {isAuthenticated && (
                                    <>
                                        <Separator className="my-3" />
                                        <Button
                                            variant="destructive"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Abmelden
                                        </Button>
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export { NavBar };
