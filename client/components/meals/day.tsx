import { View, Text, StyleSheet } from "react-native";

import { MealUI } from "../../types/meals";
import MealsTimeslot from "./timeslot";

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

function MealsDay({ day }: { day: { date: string; meals: MealUI[][] } }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {getDayOfWeek(day.date)}, {getDisplayDateLong(day.date)}
        </Text>
      </View>

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
});
