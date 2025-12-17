import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { ROUTES } from "../router/paths";
import { useAuth } from "../context/AuthContext";
import { getDisplayName, isAdmin } from "../util/index.util";

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const displayName = useMemo(() => getDisplayName(user), [user]);
    const showAdmin = useMemo(() => isAdmin(user), [user]);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? "nav-link nav-link-active" : "nav-link";

    const handleLogout = () => {
        logout();
        navigate(ROUTES.home, { replace: true });
    };

    /* 🔹 Links für nicht eingeloggte User */
    const publicLinks = (
        <>
            <li>
                <NavLink to={ROUTES.login} className={linkClass}>
                    Login
                </NavLink>
            </li>
            <li>
                <NavLink to={ROUTES.register} className={linkClass}>
                    Registrieren
                </NavLink>
            </li>
        </>
    );

    /* 🔹 Links für eingeloggte User */
    const privateLinks = (
        <>
            <li>
                <NavLink to={ROUTES.recipes} className={linkClass}>
                    Rezepte
                </NavLink>
            </li>

            {showAdmin && (
                <li>
                    <NavLink to={ROUTES.admin} className={linkClass}>
                        ⚙️ Admin
                    </NavLink>
                </li>
            )}

            <li>
                <NavLink to={ROUTES.profile} className={linkClass}>
                    {displayName}
                </NavLink>
            </li>

            <li>
                <button type="button" className="nav-link" onClick={handleLogout}>
                    Logout
                </button>
            </li>
        </>
    );

    return (
        <nav className="bg-white shadow-sm w-full border-b border-slate-200">
            <div className="container-wide flex justify-between items-center py-4">
                {/* Logo */}
                <button
                    onClick={() => navigate(ROUTES.home)}
                    className="text-xl font-bold whitespace-nowrap"
                    aria-label="Zur Startseite"
                >
                    👨‍👩‍👧‍👦 Familienplaner
                </button>

                {/* Navigation */}
                <ul className="flex flex-wrap gap-3 items-center text-sm">
                    {/* Home immer sichtbar */}
                    <li>
                        <NavLink to={ROUTES.home} className={linkClass}>
                            Home
                        </NavLink>
                    </li>

                    {isAuthenticated ? privateLinks : publicLinks}
                </ul>
            </div>
        </nav>
    );
};

export { NavBar };
