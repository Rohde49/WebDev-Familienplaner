import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../router/paths";
import { login as loginApi } from "../../api/index.api";
import { useAuth } from "../../context/AuthContext";
import type { LoginRequest } from "../../types/index.types";

import { normalizeUsername, getErrorMessage } from "../../util/index.util";


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const canSubmit =
        username.trim().length > 0 &&
        password.length > 0 &&
        !loading;

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
        <div className="section-hero fade-in-up">
            <div className="container-narrow">
                <header className="page-header">
                    <h1 className="h2">Willkommen zurück</h1>
                    <p className="lead">Melde dich an, um deinen Familienplaner zu nutzen.</p>
                </header>

                <div className="card">
                    {errorMsg && <div className="alert-error mb-4">{errorMsg}</div>}

                    <form onSubmit={handleSubmit} className="page-stack">
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">
                                Benutzername
                            </label>
                            <input
                                id="username"
                                className="input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="z.B. Peter"
                                autoComplete="username"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Passwort
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-md btn-block" disabled={!canSubmit}>
                            {loading ? "Anmelden..." : "Anmelden"}
                        </button>

                        <p className="small-text text-center">
                            Noch kein Account?{" "}
                            <Link className="link-muted" to={ROUTES.register}>
                                Registrieren
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
