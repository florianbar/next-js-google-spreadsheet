import "react-native-get-random-values"; // Polyfill for uuidv4

import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Meals from "./components/meals";
import AddMealsBottomSheet from "./components/add-meals-bottom-sheet";
import LargeButton from "./components/ui/buttons/large-button";
import useMealsStore from "./stores/meals";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const listRef = useRef(null);

  const { fetchMeals } = useMealsStore((state) => state.actions);

  function closeModal() {
    setShowModal(false);
  }

  function scrollToBottomOfList() {
    if (listRef.current) {
      setTimeout(() => {
        listRef.current.scrollToEnd();
      }, 500);
    }
  }

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <>
      <View style={styles.rootContainer}>
        <Meals ref={listRef} />

        <AddMealsBottomSheet
          isVisible={showModal}
          onClose={closeModal}
          onStart={scrollToBottomOfList}
          onAddMeals={closeModal}
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
