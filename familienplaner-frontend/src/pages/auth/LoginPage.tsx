import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import { ROUTES } from "@/router/paths";
import { login as loginApi } from "@/api/index.api";
import { useAuth } from "@/context/AuthContext";
import type { LoginRequest } from "@/types/auth.types";

import { normalizeUsername, getErrorMessage } from "@/util/index.util";
import { CenteredCardShell } from "@/components/layout/CenteredCardShell";
import { Alert } from "@/components/ui/Alert";

/* ============================================================================
 * Shared styles
 * ========================================================================== */

const inputBase =
    "w-full rounded-xl border bg-input px-3 py-2 text-sm " +
    "text-foreground shadow-sm transition-colors " +
    "placeholder:text-muted-foreground " +
    "disabled:cursor-not-allowed disabled:opacity-60";

const labelBase = "text-sm font-medium text-foreground";

/* ============================================================================
 * LoginPage
 * ========================================================================== */

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
        <CenteredCardShell>
            <section className="ui-card w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                            <LogIn className="h-6 w-6 text-primary" />
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold tracking-tight">
                                Willkommen zurück
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Melde dich an, um deinen Familienplaner zu nutzen.
                            </p>
                        </div>
                    </div>

                    {/* Error */}
                    {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

                    {/* Form */}
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
        </CenteredCardShell>
    );
};

export default LoginPage;
