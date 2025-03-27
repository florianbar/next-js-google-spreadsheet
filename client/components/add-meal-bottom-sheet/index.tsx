import { API_URL } from "@env";
import { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import CheckBox from "react-native-check-box";
// import NumericInput from "react-native-numeric-input";

import { getTodayISOString } from "../../utils/date";
import Button from "../ui/buttons/button";
import BottomSheet from "../ui/bottom-sheet";
import { Meal, AddMealBottomSheetProps } from "./types";

const initialMeal = {
  createdAt: getTodayISOString(),
  food: "",
  quantity: "1",
  healthy: true,
};

function AddMealBottomSheet({
  isVisible,
  onClose,
  onSuccess,
}: AddMealBottomSheetProps) {
  const foodInputRef = useRef(null);

  const [meals, setMeals] = useState<Meal[]>([
    { ...initialMeal },
    { ...initialMeal },
  ]);

  function updateMeal(index: number, key: string, value: any): void {
    const newMeals = [...meals];
    newMeals[index][key] = value;
    setMeals(newMeals);
  }

  function handleSubmit(meals: Meal[]): void {
    try {
      // Validate the meals
      meals.forEach((meal: Meal) => {
        if (meal.food.trim() === "") {
          throw new Error("The food name cannot be empty.");
        }

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

    fetch(`${API_URL}/api/meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meals,
      }),
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("Failed to add meal/s.");
        }
        return response.json();
      })
      .then((data: any) => {
        Alert.alert(
          "Meal/s Added",
          "The meal/s have been added successfully.",
          [{ text: "OK", onPress: () => {} }]
        );
        onSuccess();
      })
      .catch((error: Error) => {
        Alert.alert("Failed to Add Meal/s", "An error occurred.", [
          { text: "OK", onPress: () => {} },
        ]);
      });
  }

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <Text style={styles.title}>What did you eat?</Text>

      {meals.map((meal: Meal, index: number) => (
        <View key={index}>
          <View style={styles.textInputsContainer}>
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
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              style={styles.checkbox}
              isChecked={meal.healthy}
              onClick={() => updateMeal(index, "healthy", !meal.healthy)}
              // leftText={"Is it healthy?"}
              // leftTextStyle={styles.checkboxLabel}
            />
            <Text style={styles.checkboxLabel}>Meal is considered healthy</Text>
          </View>

          {/* <NumericInput
            // inputStyle={styles.textInput}
            type="up-down"
            value={enteredAmount}
            minValue={1}
            step={1}
            onChange={(value) => console.log(value)}
          /> */}
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Button onPress={() => handleSubmit(meals)}>Add Meal</Button>
      </View>
    </BottomSheet>
  );
}

export default AddMealBottomSheet;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 2,
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
