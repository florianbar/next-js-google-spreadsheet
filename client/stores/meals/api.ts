import { API_URL } from "@env";

import { Meal } from "../../types/meals";
import { Food } from "../../types/foods";

const REQUEST_HEADERS = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.API_KEY,
};

const BASE_URL = `${API_URL}/api`;

const ENDPOINTS = {
  MEALS: `${BASE_URL}/meals`,
  FOODS: `${BASE_URL}/foods`,
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(
      `Error: ${res.status} - ${res.statusText}. Details: ${errorDetails}`
    );
  }
  return res.json();
};

export const api = {
  fetchMeals: async (date: string): Promise<Meal[]> => {
    const res = await fetch(`${ENDPOINTS.MEALS}?date=${date}`, {
      method: "GET",
      headers: REQUEST_HEADERS,
    });
    const data = await handleResponse(res);
    return data.meals;
  },

  addMeals: async (
    meals: { food_id: string; quantity: string }[]
  ): Promise<Meal[]> => {
    const res = await fetch(ENDPOINTS.MEALS, {
      method: "POST",
      headers: REQUEST_HEADERS,
      body: JSON.stringify({ meals }),
    });
    const data = await handleResponse(res);
    return data.meals;
  },

  removeMeal: (id: string) =>
    fetch(`${ENDPOINTS.MEALS}?id=${id}`, {
      method: "DELETE",
      headers: REQUEST_HEADERS,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to remove meal");
      return;
    }),

  fetchFoods: async (): Promise<Food[]> => {
    const res = await fetch(ENDPOINTS.FOODS, {
      method: "GET",
      headers: REQUEST_HEADERS,
    });
    const data = await handleResponse(res);
    return data.foods;
  },
};
