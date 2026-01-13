import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ROUTES } from "../../router/paths";
import { useAuth } from "../../context/AuthContext";

import type { Recipe } from "../../types/index.types";
import { deleteRecipe, getRecipeById } from "../../api/index.api";
import { formatRecipeTag, getErrorMessage, isAdmin, uiToast } from "../../util/index.util";

import { PageShell } from "../../components/layout/PageShell";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";

import { ArrowLeft, Pencil, Trash2, RefreshCcw, ChefHat } from "lucide-react";

const RECIPES_QUERY_KEY = ["recipes"] as const;

function formatDateTime(value?: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

const DetailRecipePage: React.FC = () => {
    const { id } = useParams();
    const recipeId = Number(id);

    const { user } = useAuth();
    const admin = user ? isAdmin(user) : false;
    const username = user?.username ?? null;

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [confirmDelete, setConfirmDelete] = useState(false);

    const recipeQuery = useQuery({
        queryKey: ["recipe", recipeId],
        queryFn: async () => (await getRecipeById(recipeId)) as Recipe,
        enabled: Number.isFinite(recipeId) && recipeId > 0,
    });

    const recipe = recipeQuery.data ?? null;

    const canEditOrDelete = useMemo(() => {
        if (!recipe) return false;
        const isOwner = username && recipe.owner === username;
        return Boolean(admin || isOwner);
    }, [admin, recipe, username]);

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!recipe) return;
            await deleteRecipe(recipe.id);
        },
        onSuccess: async () => {
            uiToast.success("Rezept gelöscht.");
            setConfirmDelete(false);
            await queryClient.invalidateQueries({ queryKey: RECIPES_QUERY_KEY });
            navigate(ROUTES.recipes, { replace: true });
        },
        onError: (err) => uiToast.error(getErrorMessage(err)),
    });

    // Invalid ID
    if (!Number.isFinite(recipeId) || recipeId <= 0) {
        return (
            <PageShell title="Rezept" className="space-y-6">
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base">Ungültige Rezept-ID</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Bitte öffne ein Rezept aus der Rezeptliste.
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="secondary">
                            <Link to={ROUTES.recipes}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Zurück zu Rezepten
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </PageShell>
        );
    }

    return (
        <PageShell className="space-y-8">
            {/* Top bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Details ansehen. Bearbeiten/Löschen ist nur für{" "}
                    <span className="text-foreground">Owner</span> oder{" "}
                    <span className="text-foreground">Admin</span> möglich.
                </p>

                <Link
                    to={ROUTES.recipes}
                    className="ui-focus inline-flex items-center justify-center rounded-xl border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition hover:bg-accent"
                >
                    ← Zurück
                </Link>
            </div>

            {/* Loading */}
            {recipeQuery.isLoading && (
                <Card className="rounded-2xl">
                    <CardHeader className="space-y-3">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            )}

            {/* Error */}
            {recipeQuery.isError && (
                <Card className="rounded-2xl border-destructive/30">
                    <CardHeader>
                        <CardTitle className="text-base">Fehler beim Laden</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {getErrorMessage(recipeQuery.error)}
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary" onClick={() => recipeQuery.refetch()} disabled={recipeQuery.isFetching}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Erneut versuchen
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Not found */}
            {!recipeQuery.isLoading && !recipeQuery.isError && !recipe && (
                <Card className="rounded-2xl">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border bg-muted shadow-sm">
                            <ChefHat className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-semibold">Rezept nicht gefunden</h2>
                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            Das Rezept existiert nicht (mehr) oder du hast keinen Zugriff.
                        </p>
                        <div className="mt-6">
                            <Button asChild>
                                <Link to={ROUTES.recipes}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Zurück zu Rezepten
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Content */}
            {recipe && (
                <Card className="rounded-2xl">
                    <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <CardTitle className="text-2xl leading-tight">{recipe.title}</CardTitle>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Owner: <span className="text-foreground font-medium">{recipe.owner ?? "—"}</span>{" "}
                                    · Aktualisiert: <span className="text-foreground font-medium">{formatDateTime(recipe.updatedAt)}</span>
                                </p>
                            </div>

                            <div className="grid h-11 w-11 place-items-center rounded-2xl border bg-muted" aria-hidden>
                                <ChefHat className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                            {(recipe.tags ?? []).length > 0 ? (
                                (recipe.tags ?? []).map((t) => (
                                    <Badge key={t} variant="outline">
                                        {formatRecipeTag(t)}
                                    </Badge>
                                ))
                            ) : (
                                <Badge variant="secondary">Keine Tags</Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Ingredients */}
                        <section className="space-y-2">
                            <h3 className="text-sm font-semibold">Zutaten</h3>

                            {(recipe.ingredients ?? []).length > 0 ? (
                                <div className="rounded-2xl border bg-muted p-4">
                                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                                        {(recipe.ingredients ?? []).map((ing, idx) => (
                                            <li key={`${ing}-${idx}`}>{ing}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Keine Zutaten hinterlegt.</p>
                            )}
                        </section>

                        {/* Instruction */}
                        <section className="space-y-2">
                            <h3 className="text-sm font-semibold">Anleitung</h3>

                            {recipe.instruction ? (
                                <div className="rounded-2xl border bg-background p-4">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                        {recipe.instruction}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Keine Anleitung hinterlegt.</p>
                            )}
                        </section>
                    </CardContent>

                    <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                        {/* Actions */}
                        <Link
                            to={ROUTES.recipes}
                            className="ui-focus inline-flex items-center justify-center rounded-xl border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition hover:bg-accent"
                        >
                            ← Zurück
                        </Link>

                        <Link
                            to={ROUTES.recipeEdit(recipe.id)}
                            className={[
                                "ui-focus inline-flex items-center justify-center rounded-xl border bg-secondary px-4 py-2 text-sm font-medium",
                                "text-secondary-foreground shadow-sm transition hover:bg-accent",
                                !canEditOrDelete ? "pointer-events-none opacity-60" : "",
                            ].join(" ")}
                            aria-disabled={!canEditOrDelete}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Bearbeiten
                        </Link>

                        <button
                            type="button"
                            className="ui-focus inline-flex items-center justify-center rounded-xl bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm transition hover:brightness-95 active:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={!canEditOrDelete}
                            onClick={() => setConfirmDelete(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Löschen
                        </button>
                    </CardFooter>
                </Card>
            )}

            {/* Delete dialog */}
            <Dialog open={confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(false)}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Rezept löschen?</DialogTitle>
                        <DialogDescription>
                            Willst du <span className="font-medium">„{recipe?.title ?? "dieses Rezept"}“</span> wirklich löschen?
                            Diese Aktion kann nicht rückgängig gemacht werden.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setConfirmDelete(false)}
                            disabled={deleteMutation.isPending}
                        >
                            Abbrechen
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate()}
                            disabled={!recipe || deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Löschen…" : "Löschen"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageShell>
    );
};

export default DetailRecipePage;
