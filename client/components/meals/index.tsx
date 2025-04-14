import React, {
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { StyleSheet, FlatList } from "react-native";

import { Meal, OrganizedMeals } from "../../types/meals";
import { getMealsByDateAndTime } from "../../utils/meals";
import MealsDay from "./day";

interface MealsProps {
  meals: Meal[] | null;
}

const Meals = forwardRef(({ meals }: MealsProps, ref) => {
  const listRef = useRef(null);

  const organizedMeals = useMemo<OrganizedMeals[]>(() => {
    if (meals && meals.length === 0) {
      return [];
    }

    const organizedMeals = getMealsByDateAndTime(meals);
    return organizedMeals;
  }, [meals]);

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
