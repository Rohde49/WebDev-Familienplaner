/*
 * ============================================================================
 * ProfilePage – Profilverwaltung
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from "react";

import type {
    ChangePasswordRequest,
    LoginResponse,
    User,
} from "../../types/index.types";

import {
    changeCurrentUserPassword,
    getAuthToken,
    getCurrentUser,
    updateCurrentUserProfile,
} from "../../api/index.api";

import { useAuth } from "../../context/AuthContext";
import {
    getErrorMessage,
    validatePasswordChange,
    toProfileForm,
    toUpdateProfileRequest,
    type ProfileFormValues,
} from "../../util/index.util";

import { Alert } from "../../components/ui/Alert";
import { ProfileCardShell } from "../../components/layout/ProfileCardShell";

/* ============================================================================
 * Styles
 * ========================================================================== */

const inputBase =
    "ui-focus w-full rounded-xl border bg-input px-3 py-2 text-sm text-foreground shadow-sm " +
    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60";

const labelBase = "text-sm font-medium text-foreground";
const hintBase = "text-xs text-muted-foreground";

/* ============================================================================
 * Helpers
 * ========================================================================== */

function SectionHeader({
                           title,
                           description,
                       }: {
    title: string;
    description?: string;
}) {
    return (
        <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}

/* ============================================================================
 * Page
 * ========================================================================== */

type PasswordFormState = {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
};

const ProfilePage: React.FC = () => {
    const { login } = useAuth();

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

    const [profileForm, setProfileForm] = useState<ProfileFormValues>({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
    });

    const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
    });

    const username = useMemo(() => user?.username ?? "—", [user]);
    const role = useMemo(() => user?.role ?? "—", [user]);

    const canSaveProfile = !loading && !profileSaving && !!user;
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
            const data: LoginResponse = { token, user: fresh };
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
                    getErrorMessage(err, "Profil konnte nicht geladen werden.")
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

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);

        if (!canSaveProfile) return;

        const mapped = toUpdateProfileRequest(profileForm);
        if (!mapped.valid) {
            setProfileError(mapped.error);
            return;
        }

        try {
            setProfileSaving(true);
            await updateCurrentUserProfile(mapped.payload);
            await refetchAndSyncUser();
            setProfileSuccess("Profil wurde gespeichert.");
        } catch (err) {
            setProfileError(
                getErrorMessage(err, "Profil konnte nicht gespeichert werden.")
            );
        } finally {
            setProfileSaving(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        const v = validatePasswordChange(passwordForm);
        if (!v.valid) {
            setPasswordError(v.errors[0]);
            return;
        }

        try {
            setPasswordSaving(true);
            await changeCurrentUserPassword(passwordForm as ChangePasswordRequest);
            setPasswordSuccess("Passwort wurde geändert.");
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                newPasswordConfirm: "",
            });
            await refetchAndSyncUser();
        } catch (err) {
            setPasswordError(
                getErrorMessage(err, "Passwort konnte nicht geändert werden.")
            );
        } finally {
            setPasswordSaving(false);
        }
    }

    return (
        <ProfileCardShell
            title="Mein Profil"
            description="Verwalte deine persönlichen Daten und dein Passwort."
        >
            {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

            {!initialLoadDone && (
                <Alert variant="info">Lade Profil…</Alert>
            )}

            {initialLoadDone && user && (
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Profile */}
                    <section className="ui-card p-6 sm:p-7">
                        <SectionHeader
                            title="Persönliche Daten"
                            description="Diese Angaben helfen dir und deiner Familie, alles übersichtlich zu halten."
                        />

                        <div className="mt-4 rounded-2xl border bg-muted p-4 text-sm">
                            <p className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Benutzername
                                </span>
                                <span className="font-medium">{username}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Rolle
                                </span>
                                <span className="font-medium">{role}</span>
                            </p>
                        </div>

                        {profileError && (
                            <Alert variant="error">{profileError}</Alert>
                        )}
                        {profileSuccess && (
                            <Alert variant="success">{profileSuccess}</Alert>
                        )}

                        <form
                            onSubmit={handleSaveProfile}
                            className="mt-4 space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelBase}>Vorname</label>
                                    <input
                                        className={inputBase}
                                        value={profileForm.firstName}
                                        onChange={(e) =>
                                            setProfileForm((p) => ({
                                                ...p,
                                                firstName: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div>
                                    <label className={labelBase}>Nachname</label>
                                    <input
                                        className={inputBase}
                                        value={profileForm.lastName}
                                        onChange={(e) =>
                                            setProfileForm((p) => ({
                                                ...p,
                                                lastName: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelBase}>E-Mail</label>
                                <input
                                    className={inputBase}
                                    value={profileForm.email}
                                    onChange={(e) =>
                                        setProfileForm((p) => ({
                                            ...p,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div>
                                <label className={labelBase}>Alter</label>
                                <input
                                    type="number"
                                    className={inputBase}
                                    value={profileForm.age}
                                    onChange={(e) =>
                                        setProfileForm((p) => ({
                                            ...p,
                                            age: e.target.value,
                                        }))
                                    }
                                />
                                <p className={hintBase}>
                                    Optional – hilft bei personalisierten Anzeigen.
                                </p>
                            </div>

                            <button
                                className="ui-focus w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                disabled={!canSaveProfile}
                            >
                                {profileSaving
                                    ? "Wird gespeichert…"
                                    : "Profil speichern"}
                            </button>
                        </form>
                    </section>

                    {/* Password */}
                    <section className="ui-card p-6 sm:p-7">
                        <SectionHeader
                            title="Passwort ändern"
                            description="Wähle ein starkes Passwort – das schützt deine Daten."
                        />

                        {passwordError && (
                            <Alert variant="error">{passwordError}</Alert>
                        )}
                        {passwordSuccess && (
                            <Alert variant="success">{passwordSuccess}</Alert>
                        )}

                        <form
                            onSubmit={handleChangePassword}
                            className="mt-4 space-y-4"
                        >
                            <input
                                type="password"
                                placeholder="Aktuelles Passwort"
                                className={inputBase}
                                value={passwordForm.currentPassword}
                                onChange={(e) =>
                                    setPasswordForm((p) => ({
                                        ...p,
                                        currentPassword: e.target.value,
                                    }))
                                }
                            />

                            <input
                                type="password"
                                placeholder="Neues Passwort"
                                className={inputBase}
                                value={passwordForm.newPassword}
                                onChange={(e) =>
                                    setPasswordForm((p) => ({
                                        ...p,
                                        newPassword: e.target.value,
                                    }))
                                }
                            />

                            <input
                                type="password"
                                placeholder="Neues Passwort bestätigen"
                                className={inputBase}
                                value={passwordForm.newPasswordConfirm}
                                onChange={(e) =>
                                    setPasswordForm((p) => ({
                                        ...p,
                                        newPasswordConfirm: e.target.value,
                                    }))
                                }
                            />

                            <p className={hintBase}>
                                Mindestens 6 Zeichen, 1 Großbuchstabe, 1
                                Kleinbuchstabe, 1 Zahl
                            </p>

                            <button
                                className="ui-focus w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                disabled={!canSavePassword}
                            >
                                {passwordSaving
                                    ? "Wird gespeichert…"
                                    : "Änderungen speichern"}
                            </button>
                        </form>
                    </section>
                </div>
            )}
        </ProfileCardShell>
    );
};

export default ProfilePage;
