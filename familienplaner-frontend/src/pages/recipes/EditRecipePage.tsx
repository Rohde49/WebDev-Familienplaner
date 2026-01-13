import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "../../router/paths";
import { getRecipeById, updateRecipe } from "../../api/index.api";
import type { Recipe, RecipeTag, UpdateRecipeRequestDto } from "../../types/index.types";
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
    "ui-focus w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground shadow-sm " +
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

const EditRecipePage: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();

    const recipeId = Number(params.id);

    const [initialRecipe, setInitialRecipe] = useState<Recipe | null>(null);

    const [title, setTitle] = useState("");
    const [ingredientsText, setIngredientsText] = useState("");
    const [instruction, setInstruction] = useState("");
    const [selectedTags, setSelectedTags] = useState<RecipeTag[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const parsedIngredients = useMemo(() => {
        return ingredientsText
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }, [ingredientsText]);

    const titleCount = title.trim().length;
    const canSubmit = titleCount > 0 && !saving && !loading && !!initialRecipe;

    function toggleTag(tag: RecipeTag) {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }

    function hydrateForm(recipe: Recipe) {
        setTitle(recipe.title ?? "");
        setIngredientsText((recipe.ingredients ?? []).join("\n"));
        setInstruction(recipe.instruction ?? "");
        setSelectedTags((recipe.tags ?? []) as RecipeTag[]);
    }

    async function load() {
        setErrorMsg(null);

        if (!Number.isFinite(recipeId) || recipeId <= 0) {
            setErrorMsg("Ungültige Rezept-ID.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await getRecipeById(recipeId);
            setInitialRecipe(data);
            hydrateForm(data);
        } catch (err) {
            setInitialRecipe(null);
            setErrorMsg(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        if (!initialRecipe) return;

        const next: UpdateRecipeRequestDto = {
            title: title.trim(),
            ingredients: parsedIngredients,
            instruction,
            tags: selectedTags,
        };

        if (!next.title) {
            setErrorMsg("Bitte gib einen Titel an.");
            return;
        }

        setSaving(true);
        try {
            await updateRecipe(recipeId, next);
            navigate(ROUTES.recipes);
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PageShell title="Rezept bearbeiten" className="space-y-8">
            {/* Top row: back + helper */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Änderungen werden gespeichert, sobald du auf <span className="text-foreground">Speichern</span> klickst.
                </p>

                <Link
                    to={ROUTES.recipes}
                    className="ui-focus inline-flex items-center justify-center rounded-xl border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition hover:bg-accent"
                >
                    ← Zurück
                </Link>
            </div>

            {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

            {loading ? (
                <section className="ui-card p-6 sm:p-7">
                    <Alert variant="info">Lädt Rezept…</Alert>
                </section>
            ) : !initialRecipe ? (
                <section className="ui-card p-6 sm:p-7">
                    <Alert variant="info">Rezept nicht gefunden oder du hast keinen Zugriff.</Alert>
                </section>
            ) : (
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
                                className={inputBase}
                                maxLength={120}
                                required
                                disabled={saving}
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
                                className={`${inputBase} min-h-[140px] resize-y`}
                                placeholder={"z. B.\n200g Mehl\n2 Eier\n300ml Milch"}
                                disabled={saving}
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
                                className={`${inputBase} min-h-[160px] resize-y`}
                                maxLength={10000}
                                placeholder="Schritt für Schritt…"
                                disabled={saving}
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
                                            disabled={saving}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedTags.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Ausgewählt:{" "}
                                    <span className="text-foreground">{selectedTags.join(", ")}</span>
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
                                {saving ? "Speichern…" : "Speichern"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </PageShell>
    );
};

export default EditRecipePage;
