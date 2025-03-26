import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

import { COLORS } from "../../../constants/colors";

function LargeButton({ children, onPress, disabled }) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
        android_ripple={{ color: COLORS.primary450 }}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default LargeButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 24,
    margin: 4,
    width: 100,
    height: 100,
    overflow: "hidden",
  },
  buttonInnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary500,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  pressed: {
    ...Platform.select({
      ios: {
        opacity: 0.75,
      },
    }),
  },
});
