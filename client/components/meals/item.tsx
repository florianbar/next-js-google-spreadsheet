import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { MealUI } from "../../types/meals";

function MealsItem({ meal }: { meal: MealUI }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, meal.healthy ? styles.unhealthy : null]}>
        {meal.food} x {meal.quantity} {meal.pending ? "(pending)" : ""}
      </Text>
    </View>
  );
}

export default MealsItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
  },
  unhealthy: {
    color: COLORS.red,
  },
});
