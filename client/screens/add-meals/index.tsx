import { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  Button as RNButton,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation } from "@tanstack/react-query";

import { COLORS } from "../../constants/colors";
import { api, queryClient } from "../../utils/api";
import { getTodayISOString } from "../../utils/date";
import { Meal } from "../../types/meals";
import Picker from "../../components/ui/picker";
import Input from "../../components/ui/form/input";
import Button from "../../components/ui/buttons/button";

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
  const [meals, setMeals] = useState<Meal[]>([getInitialMeal()]);

  const {
    data: foods,
    isPending: foodsIsPending,
    isError: foodsHasError,
    error: foodsError,
    refetch,
  } = useQuery({
    queryKey: ["foods"],
    queryFn: () => api.fetchFoods(),
    staleTime: Infinity, // Cache the data forever
  });

  const {
    mutate: addMeals,
    isPending: addMealsIsPending,
    isError: addMealsHasError,
    error: addMealsError,
  } = useMutation({
    mutationFn: api.addMeals,
    onSuccess: () => {
      // Invalidate the meals query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["meals"] });

      // Reset the meals
      setMeals([getInitialMeal()]);

      navigation.goBack();
    },
  });

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
    // TODO: use formik
    try {
      meals.forEach((meal: Meal) => {
        // Validate food
        if (meal.food.name.trim() === "") {
          throw new Error("The food name cannot be empty.");
        }

        // Validate quantity
        if (meal.quantity === "" || parseInt(meal.quantity) <= 0) {
          throw new Error("The amount must be greater than 0.");
        }

        // update date
        meal.consumed_at = getTodayISOString();
      });
    } catch (error: any) {
      Alert.alert("Failed to Add Meals", error.message, [
        { text: "OK", onPress: () => {} },
      ]);

      return;
    }

    const mappedMeals = meals.map((meal: Meal) => ({
      food_id: meal.food.id,
      quantity: meal.quantity,
    }));

    addMeals(mappedMeals);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RNButton title="Save" onPress={() => handleSubmit(meals)} />
      ),
    });
  }, [navigation, meals]);

  if (foodsHasError) {
    return <Text>Error: {foodsError.message}</Text>;
  }

  if (foodsIsPending) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {meals.map((meal: Meal, mealIndex: number) => (
        <View key={meal.id}>
          <View style={styles.textInputsContainer}>
            <View style={styles.foodPickerContainer}>
              <Picker
                options={foods.map((food) => ({
                  label: food.name,
                  value: food.id,
                }))}
                onChange={(value: string) => {
                  const { id, name, healthy } = foods.find(
                    (food) => food.id === value
                  );
                  updateMeal(mealIndex, "food", { id, name, healthy });
                }}
                renderNoItemsFound={(searchQuery) => (
                  <View style={styles.noItemsContainer}>
                    <Text style={styles.noItemsTitle}>Not Found</Text>
                    <Text style={styles.noItemsText}>
                      Sorry, there is no food item matching:
                    </Text>
                    <Text style={styles.noItemsText}>"{searchQuery}"</Text>
                    <View style={styles.addFoodButtonContainer}>
                      <Button size="sm" onPress={() => {}}>
                        Add Food
                      </Button>
                    </View>
                  </View>
                )}
              />
            </View>
            <Input
              containerStyle={styles.quantityInput}
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

      <Pressable onPress={addMeal} style={styles.addButtonContainer}>
        <Ionicons name="add-outline" size={18} style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>Add Meal Item</Text>
      </Pressable>
    </ScrollView>
  );
}

export default AddMealsScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
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
  foodPickerContainer: {
    flex: 7,
  },
  quantityInput: {
    flex: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginVertical: 12,
    paddingVertical: 6,
  },
  addButtonIcon: {
    color: COLORS.blue,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.blue,
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  noItemsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  noItemsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  addFoodButtonContainer: {
    marginTop: 8,
    alignItems: "center",
  },
});
