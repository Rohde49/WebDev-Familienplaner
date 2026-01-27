import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, List, AlignLeft, Tag } from "lucide-react";

import { ROUTES } from "../../router/paths";
import { getRecipeById, updateRecipe } from "../../api/index.api";
import type { Recipe, RecipeTag, UpdateRecipeRequestDto } from "../../types/index.types";
import { getErrorMessage } from "../../util/index.util";

import { RecipeFormShell } from "../../components/layout/RecipeFormShell";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button.tsx";
import { Badge } from "../../components/ui/Badge.tsx";

/* ============================================================================
 * Constants
 * ============================================================================
 */

const TAG_OPTIONS: { value: RecipeTag; label: string }[] = [
    { value: "MEAL_PREP", label: "Meal-Prep" },
    { value: "FRUEHSTUECK", label: "Frühstück" },
    { value: "MITTAG", label: "Mittag" },
    { value: "NACHTISCH", label: "Nachtisch" },
    { value: "SCHNELL", label: "Schnell" },
    { value: "WEIHNACHTEN", label: "Weihnachten" },
];

const inputBase =
    "ui-focus w-full rounded-xl border bg-input px-3 py-2 text-sm text-foreground shadow-sm " +
    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60";

/* ============================================================================
 * EditRecipePage
 * ============================================================================
 */

const EditRecipePage: React.FC = () => {
    const { id } = useParams();
    const recipeId = Number(id);

    const navigate = useNavigate();

    const [recipe, setRecipe] = useState<Recipe | null>(null);

    const [title, setTitle] = useState("");
    const [ingredientsText, setIngredientsText] = useState("");
    const [instruction, setInstruction] = useState("");
    const [selectedTags, setSelectedTags] = useState<RecipeTag[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const parsedIngredients = useMemo(
        () =>
            ingredientsText
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
        [ingredientsText]
    );

    const canSubmit = title.trim().length > 0 && !saving && !!recipe;

    function toggleTag(tag: RecipeTag) {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    }

    async function loadRecipe() {
        setErrorMsg(null);

        if (!Number.isFinite(recipeId) || recipeId <= 0) {
            setErrorMsg("Ungültige Rezept-ID.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getRecipeById(recipeId);
            setRecipe(data);

            setTitle(data.title ?? "");
            setIngredientsText((data.ingredients ?? []).join("\n"));
            setInstruction(data.instruction ?? "");
            setSelectedTags((data.tags ?? []) as RecipeTag[]);
        } catch (err) {
            setRecipe(null);
            setErrorMsg(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        if (!recipe) return;

        if (!title.trim()) {
            setErrorMsg("Bitte gib einen Titel an.");
            return;
        }

        const payload: UpdateRecipeRequestDto = {
            title: title.trim(),
            ingredients: parsedIngredients,
            instruction,
            tags: selectedTags,
        };

        try {
            setSaving(true);
            await updateRecipe(recipeId, payload);
            navigate(ROUTES.recipes);
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        loadRecipe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <RecipeFormShell
            title="Rezept bearbeiten"
            subtitle="Änderungen werden erst gespeichert, wenn du auf Speichern klickst."
            actions={
                <>
                    <Button asChild variant="secondary">
                        <Link to={ROUTES.recipes}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Abbrechen
                        </Link>
                    </Button>

                    <Button
                        type="submit"
                        form="edit-recipe-form"
                        disabled={!canSubmit}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Speichern…" : "Speichern"}
                    </Button>
                </>
            }
        >
            {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

            {loading && <Alert variant="info">Lade Rezept…</Alert>}

            {!loading && !recipe && (
                <Alert variant="info">
                    Rezept nicht gefunden oder kein Zugriff.
                </Alert>
            )}

            {!loading && recipe && (
                <form
                    id="edit-recipe-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    noValidate
                >
                    {/* Titel */}
                    <section className="space-y-2">
                        <label className="text-sm font-semibold">
                            Titel <span className="text-destructive">*</span>
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={inputBase}
                            maxLength={120}
                            disabled={saving}
                            required
                        />
                    </section>

                    {/* Zutaten */}
                    <section className="space-y-2">
                        <div className="flex items-center gap-2">
                            <List className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold">Zutaten</h3>
                        </div>

                        <textarea
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                            className={`${inputBase} min-h-[140px] resize-y`}
                            disabled={saving}
                        />

                        {parsedIngredients.length > 0 && (
                            <div className="rounded-2xl border bg-muted p-4">
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

                    {/* Anleitung */}
                    <section className="space-y-2">
                        <div className="flex items-center gap-2">
                            <AlignLeft className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold">Anleitung</h3>
                        </div>

                        <textarea
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            className={`${inputBase} min-h-[160px] resize-y`}
                            maxLength={10000}
                            disabled={saving}
                        />
                    </section>

                    {/* Tags */}
                    <section className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold">Tags</h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {TAG_OPTIONS.map((opt) => {
                                const active = selectedTags.includes(opt.value);

                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => toggleTag(opt.value)}
                                        disabled={saving}
                                        className={[
                                            "ui-focus inline-flex items-center rounded-full border px-3 py-1 text-sm transition",
                                            active
                                                ? "border-primary/30 bg-primary text-primary-foreground shadow-sm"
                                                : "border-border bg-background hover:bg-accent",
                                        ].join(" ")}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {selectedTags.map((t) => (
                                    <Badge key={t} variant="outline">
                                        {t}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </section>
                </form>
            )}
        </RecipeFormShell>
    );
};

export default EditRecipePage;
