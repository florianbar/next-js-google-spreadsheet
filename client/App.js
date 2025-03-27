import { API_URL } from "@env";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getMappedMeals } from "./utils/meals";
import Meals from "./components/meals";
import AddMealBottomSheet from "./components/add-meal-bottom-sheet";
import LargeButton from "./components/ui/buttons/large-button";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [meals, setMeals] = useState([]);

  function closeModal() {
    setShowModal(false);
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

        <AddMealBottomSheet
          isVisible={showModal}
          onClose={closeModal}
          onSuccess={() => {
            fetchMeals();
            closeModal();
          }}
        />

        <View style={styles.addButtonContainer}>
          <LargeButton onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={36} color="white" />
          </LargeButton>
        </View>
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
    padding: 20,
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
