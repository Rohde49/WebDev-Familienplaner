import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { List, AlignLeft, Tag, ArrowLeft, Plus } from "lucide-react";

import { ROUTES } from "../../router/paths";
import { createRecipe } from "../../api/index.api";
import type { CreateRecipeRequestDto, RecipeTag } from "../../types/index.types";
import { getErrorMessage } from "../../util/index.util";

import { RecipeFormShell } from "../../components/layout/RecipeFormShell";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

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
 * AddRecipePage
 * ============================================================================
 */

const AddRecipePage: React.FC = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [ingredientsText, setIngredientsText] = useState("");
    const [instruction, setInstruction] = useState("");
    const [selectedTags, setSelectedTags] = useState<RecipeTag[]>([]);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const parsedIngredients = useMemo(
        () =>
            ingredientsText
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
        [ingredientsText]
    );

    const canSubmit = title.trim().length > 0 && !loading;

    function toggleTag(tag: RecipeTag) {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        if (!title.trim()) {
            setErrorMsg("Bitte gib einen Titel an.");
            return;
        }

        const payload: CreateRecipeRequestDto = {
            title: title.trim(),
            ingredients: parsedIngredients,
            instruction,
            tags: selectedTags,
        };

        try {
            setLoading(true);
            await createRecipe(payload);
            navigate(ROUTES.recipes);
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <RecipeFormShell
            title="Rezept erstellen"
            subtitle="Zutaten & Tags sind optional. Eine Zutat pro Zeile."
            actions={
                <>
                    <Button asChild variant="secondary">
                        <Link to={ROUTES.recipes}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Abbrechen
                        </Link>
                    </Button>

                    <Button type="submit" disabled={!canSubmit} form="add-recipe-form">
                        <Plus className="mr-2 h-4 w-4" />
                        {loading ? "Speichern…" : "Speichern"}
                    </Button>
                </>
            }
        >
            {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

            <form
                id="add-recipe-form"
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
                        placeholder="z. B. Pfannkuchen"
                        className={inputBase}
                        maxLength={120}
                        disabled={loading}
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
                        placeholder={"z. B.\n200g Mehl\n2 Eier\n300ml Milch"}
                        className={`${inputBase} min-h-[140px] resize-y`}
                        disabled={loading}
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
                        placeholder="Schritt für Schritt…"
                        className={`${inputBase} min-h-[160px] resize-y`}
                        maxLength={10000}
                        disabled={loading}
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
                                    className={[
                                        "ui-focus inline-flex items-center rounded-full border px-3 py-1 text-sm transition",
                                        active
                                            ? "border-primary/30 bg-primary text-primary-foreground shadow-sm"
                                            : "border-border bg-background hover:bg-accent",
                                    ].join(" ")}
                                    aria-pressed={active}
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
        </RecipeFormShell>
    );
};

export default AddRecipePage;
