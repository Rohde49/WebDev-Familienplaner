import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { ROUTES } from "@/router/paths";
import { register } from "@/api/index.api";
import type { RegisterRequest } from "@/types/index.types";

import {
    normalizeUsername, getErrorMessage,
    validateUsername, validateNewPassword, validatePasswordConfirmation,
} from "@/util/index.util";
import { CenteredCardShell } from "@/components/layout/CenteredCardShell";
import { Alert } from "@/components/ui/Alert";

/* ============================================================================
 * Shared styles
 * ========================================================================== */

const inputBase =
    "ui-focus w-full rounded-xl border bg-input px-3 py-2 text-sm text-foreground shadow-sm " +
    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60";

const labelBase = "text-sm font-medium text-foreground";
const hintBase = "text-xs text-muted-foreground";

/* ============================================================================
 * RegisterPage
 * ========================================================================== */

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const usernameResult = useMemo(() => validateUsername(username), [username]);
    const passwordResult = useMemo(() => validateNewPassword(password), [password]);
    const confirmResult = useMemo(
        () => validatePasswordConfirmation(password, passwordConfirm),
        [password, passwordConfirm]
    );

    const canSubmit =
        usernameResult.valid &&
        passwordResult.valid &&
        confirmResult.valid &&
        !loading;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (!canSubmit) {
            setErrorMsg("Bitte prüfe deine Eingaben.");
            return;
        }

        const payload: RegisterRequest = {
            username: normalizeUsername(username),
            password,
        };

        try {
            setLoading(true);
            await register(payload);

            setSuccessMsg(
                "Registrierung erfolgreich! Du kannst dich jetzt einloggen."
            );

            setPassword("");
            setPasswordConfirm("");

            setTimeout(() => navigate(ROUTES.login), 500);
        } catch (err) {
            setErrorMsg(getErrorMessage(err, "Registrierung fehlgeschlagen."));
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
                            <UserPlus className="h-6 w-6 text-primary" />
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold tracking-tight">
                                Account erstellen
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Für deinen Familienplaner – schnell, ruhig und unkompliziert.
                            </p>
                        </div>
                    </div>

                    {/* Alerts */}
                    {errorMsg && <Alert variant="error">{errorMsg}</Alert>}
                    {successMsg && <Alert variant="success">{successMsg}</Alert>}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Username */}
                        <div className="space-y-2">
                            <label className={labelBase} htmlFor="username">
                                Benutzername
                            </label>
                            <input
                                id="username"
                                className={[
                                    inputBase,
                                    username.length > 0 && !usernameResult.valid
                                        ? "border-destructive/50 focus-visible:ring-destructive/40"
                                        : "",
                                ].join(" ")}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Benutzername"
                                autoComplete="username"
                                disabled={loading}
                            />
                            <p className={hintBase}>
                                Mindestens 3 Zeichen, keine Leerzeichen.
                            </p>
                            {!usernameResult.valid && username.length > 0 && (
                                <p className="text-sm text-destructive">
                                    {usernameResult.errors[0]}
                                </p>
                            )}
                        </div>

                        {/* Passwort */}
                        <div className="space-y-2">
                            <label className={labelBase} htmlFor="password">
                                Passwort
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={[
                                    inputBase,
                                    password.length > 0 && !passwordResult.valid
                                        ? "border-destructive/50 focus-visible:ring-destructive/40"
                                        : "",
                                ].join(" ")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Passwort"
                                autoComplete="new-password"
                                disabled={loading}
                            />
                            <p className={hintBase}>
                                Mind. 6 Zeichen, Groß- & Kleinbuchstabe, eine Zahl,
                                keine Leerzeichen.
                            </p>
                            {!passwordResult.valid && password.length > 0 && (
                                <ul className="list-disc space-y-1 pl-5 text-sm text-destructive">
                                    {passwordResult.errors.map((msg) => (
                                        <li key={msg}>{msg}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Passwort bestätigen */}
                        <div className="space-y-2">
                            <label className={labelBase} htmlFor="passwordConfirm">
                                Passwort bestätigen
                            </label>
                            <input
                                id="passwordConfirm"
                                type="password"
                                className={[
                                    inputBase,
                                    passwordConfirm.length > 0 && !confirmResult.valid
                                        ? "border-destructive/50 focus-visible:ring-destructive/40"
                                        : "",
                                ].join(" ")}
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="Passwort bestätigen"
                                autoComplete="new-password"
                                disabled={loading}
                            />
                            {!confirmResult.valid && passwordConfirm.length > 0 && (
                                <p className="text-sm text-destructive">
                                    {confirmResult.errors[0]}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="ui-focus inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-95 active:brightness-90 disabled:opacity-60"
                            disabled={!canSubmit}
                        >
                            {loading ? "Erstelle Account…" : "Registrieren"}
                        </button>

                        <p className="text-center text-sm text-muted-foreground">
                            Schon einen Account?{" "}
                            <Link
                                className="ui-focus rounded-md font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                                to={ROUTES.login}
                            >
                                Zum Login
                            </Link>
                        </p>
                    </form>
                </div>
            </section>
        </CenteredCardShell>
    );
};

export default RegisterPage;
