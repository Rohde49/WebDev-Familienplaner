import React, { useEffect, useMemo, useState } from "react";
import { CloudSun, MapPin, CalendarClock } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getDisplayName } from "../util/index.util";
import { getTodayWeather, type WeatherData } from "../util/weather.util";

import { HomeCardShell } from "../components/layout/HomeCardShell";

/* ============================================================================
 * HomePage
 * ============================================================================
 */

const HomePage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const displayName = useMemo(() => getDisplayName(user), [user]);

    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [weatherError, setWeatherError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const data = await getTodayWeather();
                if (!alive) return;
                setWeather(data);
            } catch {
                if (!alive) return;
                setWeatherError("Wetterdaten nicht verfügbar");
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const headline = isAuthenticated
        ? `Hallo, ${displayName} 👋`
        : "Willkommen im Familienplaner";

    const subline = isAuthenticated
        ? "Schön, dass du da bist. Hier ein ruhiger Überblick für heute."
        : "Ein ruhiger Ort, um den Familienalltag entspannt zu organisieren.";

    return (
        <HomeCardShell>
            <div className="space-y-8">
                {/* Header */}
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {headline}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {subline}
                    </p>
                </header>

                <hr className="border-border" />

                {/* Weather */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CloudSun className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold tracking-tight">
                            Wetter heute
                        </h2>
                    </div>

                    <div className="rounded-2xl border bg-muted p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>Forst (Lausitz)</span>
                                </div>

                                {weather ? (
                                    <p className="text-sm text-muted-foreground capitalize">
                                        {weather.description}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {weatherError ?? "Wetter wird geladen…"}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {weather && (
                                    <img
                                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                        alt={weather.description}
                                        className="h-10 w-10"
                                    />
                                )}

                                <p className="text-2xl font-semibold text-foreground">
                                    {weather ? `${weather.temperature}°C` : "--°C"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-border" />

                {/* Outlook */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold tracking-tight">
                            Ausblick
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-2xl border bg-muted p-4 text-sm">
                            <p className="font-medium">Finanzen</p>
                            <p className="mt-1 text-muted-foreground">
                                Einnahmen & regelmäßige Ausgaben im Blick behalten.
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-muted p-4 text-sm">
                            <p className="font-medium">Aufgaben & Planung</p>
                            <p className="mt-1 text-muted-foreground">
                                Gemeinsame To-Dos für den Familienalltag.
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-muted p-4 text-sm">
                            <p className="font-medium">Familienübersicht</p>
                            <p className="mt-1 text-muted-foreground">
                                Alles Wichtige an einem Ort – Schritt für Schritt.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </HomeCardShell>
    );
};

export default HomePage;
