/* ============================================================================
 * Recipe API – Kommunikation mit /api/recipes
 * ============================================================================
 */

import axiosInstance from "./axios";
import type {
    Recipe,
    CreateRecipeRequestDto,
    UpdateRecipeRequestDto,
} from "../types/index.types";

const BASE = "/recipes";

/**
 * Lädt alle bestehenden Rezepte
 * GET /api/recipes
 */
export async function getAllRecipes(): Promise<Recipe[]> {
    const res = await axiosInstance.get<Recipe[]>(BASE);
    return res.data;
}

/**
 * Lädt ein Rezept anhand seiner ID
 * GET /api/recipes/{id}
 */
export async function getRecipeById(id: number): Promise<Recipe> {
    const res = await axiosInstance.get<Recipe>(`${BASE}/${id}`);
    return res.data;
}

/**
 * Erstellt ein Rezept
 * POST /api/recipes
 */
export async function createRecipe(
    payload: CreateRecipeRequestDto
): Promise<Recipe> {
    const res = await axiosInstance.post<Recipe>(BASE, payload);
    return res.data;
}

/**
 * Updated ein Rezept anhand seiner ID
 * PATCH /api/recipes/{id}
 */
export async function updateRecipe(
    id: number,
    payload: UpdateRecipeRequestDto
): Promise<Recipe> {
    const res = await axiosInstance.patch<Recipe>(`${BASE}/${id}`, payload);
    return res.data;
}

/**
 * Löscht ein Rezept anhand seiner ID
 * DELETE /api/recipes/{id}  -> 204 No Content
 */
export async function deleteRecipe(id: number): Promise<void> {
    await axiosInstance.delete(`${BASE}/${id}`);
}
