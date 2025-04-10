import React, {
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { StyleSheet, FlatList } from "react-native";

import { OrganizedMeals } from "../../types/meals";
import { getMealsByDateAndTime } from "../../utils/meals";
import useMealsStore from "../../stores/meals";
import MealsDay from "./day";

const Meals = forwardRef((props, ref) => {
  const listRef = useRef(null);

  const { fetchMeals } = useMealsStore((state) => state.actions);

  const { meals, pendingMeals } = useMealsStore((state) => state);

  const organizedMeals = useMemo<OrganizedMeals[]>(() => {
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

  useImperativeHandle(ref, () => ({
    // Expose a scrollToEnd method to the parent through the ref
    scrollToEnd: () => {
      listRef.current.scrollToEnd({ animated: true });
    },
  }));

  useEffect(() => {
    // Wait for the component to mount and the list to render
    if (listRef.current && organizedMeals.length > 0) {
      setTimeout(() => {
        listRef.current.scrollToEnd({ animated: false });
      }, 10);
    }
  }, [listRef, organizedMeals]);

  useEffect(() => {
    // Get today's meals
    const date = new Date().toISOString().split("T")[0];
    fetchMeals(date);
  }, []);

  return (
    <FlatList
      style={styles.container}
      ref={listRef}
      data={organizedMeals}
      keyExtractor={(item) => item.date}
      renderItem={({ item }) => <MealsDay day={item} />}
    />
  );
});

export default Meals;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});
