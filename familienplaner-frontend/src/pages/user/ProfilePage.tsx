/*
 * ============================================================================
 * ProfilePage – Profilverwaltung
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
    ChangePasswordRequest,
    LoginResponse,
    User,
} from "@/types/index.types";
import { useAuth } from "@/context/AuthContext";

import {
    changeCurrentUserPassword,
    getAuthToken,
    getCurrentUser,
    updateCurrentUserProfile,
} from "@/api/index.api";

import {
    getErrorMessage,
    validatePasswordChange,
    toProfileForm,
    toUpdateProfileRequest,
    deleteCurrentUser,
    type ProfileFormValues,
} from "@/util/index.util";

import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

/* ============================================================================
 * Helpers
 * ============================================================================
 */

function SectionHeader({
                           title,
                           description,
                       }: {
    title: string;
    description?: string;
}) {
    return (
        <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">
                {title}
            </h2>
            {description && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}

/* ============================================================================
 * Types
 * ============================================================================
 */

type PasswordFormState = {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
};

/* ============================================================================
 * Page
 * ============================================================================
 */

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { login, logout } = useAuth();

    const [loading, setLoading] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [profileSaving, setProfileSaving] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    // Delete account state
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [profileForm, setProfileForm] = useState<ProfileFormValues>({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
    });

    const [passwordForm, setPasswordForm] =
        useState<PasswordFormState>({
            currentPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
        });

    const username = useMemo(
        () => user?.username ?? "—",
        [user]
    );
    const role = useMemo(
        () => user?.role ?? "—",
        [user]
    );

    const canSaveProfile =
        !loading && !profileSaving && !!user;

    const canSavePassword =
        !loading &&
        !passwordSaving &&
        !!user &&
        passwordForm.currentPassword &&
        passwordForm.newPassword &&
        passwordForm.newPasswordConfirm;

    async function refetchAndSyncUser() {
        const fresh = await getCurrentUser();
        setUser(fresh);
        setProfileForm(toProfileForm(fresh));

        const token = getAuthToken();
        if (token) {
            const data: LoginResponse = {
                token,
                user: fresh,
            };
            login(data);
        }
    }

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setErrorMsg(null);

                const me = await getCurrentUser();
                if (!alive) return;

                setUser(me);
                setProfileForm(toProfileForm(me));
            } catch (err) {
                if (!alive) return;
                setErrorMsg(
                    getErrorMessage(
                        err,
                        "Profil konnte nicht geladen werden."
                    )
                );
            } finally {
                if (!alive) return;
                setLoading(false);
                setInitialLoadDone(true);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    async function handleSaveProfile(
        e: React.FormEvent
    ) {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);

        if (!canSaveProfile) return;

        const mapped =
            toUpdateProfileRequest(profileForm);

        if (!mapped.valid) {
            setProfileError(mapped.error);
            return;
        }

        try {
            setProfileSaving(true);
            await updateCurrentUserProfile(
                mapped.payload
            );
            await refetchAndSyncUser();
            setProfileSuccess(
                "Profil wurde gespeichert."
            );
        } catch (err) {
            setProfileError(
                getErrorMessage(
                    err,
                    "Profil konnte nicht gespeichert werden."
                )
            );
        } finally {
            setProfileSaving(false);
        }
    }

    async function handleChangePassword(
        e: React.FormEvent
    ) {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        const v =
            validatePasswordChange(passwordForm);
        if (!v.valid) {
            setPasswordError(v.errors[0]);
            return;
        }

        try {
            setPasswordSaving(true);
            await changeCurrentUserPassword(
                passwordForm as ChangePasswordRequest
            );
            setPasswordSuccess(
                "Passwort wurde geändert."
            );
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                newPasswordConfirm: "",
            });
            await refetchAndSyncUser();
        } catch (err) {
            setPasswordError(
                getErrorMessage(
                    err,
                    "Passwort konnte nicht geändert werden."
                )
            );
        } finally {
            setPasswordSaving(false);
        }
    }

    async function handleDeleteAccount() {
        setDeleteError(null);

        try {
            setDeleteLoading(true);
            await deleteCurrentUser();

            // Session sauber schließen + Redirect
            logout();
            navigate("/", { replace: true });
        } catch (err) {
            setDeleteError(
                getErrorMessage(
                    err,
                    "Account konnte nicht gelöscht werden."
                )
            );
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <PageLayout>
            <div className="space-y-6">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Mein Profil
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Verwalte deine persönlichen Daten
                        und dein Passwort.
                    </p>
                </header>

                {errorMsg && (
                    <Alert variant="error">
                        {errorMsg}
                    </Alert>
                )}

                {!initialLoadDone && (
                    <Alert variant="info">
                        Lade Profil…
                    </Alert>
                )}

                {initialLoadDone && user && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Profile */}
                        <Card className="p-6 sm:p-7 space-y-4">
                            <SectionHeader
                                title="Persönliche Daten"
                                description="Diese Angaben helfen dir und deiner Familie, alles übersichtlich zu halten."
                            />

                            <Card className="p-4 text-sm">
                                <p className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Benutzername
                                    </span>
                                    <span className="font-medium">
                                        {username}
                                    </span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Rolle
                                    </span>
                                    <span className="font-medium">
                                        {role}
                                    </span>
                                </p>
                            </Card>

                            {profileError && (
                                <Alert variant="error">
                                    {profileError}
                                </Alert>
                            )}
                            {profileSuccess && (
                                <Alert variant="success">
                                    {profileSuccess}
                                </Alert>
                            )}

                            <form
                                onSubmit={handleSaveProfile}
                                className="space-y-4"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Vorname"
                                        value={profileForm.firstName}
                                        onChange={(e) =>
                                            setProfileForm((p) => ({
                                                ...p,
                                                firstName: e.target.value,
                                            }))
                                        }
                                    />

                                    <Input
                                        label="Nachname"
                                        value={profileForm.lastName}
                                        onChange={(e) =>
                                            setProfileForm((p) => ({
                                                ...p,
                                                lastName: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <Input
                                    label="E-Mail"
                                    value={profileForm.email}
                                    onChange={(e) =>
                                        setProfileForm((p) => ({
                                            ...p,
                                            email: e.target.value,
                                        }))
                                    }
                                />

                                <Input
                                    label="Alter"
                                    type="number"
                                    value={profileForm.age}
                                    onChange={(e) =>
                                        setProfileForm((p) => ({
                                            ...p,
                                            age: e.target.value,
                                        }))
                                    }
                                    hint="Optional – hilft bei personalisierten Anzeigen."
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!canSaveProfile}
                                >
                                    {profileSaving
                                        ? "Wird gespeichert…"
                                        : "Profil speichern"}
                                </Button>
                            </form>
                        </Card>

                        {/* Password + Danger Zone */}
                        <Card className="p-6 sm:p-7 space-y-4">
                            <SectionHeader
                                title="Passwort ändern"
                                description="Wähle ein starkes Passwort – das schützt deine Daten."
                            />

                            {passwordError && (
                                <Alert variant="error">
                                    {passwordError}
                                </Alert>
                            )}
                            {passwordSuccess && (
                                <Alert variant="success">
                                    {passwordSuccess}
                                </Alert>
                            )}

                            <form
                                onSubmit={handleChangePassword}
                                className="space-y-4"
                            >
                                <Input
                                    type="password"
                                    placeholder="Aktuelles Passwort"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) =>
                                        setPasswordForm((p) => ({
                                            ...p,
                                            currentPassword: e.target.value,
                                        }))
                                    }
                                />

                                <Input
                                    type="password"
                                    placeholder="Neues Passwort"
                                    value={passwordForm.newPassword}
                                    onChange={(e) =>
                                        setPasswordForm((p) => ({
                                            ...p,
                                            newPassword: e.target.value,
                                        }))
                                    }
                                />

                                <Input
                                    type="password"
                                    placeholder="Neues Passwort bestätigen"
                                    value={passwordForm.newPasswordConfirm}
                                    onChange={(e) =>
                                        setPasswordForm((p) => ({
                                            ...p,
                                            newPasswordConfirm: e.target.value,
                                        }))
                                    }
                                />

                                <p className="text-xs text-muted-foreground">
                                    Mindestens 6 Zeichen,
                                    1 Großbuchstabe,
                                    1 Kleinbuchstabe,
                                    1 Zahl
                                </p>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!canSavePassword}
                                >
                                    {passwordSaving
                                        ? "Wird gespeichert…"
                                        : "Änderungen speichern"}
                                </Button>
                            </form>

                            {/* Danger Zone */}
                            <div className="pt-4 border-t space-y-3">
                                <p className="text-sm font-medium text-destructive">
                                    Account löschen
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Diese Aktion ist dauerhaft und kann nicht rückgängig gemacht werden.
                                </p>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                        setDeleteError(null);
                                        setDeleteOpen(true);
                                    }}
                                >
                                    Account dauerhaft löschen
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Delete Confirm Dialog */}
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                Account wirklich löschen?
                            </DialogTitle>
                            <DialogDescription>
                                Dein Account und alle zugehörigen Daten werden dauerhaft gelöscht.
                                Diese Aktion kann nicht rückgängig gemacht werden.
                            </DialogDescription>
                        </DialogHeader>

                        {deleteError && (
                            <Alert variant="error">
                                {deleteError}
                            </Alert>
                        )}

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setDeleteOpen(false)}
                                disabled={deleteLoading}
                            >
                                Abbrechen
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Wird gelöscht…" : "Endgültig löschen"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </PageLayout>
    );
};

export default ProfilePage;
