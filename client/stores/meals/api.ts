import { API_URL } from "@env";

const REQUEST_HEADERS = {
  "Content-Type": "application/json",
  "X-API-KEY": process.env.API_KEY,
};

export const api = {
  fetchMeals: (date: string) =>
    fetch(`${API_URL}/api/meals?date=${date}`, {
      method: "GET",
      headers: REQUEST_HEADERS,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch meals");
      return res.json();
    }),

  addMeals: (meals: { food_id: string; quantity: string }[]) =>
    fetch(`${API_URL}/api/meals`, {
      method: "POST",
      headers: REQUEST_HEADERS,
      body: JSON.stringify({ meals }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to add meals");
      return res.json();
    }),

  removeMeal: (id: string) =>
    fetch(`${API_URL}/api/meals?id=${id}`, {
      method: "DELETE",
      headers: REQUEST_HEADERS,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to remove meal");
      return;
    }),

  fetchFoods: () =>
    fetch(`${API_URL}/api/foods`, {
      method: "GET",
      headers: REQUEST_HEADERS,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch foods");
      return res.json();
    }),
};
