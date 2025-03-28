import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { MealUI } from "../../types/meals";
import SyncIcon from "../ui/sync-icon";

function MealsItem({ meal }: { meal: MealUI }) {
  return (
    <View style={[styles.container, meal.pending && styles.uploading]}>
      {!meal.healthy && <View style={[styles.label, styles.labelUnhealthy]} />}

      <Text style={styles.text}>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
    backgroundColor: "#eee", // light grey
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  label: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  labelUnhealthy: {
    backgroundColor: COLORS.red,
  },
  uploading: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
  },
  syncIconContainer: {
    position: "absolute",
    right: 12,
    top: "50%",
  },
});
