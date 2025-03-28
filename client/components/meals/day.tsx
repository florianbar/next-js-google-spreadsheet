import { View, Text, StyleSheet } from "react-native";

import { MealUI } from "../../types/meals";
import MealsTimeslot from "./timeslot";

function MealsDay({ day }: { day: { date: string; meals: MealUI[][] } }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{day.date}</Text>

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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "lightgray",
    padding: 4,
  },
});
