import { useEffect } from "react";
import { StyleSheet, useAnimatedValue, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function SyncIcon({ isSpinning = true }: { isSpinning?: boolean }) {
  const spinAnim = useAnimatedValue(0);

  useEffect(() => {
    if (isSpinning) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
    }
  }, [isSpinning, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ rotate: spin }],
        },
      ]}
    >
      <Ionicons name="sync-outline" size={24} />
    </Animated.View>
  );
}

export default SyncIcon;

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
  },
});
