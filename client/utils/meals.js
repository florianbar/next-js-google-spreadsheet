export function getMappedMeals(meals) {
  return meals.map((meal) => {
    return {
      id: meal[0],
      food: meal[1],
      quantity: meal[2],
      healthy: meal[3] === "TRUE",
      createdAt: meal[4],
    };
  });
}

export const TIMESLOT_LABLES = {
  breakfast: "Breakfast",
  morningSnack: "Morning Snack",
  lunch: "Lunch",
  afternoonSnack: "Afternoon Snack",
  dinner: "Dinner",
};

export function getMealsByDateAndTime(meals) {
  const organizedMeals = [];
  const timeSlots = {
    [TIMESLOT_LABLES.breakfast]: 6,
    [TIMESLOT_LABLES.morningSnack]: 9,
    [TIMESLOT_LABLES.lunch]: 12,
    [TIMESLOT_LABLES.afternoonSnack]: 15,
    [TIMESLOT_LABLES.dinner]: 18,
  };
  const timeSlotKeys = Object.values(TIMESLOT_LABLES);

  const mealsByDate = {};

  meals.forEach((meal) => {
    const createdAt = new Date(meal.createdAt);
    const dateString = createdAt.toISOString().split("T")[0];
    const hour = createdAt.getHours();

    let closestSlot = null;
    let minDifference = Infinity;

    for (const slotName of timeSlotKeys) {
      const slotHour = timeSlots[slotName];
      const difference = Math.abs(hour - slotHour);

      if (difference < minDifference) {
        minDifference = difference;
        closestSlot = slotName;
      } else if (difference === minDifference) {
        // If the difference is the same, round to the later time slot
        if (Math.abs(hour - timeSlots[closestSlot]) < difference) {
          closestSlot = slotName;
        }
      }
    }

    if (!mealsByDate[dateString]) {
      mealsByDate[dateString] = {
        Breakfast: [],
        "Morning Snack": [],
        Lunch: [],
        "Afternoon Snack": [],
        Supper: [],
      };
    }

    mealsByDate[dateString][closestSlot].push(meal);
  });

  for (const date in mealsByDate) {
    organizedMeals.push({
      date: date,
      meals: Object.values(mealsByDate[date]),
    });
  }

  return organizedMeals;
}
