import { useMemo } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { Meal } from "../../types/meals";
import MealsTimeslot from "./timeslot";
import useMealsStore from "../../stores/meals";

// Convert date from YYYY-MM-DD to DD MMMMYYYY format
function getDisplayDateLong(dateString: string): string {
  const dateParts = dateString.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const date = new Date(`${year}-${month}-${day}`);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
}

// Get day of week from date
function getDayOfWeek(dateString: string): string {
  const dateParts = dateString.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const date = new Date(`${year}-${month}-${day}`);
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  return date.toLocaleDateString("en-US", options);
}

interface MealsDayProps {
  day: {
    date: string;
    meals: Meal[][];
  };
}

function MealsDay({ day }: MealsDayProps) {
  const { selectedDate, actions } = useMealsStore((state) => state);
  const { prevDay, nextDay } = actions;

  const isToday = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return selectedDate === today;
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.dateButtonsContainer}>
        <Button title="Prev" onPress={prevDay} />
        <Text style={styles.title}>
          {/* {getDayOfWeek(selectedDate)}, {getDisplayDateLong(selectedDate)} */}
          {selectedDate}
        </Text>
        {!isToday && <Button title="Next" onPress={nextDay} />}
      </View>
      <View style={styles.titleContainer}></View>

      {day.meals.map((mealSlot, index) => (
        <MealsTimeslot key={index} index={index} meals={mealSlot} />
      ))}
    </View>
  );
}

export default MealsDay;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dateButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
