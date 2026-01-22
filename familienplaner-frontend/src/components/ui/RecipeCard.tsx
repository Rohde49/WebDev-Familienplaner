import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import type { Recipe } from "../../types/index.types";
import { formatRecipeTag } from "../../util/index.util";
import { ROUTES } from "../../router/paths";

import { Card, CardHeader, CardContent, CardFooter } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";

/* ============================================================================
 * Types
 * ============================================================================
 */

type RecipeCardProps = {
    recipe: Recipe;
    canEdit: boolean;
    onDelete: (id: number, title: string) => void;
    onOpen: (id: number) => void;
};

/* ============================================================================
 * Helpers
 * ============================================================================
 */

function formatDateTime(value?: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("de-DE", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(d);
}

/* ============================================================================
 * Component
 * ============================================================================
 */

export const RecipeCard: React.FC<RecipeCardProps> = ({
                                                          recipe,
                                                          canEdit,
                                                          onDelete,
                                                          onOpen,
                                                      }) => {
    return (
        <Card
            onClick={() => onOpen(recipe.id)}
            className="
                group cursor-pointer rounded-2xl
                transition-all
                hover:shadow-md
                hover:ring-1 hover:ring-primary/30
            "
        >
            {/* Header */}
            <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold line-clamp-2">
                        {recipe.title}
                    </h3>

                    {recipe.owner && (
                        <Badge variant="secondary">{recipe.owner}</Badge>
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    Aktualisiert: {formatDateTime(recipe.updatedAt)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {(recipe.tags ?? []).slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline">
                            {formatRecipeTag(t)}
                        </Badge>
                    ))}

                    {(recipe.tags?.length ?? 0) > 2 && (
                        <Badge variant="outline">
                            +{(recipe.tags?.length ?? 0) - 2}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="text-sm text-muted-foreground line-clamp-3">
                {recipe.instruction || "Keine Anleitung hinterlegt."}
            </CardContent>

            {/* Actions */}
            <CardFooter
                className="
                    flex justify-end gap-2
                    opacity-100 sm:opacity-0
                    sm:group-hover:opacity-100
                    transition-opacity
                "
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    disabled={!canEdit}
                >
                    <Link to={ROUTES.recipeEdit(recipe.id)}>
                        <Pencil className="mr-1 h-4 w-4" />
                        Bearbeiten
                    </Link>
                </Button>

                <Button
                    size="sm"
                    variant="destructive"
                    disabled={!canEdit}
                    onClick={() => onDelete(recipe.id, recipe.title)}
                >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Löschen
                </Button>
            </CardFooter>
        </Card>
    );
};
