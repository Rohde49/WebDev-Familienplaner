import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import { ROUTES } from "@/router/paths";
import { login as loginApi } from "@/api/index.api";
import { useAuth } from "@/context/AuthContext";
import type { LoginRequest } from "@/types/auth.types";

import { normalizeUsername, getErrorMessage } from "@/util/index.util";

import { PageLayout } from "@/components/layout/PageLayout";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

/* ============================================================================
 * LoginPage
 * ============================================================================
 */

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
        <PageLayout
            className="flex justify-center"
            cardClassName="w-full max-w-md sm:max-w-lg"
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <LogIn className="h-6 w-6" />
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
                {errorMsg && (
                    <Alert variant="error">
                        {errorMsg}
                    </Alert>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                >
                    <Input
                        label="Benutzername"
                        placeholder="Benutzername"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />

                    <Input
                        label="Passwort"
                        type="password"
                        placeholder="Passwort"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!canSubmit}
                    >
                        {loading ? "Anmelden…" : "Anmelden"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Noch kein Account?{" "}
                        <Link
                            to={ROUTES.register}
                            className="
                                font-medium text-foreground
                                underline underline-offset-4
                                decoration-border
                                hover:decoration-foreground
                                focus-visible:outline-none
                                focus-visible:ring-2 focus-visible:ring-ring
                                rounded-sm
                            "
                        >
                            Registrieren
                        </Link>
                    </p>
                </form>
            </div>
        </PageLayout>
    );
};

export default LoginPage;
