import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../router/paths";
import { createRecipe } from "../../api/index.api";
import type { CreateRecipeRequestDto, RecipeTag } from "../../types/index.types";
import { getErrorMessage } from "../../util/index.util";

import { PageShell } from "../../components/layout/PageShell";

const TAG_OPTIONS: { value: RecipeTag; label: string }[] = [
    { value: "MEAL_PREP", label: "Meal-Prep" },
    { value: "FRUEHSTUECK", label: "Frühstück" },
    { value: "MITTAG", label: "Mittag" },
    { value: "NACHTISCH", label: "Nachtisch" },
    { value: "SCHNELL", label: "Schnell" },
    { value: "WEIHNACHTEN", label: "Weihnachten" },
];

const inputBase =
    "ui-focus w-full rounded-xl border bg-card px-3 py-2 text-sm text-foreground shadow-sm " +
    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60";

const labelBase = "text-sm font-medium text-foreground";
const hintBase = "text-xs text-muted-foreground";

function Alert({
                   variant,
                   children,
               }: {
    variant: "error" | "info";
    children: React.ReactNode;
}) {
    const cls =
        variant === "error"
            ? "border-destructive/30 bg-destructive/10"
            : "border-border bg-muted";

    const icon = variant === "error" ? "⚠️" : "ℹ️";

    return (
        <div className={`rounded-2xl border p-4 text-sm text-foreground ${cls}`}>
            <div className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5">
                    {icon}
                </span>
                <div className="min-w-0">{children}</div>
            </div>
        </div>
    );
}

const AddRecipePage: React.FC = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [ingredientsText, setIngredientsText] = useState(""); // 1 Zutat pro Zeile
    const [instruction, setInstruction] = useState("");

    const [selectedTags, setSelectedTags] = useState<RecipeTag[]>([]);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const parsedIngredients = useMemo(() => {
        return ingredientsText
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }, [ingredientsText]);

    const titleCount = title.trim().length;
    const canSubmit = titleCount > 0 && !loading;

    function toggleTag(tag: RecipeTag) {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        const payload: CreateRecipeRequestDto = {
            title: title.trim(),
            ingredients: parsedIngredients,
            instruction,
            tags: selectedTags,
        };

        if (!payload.title) {
            setErrorMsg("Bitte gib einen Titel an.");
            return;
        }

        setLoading(true);
        try {
            await createRecipe(payload);
            navigate(ROUTES.recipes);
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageShell title="Rezept erstellen" className="space-y-8">
            {/* Top row: back + helper text */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Zutaten & Tags sind optional. Pro Zeile eine Zutat.
                </p>

                <Link
                    to={ROUTES.recipes}
                    className="ui-focus inline-flex items-center justify-center rounded-xl border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition hover:bg-accent"
                >
                    ← Zurück
                </Link>
            </div>

            {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

            <form onSubmit={handleSubmit} className="ui-card p-6 sm:p-7">
                <div className="space-y-7">
                    {/* Title */}
                    <section className="space-y-3">
                        <div className="flex items-end justify-between gap-4">
                            <div className="space-y-1">
                                <label className={labelBase} htmlFor="title">
                                    Titel <span className="text-destructive">*</span>
                                </label>
                                <p className={hintBase}>Kurz und eindeutig, z. B. “Pfannkuchen”.</p>
                            </div>

                            <span className="text-xs text-muted-foreground">{titleCount}/120</span>
                        </div>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="z. B. Gulasch"
                            className={inputBase}
                            maxLength={120}
                            required
                            disabled={loading}
                        />
                    </section>

                    {/* Ingredients */}
                    <section className="space-y-3">
                        <div className="flex items-end justify-between gap-4">
                            <div className="space-y-1">
                                <label className={labelBase} htmlFor="ingredients">
                                    Zutaten (optional)
                                </label>
                                <p className={hintBase}>Eine Zutat pro Zeile.</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {parsedIngredients.length} erkannt
                            </span>
                        </div>

                        <textarea
                            id="ingredients"
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                            placeholder={"z. B.\n200g Mehl\n2 Eier\n300ml Milch"}
                            className={`${inputBase} min-h-[140px] resize-y`}
                            disabled={loading}
                        />

                        {parsedIngredients.length > 0 && (
                            <div className="rounded-2xl border bg-muted p-4">
                                <div className="mb-2 text-xs font-medium text-foreground">Vorschau</div>
                                <ul className="list-inside list-disc text-sm text-muted-foreground">
                                    {parsedIngredients.slice(0, 6).map((ing, idx) => (
                                        <li key={`${ing}-${idx}`}>{ing}</li>
                                    ))}
                                    {parsedIngredients.length > 6 && (
                                        <li className="text-muted-foreground">
                                            +{parsedIngredients.length - 6} weitere…
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </section>

                    {/* Instruction */}
                    <section className="space-y-3">
                        <div className="flex items-end justify-between gap-4">
                            <div className="space-y-1">
                                <label className={labelBase} htmlFor="instruction">
                                    Anleitung (optional)
                                </label>
                                <p className={hintBase}>Schritt für Schritt – kurz und klar.</p>
                            </div>

                            <span className="text-xs text-muted-foreground">
                                {instruction.length}/10000
                            </span>
                        </div>

                        <textarea
                            id="instruction"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder="Schritt für Schritt…"
                            className={`${inputBase} min-h-[160px] resize-y`}
                            maxLength={10000}
                            disabled={loading}
                        />
                    </section>

                    {/* Tags */}
                    <section className="space-y-3">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">Tags (optional)</p>
                            <p className={hintBase}>Hilft beim Filtern und schnellen Wiederfinden.</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {TAG_OPTIONS.map((opt) => {
                                const active = selectedTags.includes(opt.value);

                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => toggleTag(opt.value)}
                                        className={[
                                            "ui-focus inline-flex items-center rounded-full border px-3 py-1 text-sm transition",
                                            active
                                                ? "border-primary/30 bg-primary text-primary-foreground shadow-sm"
                                                : "border-border bg-background text-foreground hover:bg-accent",
                                        ].join(" ")}
                                        aria-pressed={active}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedTags.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                Ausgewählt: <span className="text-foreground">{selectedTags.join(", ")}</span>
                            </p>
                        )}
                    </section>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Link
                            to={ROUTES.recipes}
                            className="ui-focus inline-flex items-center justify-center rounded-xl border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition hover:bg-accent"
                        >
                            Abbrechen
                        </Link>

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="ui-focus inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-95 active:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Speichern…" : "Speichern"}
                        </button>
                    </div>
                </div>
            </form>
        </PageShell>
    );
};

export default AddRecipePage;
