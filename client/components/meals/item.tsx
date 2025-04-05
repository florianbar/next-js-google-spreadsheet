import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { COLORS } from "../../constants/colors";
import { MealUI } from "../../types/meals";
import SyncIcon from "../ui/sync-icon";

function MealsItem({ meal }: { meal: MealUI }) {
  const [editing, setEditing] = useState(false);

  return (
    <Pressable
      style={[
        styles.container,
        meal.pending && styles.uploading,
        editing && styles.containerEditable,
      ]}
      onLongPress={() => setEditing(true)}
      onPressOut={() => setEditing(false)}
    >
      {!meal.food.healthy && (
        <View style={[styles.label, styles.labelUnhealthy]} />
      )}

      <Text style={styles.text}>
        {meal.food.name} {parseInt(meal.quantity) > 1 && `x ${meal.quantity}`}
      </Text>

      {meal.pending && (
        <View style={styles.syncIconContainer}>
          <SyncIcon />
        </View>
      )}
    </Pressable>
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
  containerEditable: {
    backgroundColor: "#ddd",
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
