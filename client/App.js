import { API_URL } from "@env";
import { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import CheckBox from "react-native-check-box";
import { Ionicons } from "@expo/vector-icons";
// import NumericInput from "react-native-numeric-input";

import { getTodayISOString } from "./utils/date";
import { getMappedMeals } from "./utils/meals";
import Meals from "./components/meals";
import Button from "./components/ui/buttons/button";
import LargeButton from "./components/ui/buttons/large-button";

export default function App() {
  const foodInputRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [healthy, setHealthy] = useState(true);
  const [meals, setMeals] = useState([]);

  function resetForm() {
    setShowModal(false);

    setFood("");
    setQuantity("1");
    setHealthy(true);
  }

  function handleSubmit() {
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

        {showModal && (
          <View style={styles.container}>
            <Text style={styles.title}>What did you eat?</Text>

            <View style={styles.textInputsContainer}>
              <TextInput
                ref={foodInputRef}
                style={[styles.textInput, styles.foodInput]}
                value={food}
                onChangeText={setFood}
                placeholder="i.e. Chicken wrap"
                disabled={submitted}
              />
              <TextInput
                style={[styles.textInput, styles.quantityInput]}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                min={1}
                disabled={submitted}
              />
            </View>

            <View style={styles.checkboxContainer}>
              <CheckBox
                style={styles.checkbox}
                isChecked={healthy}
                onClick={() => setHealthy(!healthy)}
                // leftText={"Is it healthy?"}
                // leftTextStyle={styles.checkboxLabel}
                disabled={submitted}
              />
              <Text style={styles.checkboxLabel}>
                Meal is considered healthy
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button onPress={handleSubmit} disabled={submitted}>
                Add Meal
              </Button>
            </View>
          </View>
        )}

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
