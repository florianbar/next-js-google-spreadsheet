import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

import { COLORS } from "../../../constants/colors";

interface ButtonProps {
  children: string | JSX.Element;
  onPress: () => void;
  disabled?: boolean;
}

function Button({ children, onPress, disabled }: ButtonProps) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }: { pressed: boolean }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
        android_ripple={{ color: COLORS.greenDark }}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default Button;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 8,
    margin: 4,
    overflow: "hidden",
  },
  buttonInnerContainer: {
    backgroundColor: COLORS.green,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
