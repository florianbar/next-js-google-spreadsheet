import { API_URL } from "@env";

const REQUEST_HEADERS = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.API_KEY,
};

const BASE_URL = `${API_URL}/api`;

const ENDPOINTS = {
  MEALS: `${BASE_URL}/meals`,
  FOODS: `${BASE_URL}/foods`,
};

export const api = {
  fetchMeals: (date: string) =>
    fetch(`${ENDPOINTS.MEALS}?date=${date}`, {
      method: "GET",
      headers: REQUEST_HEADERS,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch meals");
      return res.json();
    }),

  addMeals: (meals: { food_id: string; quantity: string }[]) =>
    fetch(ENDPOINTS.MEALS, {
      method: "POST",
      headers: REQUEST_HEADERS,
      body: JSON.stringify({ meals }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to add meals");
      return res.json();
    }),

  removeMeal: (id: string) =>
    fetch(`${ENDPOINTS.MEALS}?id=${id}`, {
      method: "DELETE",
      headers: REQUEST_HEADERS,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to remove meal");
      return;
    }),

  fetchFoods: () =>
    fetch(ENDPOINTS.FOODS, {
      method: "GET",
      headers: REQUEST_HEADERS,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch foods");
      return res.json();
    }),
};
