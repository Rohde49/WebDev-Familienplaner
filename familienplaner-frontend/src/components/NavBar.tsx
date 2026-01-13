import React, { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, User, Home, ChefHat, Shield } from "lucide-react";

import { ROUTES } from "../router/paths";
import { useAuth } from "../context/AuthContext";
import { getDisplayName, isAdmin } from "../util/index.util";

import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { cn } from "../lib/utils";

type NavItem = {
    label: string;
    to: string;
    icon?: React.ReactNode;
    show?: boolean;
    /** If true, use "startsWith" matching for nested routes (e.g. /recipes/123) */
    matchPrefix?: boolean;
};

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);

    const displayName = useMemo(() => getDisplayName(user), [user]);
    const showAdmin = useMemo(() => isAdmin(user), [user]);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate(ROUTES.home, { replace: true });
    };

    const items: NavItem[] = [
        { label: "Home", to: ROUTES.home, icon: <Home className="h-4 w-4" />, show: true },
        {
            label: "Rezepte",
            to: ROUTES.recipes,
            icon: <ChefHat className="h-4 w-4" />,
            show: isAuthenticated,
            matchPrefix: true,
        },
        {
            label: "Admin",
            to: ROUTES.admin,
            icon: <Shield className="h-4 w-4" />,
            show: isAuthenticated && showAdmin,
            matchPrefix: true,
        },
        {
            label: displayName || "Profil",
            to: ROUTES.profile,
            icon: <User className="h-4 w-4" />,
            show: isAuthenticated,
            matchPrefix: true,
        },
        { label: "Login", to: ROUTES.login, show: !isAuthenticated },
        { label: "Registrieren", to: ROUTES.register, show: !isAuthenticated },
    ].filter((i) => i.show !== false);

    const isPathActive = (item: NavItem) => {
        if (item.to === ROUTES.home) return location.pathname === ROUTES.home;
        if (item.matchPrefix) return location.pathname === item.to || location.pathname.startsWith(item.to + "/");
        return location.pathname === item.to;
    };

    const linkBase =
        "ui-focus inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors";
    const linkInactive = "text-muted-foreground hover:text-foreground hover:bg-accent";
    const linkActive = "bg-accent text-foreground";

    const Brand = (
        <button
            onClick={() => {
                setMobileOpen(false);
                navigate(ROUTES.home);
            }}
            className="ui-focus inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-2 py-1 text-base font-semibold tracking-tight hover:bg-accent"
            aria-label="Zur Startseite"
            type="button"
        >
            <span aria-hidden>👨‍👩‍👧‍👦</span>
            <span>Familienplaner</span>
        </button>
    );

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="ui-container flex items-center justify-between gap-3 py-3">
                {/* Brand */}
                {Brand}

                {/* Desktop links */}
                <div className="hidden items-center gap-2 sm:flex">
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={cn(linkBase, isPathActive(item) ? linkActive : linkInactive)}
                            aria-current={isPathActive(item) ? "page" : undefined}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}

                    {/* Logout only on desktop, only when authenticated */}
                    {isAuthenticated && (
                        <Button
                            variant="secondary"
                            className="ml-1 ui-focus"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Abmelden
                        </Button>
                    )}
                </div>

                {/* Mobile hamburger */}
                <div className="sm:hidden">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                aria-label="Menü öffnen"
                                className="ui-focus"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-[320px] sm:w-[360px]">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <span aria-hidden>👨‍👩‍👧‍👦</span>
                                    Familienplaner
                                </SheetTitle>
                            </SheetHeader>

                            <div className="mt-4 flex flex-col gap-2">
                                {items.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "ui-focus flex items-center gap-2 rounded-xl px-3 py-3 text-sm transition-colors",
                                            isPathActive(item)
                                                ? "bg-accent text-foreground"
                                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                        )}
                                        aria-current={isPathActive(item) ? "page" : undefined}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </NavLink>
                                ))}

                                {isAuthenticated && (
                                    <>
                                        <Separator className="my-2" />
                                        <Button onClick={handleLogout} className="w-full ui-focus">
                                            <LogOut className="mr-2 h-4 w-4" />
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
