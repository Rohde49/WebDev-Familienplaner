import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { ROUTES } from "@/router/paths";
import { register } from "@/api/index.api";
import type { RegisterRequest } from "@/types/index.types";

import {
    normalizeUsername,
    getErrorMessage,
    validateUsername,
    validateNewPassword,
    validatePasswordConfirmation,
} from "@/util/index.util";

import { PageLayout } from "@/components/layout/PageLayout";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

/* ============================================================================
 * RegisterPage
 * ============================================================================
 */

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    /* ---------------- Validation ---------------- */

    const usernameResult = useMemo(
        () => validateUsername(username),
        [username]
    );

    const passwordResult = useMemo(
        () => validateNewPassword(password),
        [password]
    );

    const confirmResult = useMemo(
        () =>
            validatePasswordConfirmation(
                password,
                passwordConfirm
            ),
        [password, passwordConfirm]
    );

    const canSubmit =
        usernameResult.valid &&
        passwordResult.valid &&
        confirmResult.valid &&
        !loading;

    /* ---------------- Submit ---------------- */

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
            setErrorMsg(
                getErrorMessage(err, "Registrierung fehlgeschlagen.")
            );
        } finally {
            setLoading(false);
        }
    }

    /* ============================================================================
     * Render
     * ============================================================================
     */

    return (
        <PageLayout
            className="flex justify-center"
            cardClassName="w-full max-w-md sm:max-w-lg"
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <UserPlus className="h-6 w-6" />
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
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                >
                    {/* Benutzername */}
                    <Input
                        label="Benutzername"
                        placeholder="Benutzername"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        error={
                            !usernameResult.valid && username.length > 0
                                ? usernameResult.errors[0]
                                : undefined
                        }
                        valid={
                            username.length > 0 && usernameResult.valid
                        }
                        hint="Mindestens 3 Zeichen, keine Leerzeichen."
                    />

                    {/* Passwort */}
                    <Input
                        label="Passwort"
                        type="password"
                        placeholder="Passwort"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        error={
                            !passwordResult.valid && password.length > 0
                                ? passwordResult.errors[0]
                                : undefined
                        }
                        valid={
                            password.length > 0 && passwordResult.valid
                        }
                        hint="Mind. 6 Zeichen, Groß- & Kleinbuchstabe, eine Zahl."
                    />

                    {/* Passwort bestätigen */}
                    <Input
                        label="Passwort bestätigen"
                        type="password"
                        placeholder="Passwort bestätigen"
                        autoComplete="new-password"
                        value={passwordConfirm}
                        onChange={(e) =>
                            setPasswordConfirm(e.target.value)
                        }
                        disabled={loading}
                        error={
                            !confirmResult.valid && passwordConfirm.length > 0
                                ? confirmResult.errors[0]
                                : undefined
                        }
                        valid={
                            passwordConfirm.length > 0 && confirmResult.valid
                        }
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!canSubmit}
                    >
                        {loading
                            ? "Erstelle Account…"
                            : "Registrieren"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Schon einen Account?{" "}
                        <Link
                            to={ROUTES.login}
                            className="
                                font-medium text-foreground
                                underline underline-offset-4
                                decoration-border
                                hover:decoration-foreground
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-ring
                                rounded-sm
                            "
                        >
                            Zum Login
                        </Link>
                    </p>
                </form>
            </div>
        </PageLayout>
    );
};

export default RegisterPage;
