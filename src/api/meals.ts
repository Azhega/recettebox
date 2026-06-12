const BASE = 'https://www.themealdb.com/api/json/v1/1';

export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  [key: string]: string | undefined;
};

export async function searchMeals(query: string): Promise<Meal[]> {
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.meals ?? [];
}

export async function getMealById(id: string): Promise<Meal | null> {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals?.[0] ?? null;
}
