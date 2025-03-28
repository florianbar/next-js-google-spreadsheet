import { View, Text, StyleSheet } from "react-native";

import { TIMESLOT_LABLES } from "../../utils/meals";
import { MealUI } from "../../types/meals";
import MealsItem from "./item";

function MealsTimeslot({ index, meals }: { index: number; meals: MealUI[] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {TIMESLOT_LABLES[Object.keys(TIMESLOT_LABLES)[index]]}
      </Text>
      {meals.map((meal) => (
        <MealsItem key={meal.id} meal={meal} />
      ))}
    </View>
  );
}

export default MealsTimeslot;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
