import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

import { COLORS } from "../../../constants/colors";

interface LargeButtonProps {
  children: string | JSX.Element;
  onPress: () => void;
  disabled?: boolean;
}

function LargeButton({ children, onPress, disabled }: LargeButtonProps) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
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

export default LargeButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: "100%",
    margin: 4,
    width: 60,
    height: 60,
    overflow: "hidden",
  },
  buttonInnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.green,
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
