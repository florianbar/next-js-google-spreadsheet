import { View, Text, StyleSheet } from "react-native";

import { MealUI } from "../../types/meals";
import MealsTimeslot from "./timeslot";

// Convert date from YYYY-MM-DD to DD/MM/YYYY format
function getDisplayDate(dateString: string): string {
  const dateParts = dateString.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  return `${day}/${month}/${year}`;
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
        <Text style={styles.title}>{getDayOfWeek(day.date)}</Text>
        <Text style={styles.title}>{getDisplayDate(day.date)}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
