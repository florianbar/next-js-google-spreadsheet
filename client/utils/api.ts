import { API_URL } from "@env";
import { QueryClient } from "@tanstack/react-query";

import { Meal } from "../types/meals";
import { Food } from "../types/foods";

const REQUEST_HEADERS = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.API_KEY,
};

const BASE_URL = `${API_URL}/api`;

const ENDPOINTS = {
  MEALS: `${BASE_URL}/meals`,
  FOODS: `${BASE_URL}/foods`,
};

export const queryClient = new QueryClient();

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(
      `Error: ${res.status} - ${res.statusText}. Details: ${errorDetails}`
    );
  }

  // Check if the response has a body before parsing as JSON
  const contentType = res.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return undefined;
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

  removeMeal: async (id: string): Promise<void> => {
    const res = await fetch(`${ENDPOINTS.MEALS}?id=${id}`, {
      method: "DELETE",
      headers: REQUEST_HEADERS,
    });
    await handleResponse(res);
  },

  fetchFoods: async (): Promise<Food[]> => {
    const res = await fetch(ENDPOINTS.FOODS, {
      method: "GET",
      headers: REQUEST_HEADERS,
    });
    const data = await handleResponse(res);
    return data.foods;
  },
};
