import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ROUTES } from "../../router/paths";
import { useAuth } from "../../context/AuthContext";

import type { Recipe } from "../../types/index.types";
import { deleteRecipe, getRecipeById } from "../../api/index.api";
import { formatRecipeTag, getErrorMessage, isAdmin, uiToast } from "../../util/index.util";

import { RecipeFormShell } from "../../components/layout/RecipeFormShell";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Skeleton } from "../../components/ui/Skeleton.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";

import {
    ArrowLeft,
    Pencil,
    Trash2,
    RefreshCcw,
    List,
    AlignLeft,
} from "lucide-react";

const RECIPES_QUERY_KEY = ["recipes"] as const;

function formatDateTime(value?: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("de-DE", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(d);
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

    /* ---------- Invalid ID ---------- */
    if (!Number.isFinite(recipeId) || recipeId <= 0) {
        return (
            <RecipeFormShell
                title="Rezept"
                subtitle="Ungültige Rezept-ID"
                actions={
                    <Button asChild variant="secondary">
                        <Link to={ROUTES.recipes}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Zurück zu Rezepten
                        </Link>
                    </Button>
                }
            >
                <p className="text-sm text-muted-foreground">
                    Bitte öffne ein Rezept aus der Rezeptliste.
                </p>
            </RecipeFormShell>
        );
    }

    /* ---------- Loading ---------- */
    if (recipeQuery.isLoading) {
        return (
            <RecipeFormShell title="Rezept wird geladen…">
                <div className="space-y-4">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </RecipeFormShell>
        );
    }

    /* ---------- Error ---------- */
    if (recipeQuery.isError) {
        return (
            <RecipeFormShell
                title="Fehler beim Laden"
                actions={
                    <Button
                        variant="secondary"
                        onClick={() => recipeQuery.refetch()}
                        disabled={recipeQuery.isFetching}
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Erneut versuchen
                    </Button>
                }
            >
                <Alert variant="error">
                    {getErrorMessage(recipeQuery.error)}
                </Alert>
            </RecipeFormShell>
        );
    }

    /* ---------- Not found ---------- */
    if (!recipe) {
        return (
            <RecipeFormShell
                title="Rezept nicht gefunden"
                actions={
                    <Button asChild>
                        <Link to={ROUTES.recipes}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Zurück zu Rezepten
                        </Link>
                    </Button>
                }
            >
                <Alert variant="info">
                    Das Rezept existiert nicht (mehr) oder du hast keinen Zugriff.
                </Alert>
            </RecipeFormShell>
        );
    }

    /* ---------- Content ---------- */
    return (
        <>
            <RecipeFormShell
                title={recipe.title}
                subtitle={
                    <>
                        Owner:{" "}
                        <span className="font-medium text-foreground">
                            {recipe.owner ?? "—"}
                        </span>{" "}
                        · Aktualisiert:{" "}
                        <span className="font-medium text-foreground">
                            {formatDateTime(recipe.updatedAt)}
                        </span>
                        <span className="block text-xs text-muted-foreground mt-1">
                            Bearbeiten/Löschen nur für Owner oder Admin.
                        </span>
                    </>
                }
                tags={
                    (recipe.tags ?? []).length > 0
                        ? recipe.tags.map((t) => (
                            <Badge key={t} variant="outline">
                                {formatRecipeTag(t)}
                            </Badge>
                        ))
                        : <Badge variant="secondary">Keine Tags</Badge>
                }
                actions={
                    <>
                        <Button asChild variant="secondary">
                            <Link to={ROUTES.recipes}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Zurück
                            </Link>
                        </Button>

                        <div className="flex gap-2">
                            <Button
                                asChild
                                variant="secondary"
                                disabled={!canEditOrDelete}
                            >
                                <Link to={ROUTES.recipeEdit(recipe.id)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Bearbeiten
                                </Link>
                            </Button>

                            <Button
                                variant="destructive"
                                disabled={!canEditOrDelete}
                                onClick={() => setConfirmDelete(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Löschen
                            </Button>
                        </div>
                    </>
                }
            >
                {/* Zutaten */}
                <section className="space-y-2">
                    <div className="flex items-center gap-2">
                        <List className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Zutaten</h3>
                    </div>

                    {(recipe.ingredients ?? []).length > 0 ? (
                        <div className="rounded-2xl border bg-muted p-4">
                            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                                {recipe.ingredients.map((ing, idx) => (
                                    <li key={`${ing}-${idx}`}>{ing}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Keine Zutaten hinterlegt.
                        </p>
                    )}
                </section>

                {/* Anleitung */}
                <section className="space-y-2">
                    <div className="flex items-center gap-2">
                        <AlignLeft className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Anleitung</h3>
                    </div>

                    {recipe.instruction ? (
                        <div className="rounded-2xl border bg-background p-4">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                {recipe.instruction}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Keine Anleitung hinterlegt.
                        </p>
                    )}
                </section>
            </RecipeFormShell>

            {/* Delete dialog */}
            <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Rezept löschen?</DialogTitle>
                        <DialogDescription>
                            Willst du{" "}
                            <span className="font-medium">
                                „{recipe.title}“
                            </span>{" "}
                            wirklich löschen? Diese Aktion kann nicht rückgängig
                            gemacht werden.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setConfirmDelete(false)}
                            disabled={deleteMutation.isPending}
                        >
                            Abbrechen
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Löschen…" : "Löschen"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DetailRecipePage;
