import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import CheckBox from "react-native-check-box";
import { Ionicons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";

import { getTodayISOString } from "../../utils/date";
import Button from "../ui/buttons/button";
import BottomSheet from "../ui/bottom-sheet";
import { AddMealsBottomSheetProps } from "./types";
import { Meal } from "../../types/meals";
import { COLORS } from "../../constants/colors";
import useMealsStore from "../../stores/meals";

function getInitialMeal(): Meal {
  return {
    id: uuidv4(),
    createdAt: "",
    food: "",
    quantity: "1",
    healthy: true,
  };
}

function AddMealsBottomSheet({
  isVisible,
  onClose,
  onAddMeals,
}: AddMealsBottomSheetProps) {
  const foodInputRef = useRef(null);

  const { addMeals } = useMealsStore((state) => state.actions);

  const [meals, setMeals] = useState<Meal[]>([getInitialMeal()]);

  function addMeal(): void {
    setMeals((prevMeals: Meal[]) => [...prevMeals, getInitialMeal()]);
  }

  function removeMeal(index: number): void {
    if (meals.length === 1) {
      return;
    }

    const newMeals = [...meals];
    newMeals.splice(index, 1);
    setMeals(newMeals);
  }

  function updateMeal(index: number, key: string, value: any): void {
    const newMeals = [...meals];
    newMeals[index][key] = value;
    setMeals(newMeals);
  }

  function handleSubmit(meals: Meal[]): void {
    try {
      meals.forEach((meal: Meal) => {
        // update date
        meals.forEach((meal: Meal) => {
          meal.createdAt = getTodayISOString();
        });

        // Validate food
        if (meal.food.trim() === "") {
          throw new Error("The food name cannot be empty.");
        }

        // Validate quantity
        if (meal.quantity === "" || parseInt(meal.quantity) <= 0) {
          throw new Error("The amount must be greater than 0.");
        }
      });
    } catch (error: any) {
      Alert.alert("Failed to Add Meals", error.message, [
        { text: "OK", onPress: () => {} },
      ]);

      return;
    }

    addMeals(meals, {
      onSuccess: () => {
        Alert.alert("Meals added successfully", "", [
          { text: "OK", onPress: () => {} },
        ]);

        // Reset the meals
        setMeals([getInitialMeal()]);
      },
    });

    onAddMeals();
  }

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} title="Add Meal">
      {meals.map((meal: Meal, index: number) => (
        <View key={index} style={styles.textInputsContainer}>
          {/* add a changing colour lable */}
          <Pressable
            style={[
              styles.colorLabel,
              { backgroundColor: meal.healthy ? COLORS.blue : COLORS.red },
            ]}
            onPress={() => updateMeal(index, "healthy", !meal.healthy)}
          />

          <TextInput
            ref={foodInputRef}
            style={[styles.textInput, styles.foodInput]}
            value={meal.food}
            onChangeText={(value: string) => updateMeal(index, "food", value)}
            placeholder="i.e. Chicken wrap"
          />
          <TextInput
            style={[styles.textInput, styles.quantityInput]}
            value={meal.quantity}
            onChangeText={(value: string) =>
              updateMeal(index, "quantity", value)
            }
            keyboardType="numeric"
          />
          {meals.length > 1 && (
            <Pressable onPress={() => removeMeal(index)}>
              {/* <Text style={{ fontSize: 24 }}>🗑️</Text> */}
              <Ionicons name="trash-outline" size={24} />
            </Pressable>
          )}

          {/* <View style={styles.checkboxContainer}>
            <CheckBox
              style={styles.checkbox}
              isChecked={meal.healthy}
              onClick={() => updateMeal(index, "healthy", !meal.healthy)}
              // leftText={"Is it healthy?"}
              // leftTextStyle={styles.checkboxLabel}
            />
            <Text style={styles.checkboxLabel}>Meal is considered healthy</Text>
          </View> */}
        </View>
      ))}

      <Pressable onPress={addMeal}>
        <Text style={{ fontSize: 18 }}>+ Add meal</Text>
      </Pressable>

      <View style={styles.buttonContainer}>
        <Button onPress={() => handleSubmit(meals)}>Done</Button>
      </View>
    </BottomSheet>
  );
}

export default AddMealsBottomSheet;

const styles = StyleSheet.create({
  textInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  colorLabel: {
    width: 25,
    height: 25,
    borderRadius: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  foodInput: {
    flex: 7,
  },
  quantityInput: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkbox: {
    marginVertical: 10,
  },
  checkboxLabel: {
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
