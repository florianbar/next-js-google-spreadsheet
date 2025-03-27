import { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  useAnimatedValue,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");
const ANIM_DURATION = 300;

function getTimingConfig(toValue, duration = ANIM_DURATION) {
  return {
    toValue,
    duration: ANIM_DURATION,
    useNativeDriver: true,
  };
}

function BottomSheet({ children, isVisible, onClose }) {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useAnimatedValue(screenHeight); // Initial position off-screen
  const fadeAnim = useAnimatedValue(0); // Initial opacity 0

  useEffect(() => {
    if (isVisible) {
      setModalVisible(isVisible);

      // Animate modal slide-in and backdrop fade-in
      Animated.parallel([
        Animated.timing(slideAnim, getTimingConfig(0)),
        Animated.timing(fadeAnim, getTimingConfig(1)),
      ]).start();
    } else {
      // Animate modal slide-out and backdrop fade-out
      Animated.parallel([
        Animated.timing(slideAnim, getTimingConfig(screenHeight)),
        Animated.timing(fadeAnim, getTimingConfig(0)),
      ]).start(() => setModalVisible(false)); // Hide modal after animation
    }
  }, [isVisible, slideAnim, screenHeight]);

  if (!modalVisible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="fade"
      onRequestClose={onClose} // Handle back button press on Android
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: fadeAnim }]}
        ></Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContent,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}

export default BottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    transform: [{ translateY: screenHeight }], // TODO does it need this???????
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
