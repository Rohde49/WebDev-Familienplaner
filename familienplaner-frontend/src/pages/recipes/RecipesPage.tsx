/*
 * ============================================================================
 * RecipesPage – Rezeptübersicht (RecipeBookShell, 2x4 Grid, UX polished)
 * ============================================================================
 */

import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChefHat, Plus, RefreshCcw, Search, ChevronLeft, ChevronRight } from "lucide-react";

import { ROUTES } from "@/router/paths";
import { useAuth } from "@/context/AuthContext";

import type { Recipe } from "@/types/index.types";
import { getAllRecipes, deleteRecipe } from "@/api/index.api";
import { getErrorMessage, isAdmin, uiToast } from "@/util/index.util";

import { RecipeBookShell } from "@/components/layout/RecipeBookShell";
import { RecipeCard } from "@/components/ui/RecipeCard";

import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Skeleton } from "../../components/ui/skeleton";

/* ============================================================================
 * Helpers
 * ============================================================================
 */

const RECIPES_QUERY_KEY = ["recipes"] as const;
const PAGE_SIZE = 8; // 2 x 4

type DeleteTarget = { id: number; title: string } | null;

/* ============================================================================
 * RecipesPage
 * ============================================================================
 */

const RecipesPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const username = user?.username ?? null;
    const admin = user ? isAdmin(user) : false;

    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

    /* -------------------------
     * Data
     * ------------------------- */

    const recipesQuery = useQuery({
        queryKey: RECIPES_QUERY_KEY,
        queryFn: async () => (await getAllRecipes()) as Recipe[],
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await deleteRecipe(id);
        },
        onSuccess: async () => {
            uiToast.success("Rezept gelöscht.");
            setDeleteTarget(null);
            await queryClient.invalidateQueries({ queryKey: RECIPES_QUERY_KEY });
        },
        onError: (err) => uiToast.error(getErrorMessage(err)),
    });

    const sortedRecipes = useMemo(() => {
        const list = recipesQuery.data ?? [];
        return [...list].sort((a, b) => {
            const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return bTime - aTime;
        });
    }, [recipesQuery.data]);

    const visibleRecipes = sortedRecipes.slice(0, PAGE_SIZE);

    const canEditOrDelete = (r: Recipe) => {
        const isOwner = username && r.owner === username;
        return Boolean(admin || isOwner);
    };

    /* ============================================================================
     * Render
     * ============================================================================
     */

    return (
        <RecipeBookShell
            title="Rezepte"
            description="Deine persönliche Rezeptsammlung – ruhig, übersichtlich und jederzeit erweiterbar."
            actions={
                <>
                    {/* Search (Placeholder) */}
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Rezepte durchsuchen …"
                            disabled
                            className="
                                w-full rounded-xl border
                                bg-secondary/60
                                pl-9 pr-3 py-2 text-sm
                                text-muted-foreground
                                cursor-not-allowed
                            "
                        />
                    </div>

                    {/* Add */}
                    <Button asChild className="shrink-0">
                        <Link to={ROUTES.addRecipe}>
                            <Plus className="mr-2 h-4 w-4" />
                            Neues Rezept
                        </Link>
                    </Button>
                </>
            }
        >
            {/* Error */}
            {recipesQuery.isError && (
                <Card className="rounded-2xl border-destructive/30">
                    <CardHeader>
                        <h3 className="font-semibold">Fehler beim Laden</h3>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {getErrorMessage(recipesQuery.error)}
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="secondary"
                            onClick={() => recipesQuery.refetch()}
                        >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Erneut versuchen
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Loading */}
            {recipesQuery.isLoading && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <Card key={i} className="rounded-2xl">
                            <CardHeader className="space-y-3">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-3 w-1/3" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="mt-2 h-4 w-5/6" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!recipesQuery.isLoading &&
                !recipesQuery.isError &&
                sortedRecipes.length === 0 && (
                    <Card className="rounded-2xl">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border bg-muted">
                                <ChefHat className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Noch keine Rezepte</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Erstelle dein erstes Rezept, um loszulegen.
                            </p>
                            <Button asChild className="mt-6">
                                <Link to={ROUTES.addRecipe}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Rezept erstellen
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

            {/* Grid */}
            {!recipesQuery.isLoading && visibleRecipes.length > 0 && (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {visibleRecipes.map((r) => (
                            <RecipeCard
                                key={r.id}
                                recipe={r}
                                canEdit={canEditOrDelete(r)}
                                onOpen={(id) => navigate(ROUTES.recipeDetail(id))}
                                onDelete={(id, title) =>
                                    setDeleteTarget({ id, title })
                                }
                            />
                        ))}
                    </div>

                    {/* Pagination (Placeholder) */}
                    <footer className="flex items-center justify-center gap-4 pt-8">
                        <Button variant="secondary" size="sm" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Seite 1 von 1
                        </span>
                        <Button variant="secondary" size="sm" disabled>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </footer>
                </>
            )}

            {/* Delete Dialog */}
            <Dialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Rezept löschen?</DialogTitle>
                        <DialogDescription>
                            {deleteTarget && (
                                <>
                                    Willst du{" "}
                                    <span className="font-medium">
                                        „{deleteTarget.title}“
                                    </span>{" "}
                                    wirklich löschen? Diese Aktion kann nicht
                                    rückgängig gemacht werden.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteTarget(null)}
                        >
                            Abbrechen
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() =>
                                deleteTarget &&
                                deleteMutation.mutate(deleteTarget.id)
                            }
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending
                                ? "Löschen…"
                                : "Löschen"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </RecipeBookShell>
    );
};

export default RecipesPage;
