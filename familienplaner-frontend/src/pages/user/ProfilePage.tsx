/*
 * ============================================================================
 * ProfilePage – Profilverwaltung (Persönliche Daten + Passwort ändern)
 * ============================================================================
 *
 * Funktionen:
 * - lädt User über GET /users/me
 * - speichert Profil über PATCH /users/me/profile
 * - ändert Passwort über PATCH /users/me/password
 *
 * UX:
 * - Frontend validiert für bessere Nutzerführung (Backend bleibt Source of Truth)
 * - Nach erfolgreichem Speichern wird der User refetched und die Page neu gerendert
 * - AuthContext wird via login({ token, user }) synchron gehalten, damit NavBar etc. sofort aktualisieren
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

    /**
     * Lädt den aktuellen User neu und hält AuthContext synchron.
     * Dadurch aktualisieren sich NavBar/DisplayName sofort nach Profil-Änderungen.
     */
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

    /**
     * Initialer Load: GET /users/me
     */
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

    /**
     * Speichert persönliche Daten:
     * - validiert Alter (0–150) zentral in util
     * - baut UpdateUserProfileRequest zentral in util
     * - refetch danach für "neu rendern mit gespeicherten Daten"
     */
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

    /**
     * Ändert Passwort:
     * - nutzt zentralen Wrapper validatePasswordChange()
     * - Backend bleibt Source of Truth, aber UX wird besser
     */
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
        <div className="section-hero fade-in-up">
            <div className="container-narrow">
                <header className="page-header">
                    <h1 className="h2">Mein Profil</h1>
                    <p className="lead">Verwalte deine persönlichen Daten und dein Passwort.</p>
                </header>

                <div className="card">
                    {/* Initial Load Error (wie LoginPage: oben in der Card) */}
                    {errorMsg && <div className="alert-error mb-4">{errorMsg}</div>}

                    {!initialLoadDone && <p className="text-body text-muted">Lade Profil…</p>}

                    {initialLoadDone && user && (
                        <div className="page-stack">
                            {/* Username & Role Info Box */}
                            <div className="card-soft">
                                <div className="card-body">
                                    <p className="text-body">
                                        <strong>Benutzername:</strong> {username}
                                    </p>
                                    <p className="text-body">
                                        <strong>Rolle:</strong> {role}
                                    </p>
                                </div>
                            </div>

                            {/* Persönliche Daten */}
                            <div className="page-stack">
                                <h2 className="h3">Persönliche Daten</h2>

                                {profileError && <div className="alert-error mb-4">{profileError}</div>}
                                {profileSuccess && <div className="alert-success mb-4">{profileSuccess}</div>}

                                <form onSubmit={handleSaveProfile} className="page-stack" noValidate>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="firstName">
                                            Vorname
                                        </label>
                                        <input
                                            id="firstName"
                                            className="input"
                                            value={profileForm.firstName}
                                            onChange={(e) =>
                                                setProfileForm((p) => ({ ...p, firstName: e.target.value }))
                                            }
                                            autoComplete="given-name"
                                            disabled={loading || profileSaving}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="lastName">
                                            Nachname
                                        </label>
                                        <input
                                            id="lastName"
                                            className="input"
                                            value={profileForm.lastName}
                                            onChange={(e) =>
                                                setProfileForm((p) => ({ ...p, lastName: e.target.value }))
                                            }
                                            autoComplete="family-name"
                                            disabled={loading || profileSaving}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email">
                                            E-Mail
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="input"
                                            value={profileForm.email}
                                            onChange={(e) =>
                                                setProfileForm((p) => ({ ...p, email: e.target.value }))
                                            }
                                            autoComplete="email"
                                            disabled={loading || profileSaving}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="age">
                                            Alter
                                        </label>
                                        <input
                                            id="age"
                                            type="number"
                                            className="input"
                                            inputMode="numeric"
                                            min={0}
                                            max={150}
                                            value={profileForm.age}
                                            onChange={(e) =>
                                                setProfileForm((p) => ({ ...p, age: e.target.value }))
                                            }
                                            disabled={loading || profileSaving}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-md btn-block"
                                        disabled={!canSaveProfile}
                                    >
                                        {profileSaving ? "Wird gespeichert..." : "Profil speichern"}
                                    </button>
                                </form>
                            </div>

                            {/* Passwort ändern */}
                            <div className="page-stack">
                                <h2 className="h3">Passwort ändern</h2>

                                {passwordError && <div className="alert-error mb-4">{passwordError}</div>}
                                {passwordSuccess && <div className="alert-success mb-4">{passwordSuccess}</div>}

                                <form onSubmit={handleChangePassword} className="page-stack" noValidate>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="currentPassword">
                                            Aktuelles Passwort
                                        </label>
                                        <input
                                            id="currentPassword"
                                            type="password"
                                            className="input"
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

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="newPassword">
                                            Neues Passwort
                                        </label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            className="input"
                                            value={passwordForm.newPassword}
                                            onChange={(e) =>
                                                setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                                            }
                                            autoComplete="new-password"
                                            disabled={loading || passwordSaving}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="newPasswordConfirm">
                                            Neues Passwort bestätigen
                                        </label>
                                        <input
                                            id="newPasswordConfirm"
                                            type="password"
                                            className="input"
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
                                        <p className="form-hint">
                                            Mindestens 6 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Zahl
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-md btn-block"
                                        disabled={!canSavePassword}
                                    >
                                        {passwordSaving ? "Wird gespeichert..." : "Änderungen speichern"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
