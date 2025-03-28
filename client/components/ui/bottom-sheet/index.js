import { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  Animated,
  // Dimensions,
  TouchableWithoutFeedback,
  // useAnimatedValue,
  ScrollView,
  Text,
} from "react-native";

// const { height: screenHeight } = Dimensions.get("window");
const ANIM_DURATION = 300;

// function getTimingConfig(toValue, duration = ANIM_DURATION) {
//   return {
//     toValue,
//     duration,
//     useNativeDriver: true,
//   };
// }

function BottomSheet({ children, isVisible, onClose, title }) {
  const [modalVisible, setModalVisible] = useState(false);

  // const slideInAnim = useAnimatedValue(screenHeight); // Initial position off-screen
  // const slideOutAnim = useAnimatedValue(0);

  // function slideIn() {
  //   Animated.timing(slideInAnim, getTimingConfig(0)).start();
  // }

  // function slideOut() {
  //   Animated.timing(slideOutAnim, getTimingConfig(screenHeight)).start(() => {
  //     setModalVisible(false);
  //   });
  // }

  useEffect(() => {
    if (isVisible) {
      setModalVisible(isVisible);
      // slideIn();
    }
    // }, [isVisible, slideIn]);
  }, [isVisible]);

  if (!modalVisible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose} // Handle back button press on Android
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          // {
          //   transform: [{ translateY: slideInAnim }],
          // },
        ]}
      >
        {title && <Text style={styles.title}>{title}</Text>}
        <ScrollView style={styles.content}>{children}</ScrollView>
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
  modalContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    maxHeight: "50%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
});
