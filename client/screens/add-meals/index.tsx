import { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";

import { getTodayISOString } from "../../utils/date";
import { Meal, MealUI } from "../../types/meals";
import useMealsStore from "../../stores/meals";
import Picker from "../../components/ui/picker";
import Input from "../../components/ui/form/input";

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

function AddMealsScreen({ navigation }) {
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

  function handleSubmit(): void {
    const submittedMeals = [...meals];
    try {
      submittedMeals.forEach((meal: Meal) => {
        // update date
        submittedMeals.forEach((meal: Meal) => {
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
        // onStart();
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

    // onAddMeals();
    navigation.goBack();
  }

  useEffect(() => {
    fetchFoods();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" onPress={() => handleSubmit()} />,
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {meals.map((meal: Meal, mealIndex: number) => (
        <View key={meal.id}>
          <View style={styles.textInputsContainer}>
            <Picker
              style={styles.foodPicker}
              options={foods.map((food) => ({
                label: food.name,
                value: food.id,
              }))}
              onChange={(value: string) => {
                const food = foods.find((food) => food.id === value);
                updateMeal(mealIndex, "food", food);
              }}
            />
            <Input
              style={styles.quantityInput}
              value={meal.quantity}
              onChangeText={(value: string) =>
                updateMeal(mealIndex, "quantity", value)
              }
              keyboardType="numeric"
            />
            {meals.length > 1 && (
              <Pressable onPress={() => removeMeal(mealIndex)}>
                <Ionicons name="trash-outline" size={24} />
              </Pressable>
            )}
          </View>
        </View>
      ))}

      <Pressable onPress={addMeal}>
        <Text style={{ fontSize: 18 }}>+ Add meal</Text>
      </Pressable>
    </ScrollView>
  );
}

export default AddMealsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  textInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  foodPicker: {
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
