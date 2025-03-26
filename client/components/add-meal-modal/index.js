import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal } from "react-native";
import CheckBox from "react-native-check-box";

import Button from "../ui/buttons/button";

function AddMealModal({ isVisible, onAdd, onCancel, disabled }) {
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [healthy, setHealthy] = useState(true);

  return (
    <Modal style={styles.modal} visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>What did you eat?</Text>

        <View style={styles.textInputsContainer}>
          <TextInput
            // ref={foodInputRef}
            style={[styles.textInput, styles.foodInput]}
            value={food}
            onChangeText={setFood}
            placeholder="i.e. Chicken wrap"
            disabled={disabled}
          />
          <TextInput
            style={[styles.textInput, styles.quantityInput]}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            min={1}
            disabled={disabled}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            style={styles.checkbox}
            isChecked={healthy}
            onClick={() => setHealthy(!healthy)}
            // leftText={"Is it healthy?"}
            // leftTextStyle={styles.checkboxLabel}
            disabled={disabled}
          />
          <Text style={styles.checkboxLabel}>Meal is considered healthy</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={onCancel} disabled={disabled}>
            Cancel
          </Button>
          <Button
            onPress={() => onAdd(food, quantity, healthy)}
            disabled={disabled}
          >
            Add Meal
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default AddMealModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "red",
    // alignItems: "",
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
    justifyContent: "space-between",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
