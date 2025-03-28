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
      <View style={styles.mealsContainer}>
        {meals.length > 0 &&
          meals.map((meal) => <MealsItem key={meal.id} meal={meal} />)}

        {meals.length === 0 && <Text>No meals</Text>}
      </View>
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
  mealsContainer: {
    marginVertical: 6,
    overflow: "hidden",
    borderRadius: 12,
  },
});
