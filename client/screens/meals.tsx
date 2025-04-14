import { useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { api } from "../utils/api";
import Meals from "../components/meals";
import LargeButton from "../components/ui/buttons/large-button";

const todaysDate = new Date().toISOString().split("T")[0];

function MealsScreen({ navigation }) {
  const listRef = useRef(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["meals"],
    queryFn: () => api.fetchMeals(todaysDate),
    staleTime: Infinity,
  });

  // function scrollToBottomOfList() {
  //   if (listRef.current) {
  //     setTimeout(() => {
  //       listRef.current.scrollToEnd();
  //     }, 500);
  //   }
  // }

  return (
    <View style={styles.container}>
      {isPending && <Text>Loading...</Text>}

      {data && <Meals ref={listRef} meals={data} />}

      <View style={styles.buttonContainer}>
        <LargeButton
          onPress={() => navigation.navigate("add-meal", { name: "" })}
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
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 14,
    right: 14,
  },
});
