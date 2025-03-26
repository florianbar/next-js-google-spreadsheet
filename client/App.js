import { API_URL } from "@env";
import { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import CheckBox from "react-native-check-box";
// import NumericInput from "react-native-numeric-input";

import { getTodayISOString } from "./utils/date";
import Button from "./components/button";

export default function App() {
  const foodInputRef = useRef(null);

  const [submitted, setSubmitted] = useState(false);
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [healthy, setHealthy] = useState(true);

  function resetForm() {
    setFood("");
    setQuantity("1");
    setHealthy(true);

    if (foodInputRef.current) {
      foodInputRef.current.focus();
    }
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

  return (
    <>
      <View style={styles.rootContainer}>
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
            <Text style={styles.checkboxLabel}>Meal is considered healthy</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={handleSubmit} disabled={submitted}>
              Add Meal
            </Button>
          </View>
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
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 16,
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
});
