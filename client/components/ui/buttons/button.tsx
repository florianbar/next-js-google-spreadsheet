import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

import { COLORS } from "../../../constants/colors";

interface ButtonProps {
  children: string | JSX.Element;
  onPress: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

function Button({ children, onPress, disabled, size = "md" }: ButtonProps) {
  const buttonInnerContainerStyles: object[] = [styles.buttonInnerContainer];
  const buttonTextStyles: object[] = [styles.buttonText];

  switch (size) {
    case "sm":
      buttonInnerContainerStyles.push(styles.buttonInnerContainerSm);
      buttonTextStyles.push(styles.buttonTextSm);
      break;
    case "lg":
      buttonInnerContainerStyles.push(styles.buttonInnerContainerLg);
      buttonTextStyles.push(styles.buttonTextLg);
  }

  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }: { pressed: boolean }) =>
          pressed
            ? [...buttonInnerContainerStyles, styles.pressed]
            : buttonInnerContainerStyles
        }
        onPress={onPress}
        android_ripple={{ color: COLORS.greenDark }}
        disabled={disabled}
      >
        <Text style={buttonTextStyles}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default Button;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 40,
    margin: 4,
    overflow: "hidden",
  },
  buttonInnerContainer: {
    backgroundColor: COLORS.blue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonInnerContainerSm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonInnerContainerLg: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTextSm: {
    fontSize: 12,
  },
  buttonTextLg: {
    fontSize: 20,
  },
  pressed: {
    ...Platform.select({
      ios: {
        opacity: 0.75,
      },
    }),
  },
});
