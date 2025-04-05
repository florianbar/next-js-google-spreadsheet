import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";

import { getTodayISOString } from "../../utils/date";
import Button from "../ui/buttons/button";
import BottomSheet from "../ui/bottom-sheet";
import { AddMealsBottomSheetProps } from "./types";
import { Meal, MealUI } from "../../types/meals";
import { Food } from "../../types/foods";
import { COLORS } from "../../constants/colors";
import useMealsStore from "../../stores/meals";

function getInitialMeal(): Meal {
  return {
    id: uuidv4(),
    quantity: "1",
    consumed_at: "",
    food: {
      id: "",
      name: "",
      healthy: true,
    },
  };
}

function AddMealsBottomSheet({
  isVisible,
  onClose,
  onStart,
  onAddMeals,
}: AddMealsBottomSheetProps) {
  const foodInputRef = useRef(null);

  const { foods, actions } = useMealsStore((state) => state);
  const { fetchFoods, addMeals } = actions;

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
          meal.consumed_at = getTodayISOString();
        });

        // Validate food
        if (meal.food.name.trim() === "") {
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

    addMeals(meals as MealUI[], {
      onStart: () => {
        onStart();
      },
      onSuccess: () => {
        // Alert.alert("Meals added successfully", "", [
        //   { text: "OK", onPress: () => {} },
        // ]);

        // TODO add a toast notification

        // Reset the meals
        setMeals([getInitialMeal()]);
      },
    });

    onAddMeals();
  }

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} title="Add Meal">
      {meals.map((meal: Meal, mealIndex: number) => (
        <View key={meal.id}>
          <View style={styles.textInputsContainer}>
            {foods.length > 0 &&
              foods.map((food: Food) => {
                const selected = meal.food.id === food.id;
                return (
                  <Pressable
                    key={food.id}
                    onPress={() => updateMeal(mealIndex, "food", food)}
                  >
                    <Text style={{ color: selected ? "blue" : "black" }}>
                      {food.name} ({food.id})
                    </Text>
                  </Pressable>
                );
              })}
          </View>
          <View style={styles.textInputsContainer}>
            <TextInput
              style={[styles.textInput, styles.quantityInput]}
              value={meal.quantity}
              onChangeText={(value: string) =>
                updateMeal(mealIndex, "quantity", value)
              }
              keyboardType="numeric"
            />
            {meals.length > 1 && (
              <Pressable onPress={() => removeMeal(mealIndex)}>
                {/* <Text style={{ fontSize: 24 }}>🗑️</Text> */}
                <Ionicons name="trash-outline" size={24} />
              </Pressable>
            )}
          </View>
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
