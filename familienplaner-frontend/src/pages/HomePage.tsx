import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../router/paths";
import { useAuth } from "../context/AuthContext";
import { getDisplayName, isAdmin } from "../util/index.util";
import { PageShell } from "../components/layout/PageShell";

type QuickAction = {
    title: string;
    description: string;
    cta: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost";
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const displayName = useMemo(() => getDisplayName(user), [user]);
    const admin = useMemo(() => isAdmin(user), [user]);

    const actions: QuickAction[] = useMemo(() => {
        if (!isAuthenticated) {
            return [
                {
                    title: "Anmelden",
                    description: "Starte dort, wo du zuletzt aufgehört hast.",
                    cta: "Anmelden",
                    onClick: () => navigate(ROUTES.login),
                    variant: "primary",
                },
                {
                    title: "Konto erstellen",
                    description: "In 1 Minute startklar – familienfreundlich & einfach.",
                    cta: "Registrieren",
                    onClick: () => navigate(ROUTES.register),
                    variant: "secondary",
                },
            ];
        }

        const list: QuickAction[] = [
            {
                title: "Profil",
                description: "Deine Daten & Einstellungen verwalten.",
                cta: "Zum Profil",
                onClick: () => navigate(ROUTES.profile),
                variant: "primary",
            },
            {
                title: "Rezepte",
                description: "Schnell etwas finden oder neue Ideen speichern.",
                cta: "Zu den Rezepten",
                onClick: () => navigate(ROUTES.recipes),
                variant: "primary",
            },
        ];

        if (admin) {
            list.push({
                title: "Admin",
                description: "Systemstatus, Nutzer & Verwaltung.",
                cta: "Admin öffnen",
                onClick: () => navigate(ROUTES.admin),
                variant: "ghost",
            });
        }

        return list;
    }, [admin, isAuthenticated, navigate]);

    const headline = isAuthenticated ? `Hallo, ${displayName}!` : "Willkommen im Familienplaner";
    const subline = isAuthenticated
        ? "Schön, dass du da bist. Hab einen schönen Tag und schätze deine Zeit."
        : "Organisiere euren Alltag – ruhig, modern und angenehm einfach für die ganze Familie.";

    return (
        <PageShell className="space-y-10">
            {/* HERO */}
            <section className="ui-card overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    {headline}
                                </h1>
                                <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                                    {subline}
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-3 pt-2">
                                {!isAuthenticated ? (
                                    <>
                                        <button
                                            type="button"
                                            className="ui-focus inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-95 active:brightness-90"
                                            onClick={() => navigate(ROUTES.login)}
                                        >
                                            Anmelden
                                        </button>
                                        <button
                                            type="button"
                                            className="ui-focus inline-flex items-center justify-center rounded-xl border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition hover:bg-accent active:brightness-95"
                                            onClick={() => navigate(ROUTES.register)}
                                        >
                                            Registrieren
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="ui-focus inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-95 active:brightness-90"
                                            onClick={() => navigate(ROUTES.profile)}
                                        >
                                            Zum Profil
                                        </button>
                                        <button
                                            type="button"
                                            className="ui-focus inline-flex items-center justify-center rounded-xl border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition hover:brightness-95 active:brightness-90"
                                            onClick={() => navigate(ROUTES.recipes)}
                                        >
                                            Rezepte
                                        </button>

                                        {admin && (
                                            <button
                                                type="button"
                                                className="ui-focus inline-flex items-center justify-center rounded-xl border bg-destructive px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:brightness-95 active:brightness-90"
                                                onClick={() => navigate(ROUTES.admin)}
                                            >
                                                Admin
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="w-full max-w-md">
                            <div className="rounded-2xl border bg-muted p-5 text-sm text-muted-foreground">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">Heute schnell starten</span>
                                    <span aria-hidden>✨</span>
                                </div>

                                <ul className="mt-3 space-y-2">
                                    <li className="flex gap-2">
                                        <span aria-hidden>•</span>
                                        <span>Nutze Schnellzugriffe statt Suchen.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span aria-hidden>•</span>
                                        <span>Rezepte sind perfekt für Einkaufs- & Essensplanung.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span aria-hidden>•</span>
                                        <span>Später: Aufgaben & weitere Module – Schritt für Schritt.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK ACTIONS */}
            <section className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            {isAuthenticated ? "Schnellzugriffe" : "Schnell starten"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {isAuthenticated
                                ? "Alles Wichtige mit einem Klick."
                                : "Erstelle ein Konto oder melde dich an, um loszulegen."}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {actions.map((a) => (
                        <button
                            key={a.title}
                            type="button"
                            onClick={a.onClick}
                            className={[
                                "ui-card ui-card-hover ui-focus text-left",
                                "p-5",
                            ].join(" ")}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold">{a.title}</h3>
                                    <span className="text-muted-foreground" aria-hidden>
                                        →
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{a.description}</p>

                                <div className="pt-2">
                                    <span
                                        className={[
                                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                                            a.variant === "primary"
                                                ? "bg-primary text-primary-foreground"
                                                : a.variant === "secondary"
                                                    ? "bg-secondary text-secondary-foreground"
                                                    : "bg-accent text-accent-foreground",
                                        ].join(" ")}
                                    >
                                        {a.cta}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Warum das gut funktioniert</h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="ui-card p-5">
                        <div className="text-2xl" aria-hidden>🧘</div>
                        <h3 className="mt-2 font-semibold">Ruhig & übersichtlich</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Weniger Ablenkung, klarer Fokus – so bleibt Planung entspannt.
                        </p>
                    </div>

                    <div className="ui-card p-5">
                        <div className="text-2xl" aria-hidden>⚡</div>
                        <h3 className="mt-2 font-semibold">Schnell im Alltag</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Häufige Aktionen sind sofort erreichbar – ohne Umwege.
                        </p>
                    </div>

                    <div className="ui-card p-5">
                        <div className="text-2xl" aria-hidden>👨‍👩‍👧‍👦</div>
                        <h3 className="mt-2 font-semibold">Für die ganze Familie</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Freundliches Design, klare Sprache, angenehm auf Handy & Desktop.
                        </p>
                    </div>
                </div>
            </section>
        </PageShell>
    );
};

export default HomePage;
