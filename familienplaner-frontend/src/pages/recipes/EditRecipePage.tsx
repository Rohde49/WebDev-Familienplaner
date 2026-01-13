import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "../../router/paths";
import { getRecipeById, updateRecipe } from "../../api/index.api";
import type { Recipe, RecipeTag, UpdateRecipeRequestDto } from "../../types/index.types";

import { getErrorMessage } from "../../util/index.util";

const TAG_OPTIONS: { value: RecipeTag; label: string }[] = [
    { value: "MEAL_PREP", label: "Meal-Prep" },
    { value: "FRUEHSTUECK", label: "Frühstück" },
    { value: "MITTAG", label: "Mittag" },
    { value: "NACHTISCH", label: "Nachtisch" },
    { value: "SCHNELL", label: "Schnell" },
    { value: "WEIHNACHTEN", label: "Weihnachten" },
];

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

    function toggleTag(tag: RecipeTag) {
        setSelectedTags((prev) => {
            if (prev.includes(tag)) return prev.filter((t) => t !== tag);
            return [...prev, tag];
        });
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
            instruction: instruction,
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
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Rezept bearbeiten</h1>
                    <p className="text-sm text-slate-600">Änderungen werden per PATCH gespeichert.</p>
                </div>

                <Link
                    to={ROUTES.recipes}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
                >
                    Zurück
                </Link>
            </div>

            {errorMsg && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMsg}
                </div>
            )}

            {loading ? (
                <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-700">
                    Lädt Rezept…
                </div>
            ) : !initialRecipe ? (
                <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-700">
                    Rezept nicht gefunden oder du hast keinen Zugriff.
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    {/* Title */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Titel <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                            maxLength={120}
                            required
                        />
                        <div className="mt-1 text-xs text-slate-500">{title.trim().length}/120</div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Zutaten (optional)
                        </label>
                        <textarea
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                            className="min-h-[140px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                            placeholder={"z. B.\n200g Mehl\n2 Eier\n300ml Milch"}
                        />
                        <div className="mt-2 text-xs text-slate-500">
                            {parsedIngredients.length} Zutat(en) erkannt
                        </div>
                    </div>

                    {/* Instruction */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Anleitung (optional)
                        </label>
                        <textarea
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            className="min-h-[160px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                            maxLength={10000}
                            placeholder="Schritt für Schritt…"
                        />
                        <div className="mt-1 text-xs text-slate-500">{instruction.length}/10000</div>
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Tags (optional)
                        </label>

                        <div className="flex flex-wrap gap-2">
                            {TAG_OPTIONS.map((opt) => {
                                const active = selectedTags.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => toggleTag(opt.value)}
                                        className={[
                                            "rounded-full px-3 py-1 text-sm border",
                                            active
                                                ? "border-slate-900 bg-slate-900 text-white"
                                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedTags.length > 0 && (
                            <div className="mt-2 text-xs text-slate-600">
                                Ausgewählt: {selectedTags.join(", ")}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            to={ROUTES.recipes}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                        >
                            Abbrechen
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Speichern…" : "Speichern"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditRecipePage;
