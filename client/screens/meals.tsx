import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import useMealsStore from "../stores/meals";
import Meals from "../components/meals";
import LargeButton from "../components/ui/buttons/large-button";

function MealsScreen({ navigation }) {
  const listRef = useRef(null);

  const { fetchMeals } = useMealsStore((state) => state.actions);

  // function scrollToBottomOfList() {
  //   if (listRef.current) {
  //     setTimeout(() => {
  //       listRef.current.scrollToEnd();
  //     }, 500);
  //   }
  // }

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <View style={styles.container}>
      <Meals ref={listRef} />

      <View style={styles.buttonContainer}>
        <LargeButton
          onPress={() => navigation.navigate("add-meals", { name: "" })}
        >
          <Ionicons name="add" size={36} color="white" />
        </LargeButton>
      </View>
    </View>
  );
}

export default MealsScreen;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
