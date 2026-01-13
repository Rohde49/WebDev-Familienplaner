/*
 * ============================================================================
 * ProfilePage – Profilverwaltung (Persönliche Daten + Passwort ändern)
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from "react";

import type { ChangePasswordRequest, LoginResponse, User } from "../../types/index.types";

import {
    changeCurrentUserPassword,
    getAuthToken,
    getCurrentUser,
    updateCurrentUserProfile,
} from "../../api/index.api";

import { useAuth } from "../../context/AuthContext";
import { getErrorMessage, validatePasswordChange } from "../../util/index.util";

import {
    toProfileForm,
    toUpdateProfileRequest,
    type ProfileFormValues,
} from "../../util/user.util";

import { PageShell } from "../../components/layout/PageShell";

type PasswordFormState = {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
};

const inputBase =
    "ui-focus w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground shadow-sm " +
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
            ? "border-destructive/30 bg-destructive/10 text-foreground"
            : variant === "success"
                ? "border-primary/30 bg-primary/10 text-foreground"
                : "border-border bg-muted text-foreground";

    const icon = variant === "error" ? "⚠️" : variant === "success" ? "✅" : "ℹ️";

    return (
        <div className={`rounded-2xl border p-4 text-sm ${cls}`}>
            <div className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5">
                    {icon}
                </span>
                <div className="min-w-0">{children}</div>
            </div>
        </div>
    );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    );
}

const ProfilePage: React.FC = () => {
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    // Page-Level Load Error (für das initiale Laden)
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Profile-Form Feedback
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

    // Password-Form Feedback
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
        passwordForm.currentPassword.length > 0 &&
        passwordForm.newPassword.length > 0 &&
        passwordForm.newPasswordConfirm.length > 0;

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
                setUser(null);
                setErrorMsg(getErrorMessage(err, "Profil konnte nicht geladen werden."));
            } finally {
                if (!alive) return;
                setLoading(false);
                setInitialLoadDone(true);
            }
        })();

        return () => {
            alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();

        setProfileError(null);
        setProfileSuccess(null);

        if (!canSaveProfile) {
            setProfileError("Du bist nicht eingeloggt oder die Seite lädt noch.");
            return;
        }

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
            setProfileError(getErrorMessage(err, "Profil konnte nicht gespeichert werden."));
        } finally {
            setProfileSaving(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();

        setPasswordError(null);
        setPasswordSuccess(null);

        if (!canSavePassword) {
            setPasswordError("Bitte alle Passwortfelder ausfüllen.");
            return;
        }

        const v = validatePasswordChange(passwordForm);
        if (!v.valid) {
            setPasswordError(v.errors[0] ?? "Passwort-Änderung ist ungültig.");
            return;
        }

        const payload: ChangePasswordRequest = {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
            newPasswordConfirm: passwordForm.newPasswordConfirm,
        };

        try {
            setPasswordSaving(true);
            await changeCurrentUserPassword(payload);

            setPasswordSuccess("Passwort wurde geändert.");
            setPasswordForm({ currentPassword: "", newPassword: "", newPasswordConfirm: "" });

            await refetchAndSyncUser();
        } catch (err) {
            setPasswordError(getErrorMessage(err, "Passwort konnte nicht geändert werden."));
        } finally {
            setPasswordSaving(false);
        }
    }

    return (
        <PageShell title="Mein Profil" className="space-y-8">
            <p className="text-sm text-muted-foreground">
                Verwalte deine persönlichen Daten und dein Passwort.
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* LEFT: Profile */}
                <section className="ui-card p-6 sm:p-7">
                    <div className="space-y-5">
                        <SectionHeader
                            title="Persönliche Daten"
                            description="Diese Angaben helfen dir und deiner Familie, alles übersichtlich zu halten."
                        />

                        {/* Initial Load Error */}
                        {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

                        {!initialLoadDone && (
                            <Alert variant="info">
                                <span className="text-muted-foreground">Lade Profil…</span>
                            </Alert>
                        )}

                        {initialLoadDone && user && (
                            <>
                                {/* Username & Role Info */}
                                <div className="rounded-2xl border bg-muted p-4">
                                    <div className="grid gap-2 text-sm">
                                        <p className="flex items-center justify-between gap-3">
                                            <span className="text-muted-foreground">Benutzername</span>
                                            <span className="font-medium text-foreground">{username}</span>
                                        </p>
                                        <p className="flex items-center justify-between gap-3">
                                            <span className="text-muted-foreground">Rolle</span>
                                            <span className="font-medium text-foreground">{role}</span>
                                        </p>
                                    </div>
                                </div>

                                {profileError && <Alert variant="error">{profileError}</Alert>}
                                {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}

                                <form onSubmit={handleSaveProfile} className="space-y-4" noValidate>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className={labelBase} htmlFor="firstName">
                                                Vorname
                                            </label>
                                            <input
                                                id="firstName"
                                                className={inputBase}
                                                value={profileForm.firstName}
                                                onChange={(e) =>
                                                    setProfileForm((p) => ({ ...p, firstName: e.target.value }))
                                                }
                                                autoComplete="given-name"
                                                disabled={loading || profileSaving}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={labelBase} htmlFor="lastName">
                                                Nachname
                                            </label>
                                            <input
                                                id="lastName"
                                                className={inputBase}
                                                value={profileForm.lastName}
                                                onChange={(e) =>
                                                    setProfileForm((p) => ({ ...p, lastName: e.target.value }))
                                                }
                                                autoComplete="family-name"
                                                disabled={loading || profileSaving}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className={labelBase} htmlFor="email">
                                            E-Mail
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className={inputBase}
                                            value={profileForm.email}
                                            onChange={(e) =>
                                                setProfileForm((p) => ({ ...p, email: e.target.value }))
                                            }
                                            autoComplete="email"
                                            disabled={loading || profileSaving}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={labelBase} htmlFor="age">
                                            Alter
                                        </label>
                                        <input
                                            id="age"
                                            type="number"
                                            className={inputBase}
                                            inputMode="numeric"
                                            min={0}
                                            max={150}
                                            value={profileForm.age}
                                            onChange={(e) =>
                                                setProfileForm((p) => ({ ...p, age: e.target.value }))
                                            }
                                            disabled={loading || profileSaving}
                                        />
                                        <p className={hintBase}>Optional – hilft bei personalisierten Anzeigen.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="ui-focus inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-95 active:brightness-90 disabled:opacity-60"
                                        disabled={!canSaveProfile}
                                    >
                                        {profileSaving ? "Wird gespeichert…" : "Profil speichern"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </section>

                {/* RIGHT: Password */}
                <section className="ui-card p-6 sm:p-7">
                    <div className="space-y-5">
                        <SectionHeader
                            title="Passwort ändern"
                            description="Wähle ein starkes Passwort – das schützt deine Daten."
                        />

                        {passwordError && <Alert variant="error">{passwordError}</Alert>}
                        {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}

                        <form onSubmit={handleChangePassword} className="space-y-4" noValidate>
                            <div className="space-y-2">
                                <label className={labelBase} htmlFor="currentPassword">
                                    Aktuelles Passwort
                                </label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    className={inputBase}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) =>
                                        setPasswordForm((p) => ({
                                            ...p,
                                            currentPassword: e.target.value,
                                        }))
                                    }
                                    autoComplete="current-password"
                                    disabled={loading || passwordSaving}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={labelBase} htmlFor="newPassword">
                                    Neues Passwort
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    className={inputBase}
                                    value={passwordForm.newPassword}
                                    onChange={(e) =>
                                        setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                                    }
                                    autoComplete="new-password"
                                    disabled={loading || passwordSaving}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={labelBase} htmlFor="newPasswordConfirm">
                                    Neues Passwort bestätigen
                                </label>
                                <input
                                    id="newPasswordConfirm"
                                    type="password"
                                    className={inputBase}
                                    value={passwordForm.newPasswordConfirm}
                                    onChange={(e) =>
                                        setPasswordForm((p) => ({
                                            ...p,
                                            newPasswordConfirm: e.target.value,
                                        }))
                                    }
                                    autoComplete="new-password"
                                    disabled={loading || passwordSaving}
                                />
                                <p className={hintBase}>
                                    Mindestens 6 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Zahl
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="ui-focus inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-95 active:brightness-90 disabled:opacity-60"
                                disabled={!canSavePassword}
                            >
                                {passwordSaving ? "Wird gespeichert…" : "Änderungen speichern"}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </PageShell>
    );
};

export default ProfilePage;
