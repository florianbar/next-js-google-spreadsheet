import { API_URL } from "@env";

import { Meal } from "../../types/meals";

export const api = {
  fetchMeals: () =>
    fetch(`${API_URL}/api/meals`).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch meals");
      return res.json();
    }),

  addMeals: (meals: Meal[]) =>
    fetch(`${API_URL}/api/meals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meals }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to add meals");
      return res.json();
    }),
};
