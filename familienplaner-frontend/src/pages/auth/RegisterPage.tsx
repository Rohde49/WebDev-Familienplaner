import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../router/paths";
import { register } from "../../api/index.api";
import type { RegisterRequest } from "../../types/index.types";

import {
    normalizeUsername,
    validateUsername,
    validateNewPassword,
    validatePasswordConfirmation,
    getErrorMessage,
} from "../../util/index.util";

import { PageShell } from "../../components/layout/PageShell";

const inputBase =
    "ui-focus w-full rounded-xl border bg-input px-3 py-2 text-sm text-foreground shadow-sm " +
    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60";

const labelBase = "text-sm font-medium text-foreground";
const hintBase = "text-xs text-muted-foreground";

function Alert({
                   variant,
                   children,
               }: {
    variant: "error" | "success" | "info";
    children: React.ReactNode;
}) {
    const cls =
        variant === "error"
            ? "border-destructive/30 bg-destructive/10"
            : variant === "success"
                ? "border-primary/30 bg-primary/10"
                : "border-border bg-muted";

    const icon = variant === "error" ? "⚠️" : variant === "success" ? "✅" : "ℹ️";

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

    const canSubmit = usernameResult.valid && passwordResult.valid && confirmResult.valid && !loading;

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

            setSuccessMsg("Registrierung erfolgreich! Du kannst dich jetzt einloggen.");
            setPassword("");
            setPasswordConfirm("");

            // UX: kurz nach Erfolg zum Login
            setTimeout(() => navigate(ROUTES.login), 500);
        } catch (err) {
            setErrorMsg(getErrorMessage(err, "Registrierung fehlgeschlagen."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageShell title="Account erstellen" className="space-y-8">
            <p className="text-sm text-muted-foreground">
                Für deinen Familienplaner – schnell, ruhig und unkompliziert.
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* LEFT: Form */}
                <section className="ui-card p-6 sm:p-7">
                    <div className="space-y-5">
                        {errorMsg && <Alert variant="error">{errorMsg}</Alert>}
                        {successMsg && <Alert variant="success">{successMsg}</Alert>}

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
                                <p className={hintBase}>Mindestens 3 Zeichen, keine Leerzeichen.</p>
                                {!usernameResult.valid && username.length > 0 && (
                                    <p className="text-sm text-destructive">{usernameResult.errors[0]}</p>
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
                                    Mind. 6 Zeichen, Groß- & Kleinbuchstabe, eine Zahl, keine Leerzeichen.
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
                                    <p className="text-sm text-destructive">{confirmResult.errors[0]}</p>
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

                {/* RIGHT: Friendly guide */}
                <aside className="ui-card p-6 sm:p-7">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold tracking-tight">Startklar in 1 Minute ✨</h2>
                            <p className="text-sm text-muted-foreground">
                                Ein paar Tipps, damit du sofort entspannt loslegen kannst.
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-muted p-4 text-sm text-muted-foreground">
                            <ul className="space-y-2">
                                <li className="flex gap-2">
                                    <span aria-hidden>•</span>
                                    <span>Wähle einen Benutzernamen, den die Familie leicht erkennt.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span aria-hidden>•</span>
                                    <span>Nutze ein starkes Passwort – du kannst es später im Profil ändern.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span aria-hidden>•</span>
                                    <span>Nach der Registrierung geht’s direkt zum Login.</span>
                                </li>
                            </ul>
                        </div>

                        <Alert variant="info">
                            Tipp: Wenn du mehrere Nutzer planst, erstelle zuerst deinen Haupt-Account.
                        </Alert>
                    </div>
                </aside>
            </div>
        </PageShell>
    );
};

export default RegisterPage;
