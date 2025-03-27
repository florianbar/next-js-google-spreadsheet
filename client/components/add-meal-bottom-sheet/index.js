import { API_URL } from "@env";
import { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import CheckBox from "react-native-check-box";
// import NumericInput from "react-native-numeric-input";

import { getTodayISOString } from "../../utils/date";
import Button from "../ui/buttons/button";
import BottomSheet from "../ui/bottom-sheet";

function AddMealBottomSheet({ isVisible, onClose, onSuccess }) {
  const foodInputRef = useRef(null);

  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [healthy, setHealthy] = useState(true);
  const [submitted, setSubmitted] = useState(false);

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
        onSuccess();
      })
      .catch((error) => {
        console.log("Error ::::", error);
        Alert.alert("Failed to Add Meal", "An error occurred.", [
          { text: "OK", onPress: () => {} },
        ]);
      })
      .finally(() => {
        setSubmitted(false);
      });
  }

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
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

      {/* <NumericInput
        // inputStyle={styles.textInput}
        type="up-down"
        value={enteredAmount}
        minValue={1}
        step={1}
        onChange={(value) => console.log(value)}
      /> */}

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => handleSubmit(food, quantity, healthy)}
          disabled={submitted}
        >
          Add Meal
        </Button>
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
