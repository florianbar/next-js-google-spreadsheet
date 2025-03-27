import { API_URL } from "@env";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  useAnimatedValue,
} from "react-native";
import CheckBox from "react-native-check-box";

import { getTodayISOString } from "../../utils/date";
import Button from "../ui/buttons/button";

const { height: screenHeight } = Dimensions.get("window");
const ANIM_DURATION = 300;

function getTimingConfig(toValue) {
  return {
    toValue,
    duration: ANIM_DURATION,
    useNativeDriver: true,
  };
}

function AddMealModal({ isVisible, onClose, onSuccess }) {
  const foodInputRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useAnimatedValue(screenHeight); // Initial position off-screen
  const fadeAnim = useAnimatedValue(0); // Initial opacity 0

  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [healthy, setHealthy] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setModalVisible(isVisible);

      // Animate modal slide-in and backdrop fade-in
      Animated.parallel([
        Animated.timing(slideAnim, getTimingConfig(0)),
        Animated.timing(fadeAnim, getTimingConfig(1)),
      ]).start();
    } else {
      // Animate modal slide-out and backdrop fade-out
      Animated.parallel([
        Animated.timing(slideAnim, getTimingConfig(screenHeight)),
        Animated.timing(fadeAnim, getTimingConfig(0)),
      ]).start(() => setModalVisible(false)); // Hide modal after animation
    }
  }, [isVisible, slideAnim, screenHeight]);

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

  if (!modalVisible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onClose} // Handle back button press on Android
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: fadeAnim }]}
        ></Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
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
          <Button onPress={onClose} disabled={submitted}>
            Cancel
          </Button>
          <Button
            onPress={() => handleSubmit(food, quantity, healthy)}
            disabled={submitted}
          >
            Add Meal
          </Button>
        </View>
      </Animated.View>
    </Modal>
  );
}

export default AddMealModal;

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
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
