import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

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
                                    Organisiere euren Alltag – einfach, übersichtlich und für die ganze Familie gemacht.
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

            {/* Content */}
            <section className="section">
                <div className="container">
                    <div className="page-stack">
                        <header className="page-header">
                            <h2 className="h2">Was kannst du hier machen?</h2>
                            <p className="text-body text-muted">
                                Kurz & klar – damit jeder in der Familie sofort zurechtkommt.
                            </p>
                        </header>

                        <div className="feature-grid">
                            <div className="card-soft">
                                <h3 className="h3">👤 Profil</h3>
                                <p className="text-body">
                                    Verwalte deine Angaben und behalte den Überblick über dein Konto.
                                </p>
                                <div className="mt-3">
                                    <Link className="link-muted" to={ROUTES.profile}>
                                        Profil öffnen
                                    </Link>
                                </div>
                            </div>

                            <div className="card-soft">
                                <h3 className="h3">🍲 Rezepte</h3>
                                <p className="text-body">
                                    Speichere Lieblingsrezepte und plane Essen einfacher – super für den Familienalltag.
                                </p>
                                <div className="mt-3">
                                    <Link className="link-muted" to={ROUTES.recipes}>
                                        Rezepte ansehen
                                    </Link>
                                </div>
                            </div>

                            <div className="card-soft">
                                <h3 className="h3">✅ Nächste Schritte</h3>
                                <p className="text-body">
                                    Als Nächstes können wir Aufgaben/ToDos, Listen oder einen Kalender ergänzen.
                                </p>
                                <div className="mt-3">
                                    <span className="badge badge-neutral">In Planung</span>
                                </div>
                            </div>
                        </div>

                        {!isAuthenticated && (
                            <div className="card-soft">
                                <h3 className="h3">🔒 Für deine Familie</h3>
                                <p className="text-body">
                                    Melde dich an, um deinen persönlichen Bereich zu nutzen. Das Backend schützt alles per JWT.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Link className="btn btn-primary btn-md" to={ROUTES.login}>
                                        Login
                                    </Link>
                                    <Link className="btn btn-ghost btn-md" to={ROUTES.register}>
                                        Registrieren
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
