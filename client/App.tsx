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
        <Stack.Navigator>
          <Stack.Screen
            name="meals"
            component={MealsScreen}
            options={{
              title: "Meals",
            }}
          />
          <Stack.Screen
            name="add-meals"
            component={AddMealsScreen}
            options={{
              title: "Add Meals",
              headerBackTitle: "Back",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
