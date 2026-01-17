import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../router/paths";
import { login as loginApi } from "../../api/index.api";
import { useAuth } from "../../context/AuthContext";
import type { LoginRequest } from "../../types/index.types";

import { normalizeUsername, getErrorMessage } from "../../util/index.util";
import { PageShell } from "../../components/layout/PageShell";

const inputBase =
    "ui-focus w-full rounded-xl border bg-input px-3 py-2 text-sm text-foreground shadow-sm " +
    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60";

const labelBase = "text-sm font-medium text-foreground";

function Alert({
                   variant,
                   children,
               }: {
    variant: "error" | "info";
    children: React.ReactNode;
}) {
    const cls =
        variant === "error"
            ? "border-destructive/30 bg-destructive/10"
            : "border-border bg-muted";

    const icon = variant === "error" ? "⚠️" : "ℹ️";

    return (
        <div className={`rounded-2xl border p-4 text-sm text-foreground ${cls}`}>
            <div className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5">
                    {icon}
                </span>
                <div className="min-w-0">{children}</div>
            </div>
        </div>
    );
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const canSubmit = username.trim().length > 0 && password.length > 0 && !loading;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        if (!canSubmit) {
            setErrorMsg("Bitte Benutzername und Passwort eingeben.");
            return;
        }

        const payload: LoginRequest = {
            username: normalizeUsername(username),
            password,
        };

        try {
            setLoading(true);
            const data = await loginApi(payload);
            login(data);

            navigate(ROUTES.home, { replace: true });
        } catch (err) {
            setErrorMsg(getErrorMessage(err, "Login fehlgeschlagen."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageShell title="Willkommen zurück" className="space-y-8">
            <p className="text-sm text-muted-foreground">
                Melde dich an, um deinen Familienplaner zu nutzen.
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* LEFT: Form */}
                <section className="ui-card p-6 sm:p-7">
                    <div className="space-y-5">
                        {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <div className="space-y-2">
                                <label className={labelBase} htmlFor="username">
                                    Benutzername
                                </label>
                                <input
                                    id="username"
                                    className={inputBase}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Benutzername"
                                    autoComplete="username"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={labelBase} htmlFor="password">
                                    Passwort
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className={inputBase}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Passwort"
                                    autoComplete="current-password"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="ui-focus inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-95 active:brightness-90 disabled:opacity-60"
                                disabled={!canSubmit}
                            >
                                {loading ? "Anmelden…" : "Anmelden"}
                            </button>

                            <p className="text-center text-sm text-muted-foreground">
                                Noch kein Account?{" "}
                                <Link
                                    className="ui-focus rounded-md font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                                    to={ROUTES.register}
                                >
                                    Registrieren
                                </Link>
                            </p>
                        </form>
                    </div>
                </section>

                {/* RIGHT: Friendly hint */}
                <aside className="ui-card p-6 sm:p-7">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold tracking-tight">
                                Schnell wieder drin ✨
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Ein paar kleine Hinweise, falls du gerade erst startest.
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-muted p-4 text-sm text-muted-foreground">
                            <ul className="space-y-2">
                                <li className="flex gap-2">
                                    <span aria-hidden>•</span>
                                    <span>Benutzernamen werden automatisch normalisiert.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span aria-hidden>•</span>
                                    <span>Nach dem Login landest du direkt auf der Startseite.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span aria-hidden>•</span>
                                    <span>Du kannst dein Profil später jederzeit anpassen.</span>
                                </li>
                            </ul>
                        </div>

                        <Alert variant="info">
                            Tipp: Wenn du neu bist, erstelle zuerst ein Konto über{" "}
                            <Link
                                className="ui-focus rounded-md font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                                to={ROUTES.register}
                            >
                                Registrieren
                            </Link>
                            .
                        </Alert>
                    </div>
                </aside>
            </div>
        </PageShell>
    );
};

export default LoginPage;
