import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { getMealsByDateAndTime, TIMESLOT_LABLES } from "../../utils/meals";
import { COLORS } from "../../constants/colors";

const renderFooter = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>This is the end</Text>
  </View>
);

function Meals({ meals, pendingMeals }) {
  const flatListRef = useRef(null);

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
      {/* <FlatList
        ref={flatListRef}
        // contentContainerStyle={{ paddingBottom: 100 }}
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.createdAt}</Text>
            <Text style={item.healthy ? {} : styles.unhealthy}>
              {item.food} x {item.quantity}
            </Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        // inverted
      /> */}
      <FlatList
        ref={flatListRef}
        // contentContainerStyle={{ paddingBottom: 100 }}
        data={organizedMeals}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.mealsItem}>
            <Text style={styles.dateTitle}>{item.date}</Text>
            {item.meals.map((mealSlot, index) => (
              <View key={index} style={styles.timeslotContainer}>
                <Text style={styles.timeslotTitle}>
                  {TIMESLOT_LABLES[Object.keys(TIMESLOT_LABLES)[index]]}
                </Text>
                {mealSlot.map((meal) => (
                  <Text
                    key={meal.id}
                    style={
                      meal.healthy
                        ? styles.mealText
                        : [styles.mealText, styles.unhealthy]
                    }
                  >
                    {meal.food} x {meal.quantity}{" "}
                    {meal.pending ? "(pending)" : ""}
                  </Text>
                ))}
              </View>
            ))}
            {/* <Text>{item.createdAt}</Text>
            <Text style={item.healthy ? {} : styles.unhealthy}>
              {item.food} x {item.quantity}
            </Text> */}
          </View>
        )}
        ListFooterComponent={renderFooter}
        // inverted
      />
    </View>
  );
}

export default Meals;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mealsItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "lightgray",
    padding: 4,
  },
  timeslotContainer: {
    marginVertical: 8,
  },
  timeslotTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mealText: {
    fontSize: 16,
    backgroundColor: "#eee",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  unhealthy: {
    color: COLORS.red,
  },
  footer: {
    height: 300,
    justifyContent: "center",
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
  },
});
