import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { getMealsByDateAndTime } from "../../utils/meals";
import useMealsStore from "../../stores/meals";
import MealsFooter from "./footer";
import MealsDay from "./day";

const Meals = forwardRef((props, ref) => {
  const listRef = useRef(null);

  useImperativeHandle(ref, () => ({
    // Expose a scrollToEnd method to the parent through the ref
    scrollToEnd: () => {
      listRef.current.scrollToEnd({ animated: true });
    },
  }));

  const { meals, pendingMeals } = useMealsStore((state) => state);

  const organizedMeals = useMemo(() => {
    if (meals.length === 0 && pendingMeals.length === 0) {
      return [];
    }

    // Combine meals and add pending flag
    const combinedMeals = [
      ...meals.map((meal) => ({ ...meal, pending: false })),
      ...pendingMeals.map((meal) => ({ ...meal, pending: true })),
    ];

    const organizedMeals = getMealsByDateAndTime(combinedMeals);
    return organizedMeals;
  }, [meals, pendingMeals]);

  // useEffect(() => {
  //   // Wait for the component to mount and the list to render
  //   if (flatListRef.current && meals.length > 0) {
  //     // Use a small delay to ensure layout has occurred
  //     setTimeout(() => {
  //       flatListRef.current.scrollToEnd({ animated: false }); // Set animated to true for smooth scroll
  //     }, 0);
  //   }
  // }, [meals]);

  return (
    <View>
      <Text style={styles.title}>My Meals</Text>
      <FlatList
        ref={listRef}
        data={organizedMeals}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => <MealsDay day={item} />}
        ListFooterComponent={<MealsFooter />}
      />
    </View>
  );
});

export default Meals;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
