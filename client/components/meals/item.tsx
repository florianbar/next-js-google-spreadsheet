import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { MealUI } from "../../types/meals";
import SyncIcon from "../ui/sync-icon";

function MealsItem({ meal }: { meal: MealUI }) {
  return (
    <View style={[styles.container, meal.pending && styles.uploading]}>
      <Text style={[styles.text, meal.healthy ? styles.unhealthy : null]}>
        {meal.food} x {meal.quantity}
      </Text>
      {meal.pending && (
        <View style={styles.syncIconContainer}>
          <SyncIcon />
        </View>
      )}
    </View>
  );
}

export default MealsItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  uploading: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
  },
  unhealthy: {
    color: COLORS.red,
  },
  syncIconContainer: {
    position: "absolute",
    right: 12,
    top: "50%",
  },
});
