/*
 * ============================================================================
 * RecipesPage – Rezepte (UX polished, token-first)
 * ============================================================================
 */

import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ROUTES } from "../../router/paths";
import { useAuth } from "../../context/AuthContext";

import type { Recipe } from "../../types/index.types";
import { getAllRecipes, deleteRecipe } from "../../api/index.api";
import { getErrorMessage, formatRecipeTag, isAdmin, uiToast } from "../../util/index.util";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Skeleton } from "../../components/ui/skeleton";

import { ChefHat, Plus, Pencil, Trash2, RefreshCcw } from "lucide-react";
import { PageShell } from "../../components/layout/PageShell";

const RECIPES_QUERY_KEY = ["recipes"] as const;

type DeleteTarget = { id: number; title: string } | null;

function formatDateTime(value?: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("de-DE", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(d);
}

const RecipesPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const navigate = useNavigate();

    const username = user?.username ?? null;
    const admin = user ? isAdmin(user) : false;

    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

    // 1) Query: Liste laden
    const recipesQuery = useQuery({
        queryKey: RECIPES_QUERY_KEY,
        queryFn: async () => (await getAllRecipes()) as Recipe[],
    });

    // 2) Mutation: löschen
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await deleteRecipe(id);
        },
        onSuccess: async () => {
            uiToast.success("Rezept gelöscht.");
            setDeleteTarget(null);
            await queryClient.invalidateQueries({ queryKey: RECIPES_QUERY_KEY });
        },
        onError: (err) => {
            uiToast.error(getErrorMessage(err));
        },
    });

    const sortedRecipes = useMemo(() => {
        const list = recipesQuery.data ?? [];
        return [...list].sort((a, b) => {
            const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return bTime - aTime;
        });
    }, [recipesQuery.data]);

    const canEditOrDelete = (r: Recipe) => {
        const isOwner = username && r.owner === username;
        return Boolean(admin || isOwner);
    };

    const openDeleteDialog = (id: number, title: string) => setDeleteTarget({ id, title });

    return (
        <PageShell className="space-y-8">
            {/* Header */}
            <Card className="rounded-2xl border bg-card shadow-sm">
                <CardHeader className="space-y-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span
                                    className="grid h-9 w-9 place-items-center rounded-2xl border bg-muted"
                                    aria-hidden
                                >
                                    <ChefHat className="h-5 w-5" />
                                </span>
                                <h1 className="text-2xl font-semibold tracking-tight">Rezepte</h1>
                            </div>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Deine Sammlung an Rezepten – übersichtlich, schnell bearbeitbar und später erweiterbar.
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Bearbeiten/Löschen ist nur für{" "}
                                <span className="font-medium text-foreground">Owner</span> oder{" "}
                                <span className="font-medium text-foreground">Admin</span> möglich.
                            </p>
                        </div>

                        <Button asChild className="shrink-0">
                            <Link to={ROUTES.addRecipe}>
                                <Plus className="mr-2 h-4 w-4" />
                                Neues Rezept
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Error State */}
            {recipesQuery.isError && (
                <Card className="rounded-2xl border-destructive/30 bg-card">
                    <CardHeader>
                        <CardTitle className="text-base">Fehler beim Laden</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {getErrorMessage(recipesQuery.error)}
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="secondary"
                            onClick={() => recipesQuery.refetch()}
                            disabled={recipesQuery.isFetching}
                        >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Erneut versuchen
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Loading State → Skeleton Grid */}
            {recipesQuery.isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="rounded-2xl">
                            <CardHeader className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-3.5 w-1/2" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-12 rounded-full" />
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </div>

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-between gap-2">
                                <Skeleton className="h-8 w-28 rounded-md" />
                                <Skeleton className="h-8 w-24 rounded-md" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : sortedRecipes.length === 0 && !recipesQuery.isError ? (
                /* Empty State */
                <Card className="rounded-2xl">
                    <CardContent className="flex min-h-[calc(100vh-260px)] flex-col items-center justify-center py-16 text-center">
                        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border bg-muted shadow-sm">
                            <ChefHat className="h-6 w-6" />
                        </div>

                        <h2 className="text-lg font-semibold">Noch keine Rezepte</h2>
                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            Erstelle dein erstes Rezept – danach erscheint es hier als übersichtliche Card.
                        </p>

                        <div className="mt-6 flex items-center gap-2">
                            <Button asChild>
                                <Link to={ROUTES.addRecipe}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Rezept erstellen
                                </Link>
                            </Button>

                            <Button variant="secondary" onClick={() => recipesQuery.refetch()}>
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Aktualisieren
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                /* Cards Grid */
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedRecipes.map((r) => {
                        const allowed = canEditOrDelete(r);
                        const ingredients = r.ingredients ?? [];

                        return (
                            <Card
                                key={r.id}
                                onClick={() => navigate(ROUTES.recipeDetail(r.id))}
                                className="
                                    group cursor-pointer rounded-2xl
                                    transition-all
                                    hover:shadow-md hover:ring-1 hover:ring-ring
                                    focus-within:ring-2 focus-within:ring-ring
                                "
                            >
                                {/* Header */}
                                <CardHeader className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 text-lg">
                                            {r.title}
                                        </CardTitle>

                                        {r.owner && (
                                            <Badge variant="secondary" className="shrink-0">
                                                {r.owner}
                                            </Badge>
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Aktualisiert: {formatDateTime(r.updatedAt)}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {(r.tags ?? []).slice(0, 4).map((t) => (
                                            <Badge key={t} variant="outline">
                                                {formatRecipeTag(t)}
                                            </Badge>
                                        ))}
                                        {(r.tags?.length ?? 0) > 4 && (
                                            <Badge variant="outline">
                                                +{(r.tags?.length ?? 0) - 4}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                {/* Content */}
                                <CardContent className="space-y-3 text-sm">
                                    {/* Zutaten */}
                                    {ingredients.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {ingredients.slice(0, 3).map((i) => (
                                                <Badge key={i} variant="secondary">
                                                    {i}
                                                </Badge>
                                            ))}
                                            {ingredients.length > 3 && (
                                                <Badge variant="secondary">
                                                    +{ingredients.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            Keine Zutaten hinterlegt
                                        </p>
                                    )}

                                    {/* Anleitung */}
                                    {r.instruction && (
                                        <p className="line-clamp-3 text-muted-foreground leading-relaxed">
                                            {r.instruction}
                                        </p>
                                    )}
                                </CardContent>

                                {/* Actions */}
                                <CardFooter
                                    className="
                                        flex justify-between gap-2
                                        sm:opacity-0 sm:group-hover:opacity-100
                                        transition-opacity
                                      "
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Button
                                        asChild
                                        variant="secondary"
                                        size="sm"
                                        disabled={!allowed}
                                    >
                                        <Link to={ROUTES.recipeEdit(r.id)}>
                                            <Pencil className="mr-1 h-4 w-4" />
                                            Bearbeiten
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={!allowed}
                                        onClick={() => openDeleteDialog(r.id, r.title)}
                                    >
                                        <Trash2 className="mr-1 h-4 w-4" />
                                        Löschen
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirm Dialog */}
            <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Rezept löschen?</DialogTitle>
                        <DialogDescription>
                            {deleteTarget ? (
                                <>
                                    Willst du <span className="font-medium">„{deleteTarget.title}“</span> wirklich
                                    löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                </>
                            ) : null}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleteMutation.isPending}
                        >
                            Abbrechen
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                            disabled={!deleteTarget || deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Löschen…" : "Löschen"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageShell>
    );
};

export default RecipesPage;
