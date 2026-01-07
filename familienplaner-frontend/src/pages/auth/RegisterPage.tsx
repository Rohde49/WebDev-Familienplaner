import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

        // final check (falls jemand direkt submit klickt)
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
            // kleine UX: Felder leeren
            setPassword("");
            setPasswordConfirm("");

            // kurz danach zur Login-Seite
            setTimeout(() => navigate(ROUTES.login), 500);
        } catch (err) {
            setErrorMsg(getErrorMessage(err, "Registrierung fehlgeschlagen."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="section-hero fade-in-up">
            <div className="container-narrow">
                <header className="page-header">
                    <h1 className="h2">Account erstellen</h1>
                    <p className="lead">Für deinen Familienplaner – schnell und unkompliziert.</p>
                </header>

                <div className="card">
                    {errorMsg && <div className="alert-error mb-4">{errorMsg}</div>}
                    {successMsg && <div className="alert-success mb-4">{successMsg}</div>}

                    <form onSubmit={handleSubmit} className="page-stack">
                        {/* Username */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">
                                Benutzername
                            </label>
                            <input
                                id="username"
                                className={`input ${username.length > 0 && !usernameResult.valid ? "input-error" : ""}`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Benutzername"
                                autoComplete="username"
                                disabled={loading}
                            />
                            <p className="form-hint">Mindestens 3 Zeichen, keine Leerzeichen.</p>
                            {!usernameResult.valid && username.length > 0 && (
                                <div className="form-error">{usernameResult.errors[0]}</div>
                            )}
                        </div>

                        {/* Passwort */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Passwort
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={`input ${password.length > 0 && !passwordResult.valid ? "input-error" : ""}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Passwort"
                                autoComplete="new-password"
                                disabled={loading}
                            />
                            <p className="form-hint">
                                Mind. 6 Zeichen, Groß- & Kleinbuchstabe, eine Zahl, keine Leerzeichen.
                            </p>
                            {!passwordResult.valid && password.length > 0 && (
                                <ul className="form-error list-disc pl-5">
                                    {passwordResult.errors.map((msg) => (
                                        <li key={msg}>{msg}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Passwort bestätigen */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="passwordConfirm">
                                Passwort bestätigen
                            </label>
                            <input
                                id="passwordConfirm"
                                type="password"
                                className={`input ${
                                    passwordConfirm.length > 0 && !confirmResult.valid ? "input-error" : ""
                                }`}
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="Passwort bestätigen"
                                autoComplete="new-password"
                                disabled={loading}
                            />
                            {!confirmResult.valid && passwordConfirm.length > 0 && (
                                <div className="form-error">{confirmResult.errors[0]}</div>
                            )}
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn btn-primary btn-md btn-block" disabled={!canSubmit}>
                            {loading ? "Erstelle Account..." : "Registrieren"}
                        </button>

                        <p className="small-text text-center">
                            Schon einen Account?{" "}
                            <Link className="link-muted" to={ROUTES.login}>
                                Zum Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
