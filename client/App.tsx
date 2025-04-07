import "react-native-get-random-values"; // Polyfill for uuidv4

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MealsScreen from "./screens/meals";
import AddMealsScreen from "./screens/add-meals";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: { fontSize: 22 },
            headerBackTitle: "Back",
          }}
        >
          <Stack.Screen
            name="meals"
            component={MealsScreen}
            options={{
              title: "My Meals",
            }}
          />
          <Stack.Screen
            name="add-meal"
            component={AddMealsScreen}
            options={{
              title: "Add Meal",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
