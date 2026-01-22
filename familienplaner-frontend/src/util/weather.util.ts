export type WeatherData = {
    temperature: number;
    description: string;
    icon: string;
};

//const CITY = "Forst,DE";
const ZIP = "03149,DE";

export async function getTodayWeather(): Promise<WeatherData> {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    if (!apiKey) {
        throw new Error("OpenWeather API Key fehlt");
    }

    const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?zip=${ZIP}` +
        `&units=metric` +
        `&lang=de` +
        `&appid=${apiKey}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Wetterdaten konnten nicht geladen werden");
    }

    const data = await res.json();

    return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
    };
}
