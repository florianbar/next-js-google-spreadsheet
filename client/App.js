import { API_URL } from "@env";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import NumericInput from "react-native-numeric-input";

import { getTodayISOString } from "./utils/date";
import { getMappedMeals } from "./utils/meals";
import Meals from "./components/meals";
import AddMealModal from "./components/add-meal-modal";
import LargeButton from "./components/ui/buttons/large-button";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [meals, setMeals] = useState([]);

  function closeModal() {
    setShowModal(false);
  }

  function handleSubmit(food, quantity, healthy) {
    if (food.trim() === "") {
      Alert.alert("Invalid Food", "The food name cannot be empty.", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }

    if (quantity === "" || parseInt(quantity) <= 0) {
      Alert.alert("Invalid Amount", "The amount must be greater than 0.", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }

    setSubmitted(true);

    fetch(`${API_URL}/api/meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: getTodayISOString(),
        food,
        quantity,
        healthy,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add meal.");
        }
        return response.json();
      })
      .then((data) => {
        Alert.alert("Meal Added", "The meal has been added successfully.", [
          { text: "OK", onPress: () => {} },
        ]);
        fetchMeals();
        resetForm();
      })
      .catch((error) => {
        Alert.alert("Failed to Add Meal", "An error occurred.", [
          { text: "OK", onPress: () => {} },
        ]);
      })
      .finally(() => {
        setSubmitted(false);
      });
  }

  function fetchMeals() {
    fetch(`${API_URL}/api/meals`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch meals.");
        }
        return response.json();
      })
      .then((data) => {
        const cleanData = data.values.slice(1); // remove title row
        const meals = getMappedMeals(cleanData);
        setMeals(meals);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <>
      <View style={styles.rootContainer}>
        <Meals meals={meals} />

        <AddMealModal
          isVisible={showModal}
          onAdd={handleSubmit}
          disabled={submitted}
          onCancel={closeModal}
        />

        {!showModal && (
          <View style={styles.addButtonContainer}>
            <LargeButton onPress={() => setShowModal(true)}>
              <Ionicons name="add" size={46} color="white" />
            </LargeButton>
          </View>
        )}

        {/* <NumericInput
        // inputStyle={styles.textInput}
        type="up-down"
        value={enteredAmount}
        minValue={1}
        step={1}
        onChange={(value) => console.log(value)}
      /> */}
      </View>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    position: "relative",
    flex: 1,
    marginTop: 60,
    padding: 16,
    backgroundColor: "#fff",
  },
  container: {
    backgroundColor: "#efefef",
    padding: 24,
    borderRadius: 24,
  },
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
