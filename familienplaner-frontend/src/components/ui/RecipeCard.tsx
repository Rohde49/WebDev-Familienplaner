import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import type { Recipe } from "@/types/index.types";
import { formatRecipeTag } from "@/util/index.util";
import { ROUTES } from "@/router/paths";

import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

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
            role="button"
            tabIndex={0}
            onClick={() => onOpen(recipe.id)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(recipe.id);
                }
            }}
            className="
                group cursor-pointer
                rounded-2xl
                bg-background
                border border-border
                transition-all
                hover:-translate-y-0.5
                hover:shadow-lg
                hover:border-primary/30
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary/40
            "
        >
            {/* Header */}
            <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h3
                        className="
                            line-clamp-2
                            text-lg font-semibold
                            text-foreground
                            transition-colors
                            group-hover:text-primary
                        "
                    >
                        {recipe.title}
                    </h3>

                    {recipe.owner && (
                        <Badge variant="secondary">
                            {recipe.owner}
                        </Badge>
                    )}
                </div>

                <p className="text-xs text-muted-foreground/90">
                    Aktualisiert: {formatDateTime(recipe.updatedAt)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {(recipe.tags ?? []).slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline">
                            {formatRecipeTag(tag)}
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
                onClick={(e) => e.stopPropagation()}
                className="
                    mt-2
                    flex justify-end gap-2
                    border-t border-border/50
                    pt-3
                    opacity-100 sm:opacity-0
                    sm:group-hover:opacity-100
                    transition-opacity
                "
            >
                {/* Edit – primäre Aktion */}
                <Button
                    asChild
                    size="sm"
                    variant="primary"
                    disabled={!canEdit}
                    className="shadow-sm hover:shadow"
                >
                    <Link to={ROUTES.recipeEdit(recipe.id)}>
                        <Pencil className="mr-1 h-4 w-4" />
                        Bearbeiten
                    </Link>
                </Button>

                {/* Delete – Warnaktion */}
                <Button
                    size="sm"
                    variant="destructive"
                    disabled={!canEdit}
                    className="shadow-sm hover:shadow-md"
                    onClick={() =>
                        onDelete(recipe.id, recipe.title)
                    }
                >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Löschen
                </Button>
            </CardFooter>
        </Card>
    );
};
