import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../router/paths";
import { useAuth } from "../context/AuthContext";
import { getDisplayName, isAdmin } from "../util/index.util";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const displayName = useMemo(() => getDisplayName(user), [user]);
    const admin = useMemo(() => isAdmin(user), [user]);

    return (
        <div className="page fade-in-up">
            {/* Hero */}
            <section className="section-hero">
                <div className="container-wide">
                    <div className="card">
                        <div className="row-between">
                            <div className="stack">
                                <h1 className="h1">
                                    {isAuthenticated ? `Hallo, ${displayName}!` : "Willkommen im Familienplaner"}
                                </h1>
                                <p className="lead">
                                    Organisiere deinen Alltag – einfach, übersichtlich und für die ganze Familie geeignet.
                                </p>

                                {/* CTA Buttons */}
                                {!isAuthenticated ? (
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-md"
                                            onClick={() => navigate(ROUTES.login)}
                                        >
                                            Anmelden
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-md"
                                            onClick={() => navigate(ROUTES.register)}
                                        >
                                            Registrieren
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-md"
                                            onClick={() => navigate(ROUTES.profile)}
                                        >
                                            Zum Profil
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-md"
                                            onClick={() => navigate(ROUTES.recipes)}
                                        >
                                            Rezepte
                                        </button>

                                        {admin && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-md"
                                                onClick={() => navigate(ROUTES.admin)}
                                            >
                                                Admin
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Kleine “Deko”-Spalte (nur Desktop) */}
                            <div className="hidden md:block">
                                <div className="card-soft">
                                    <p className="small-text">Tipps</p>
                                    <p className="text-body">
                                        Starte mit Profil & Rezepten – später können wir Aufgaben & weitere Module ergänzen.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
