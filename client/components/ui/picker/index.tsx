import { useState } from "react";
import {
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Text,
  Pressable,
  View,
} from "react-native";

type OptionValue = string | number;

type Option = {
  label: string;
  value: OptionValue;
};

interface PickerProps {
  options: Option[];
  onChange: (value: OptionValue) => void;
}

function Picker({ options, onChange }: PickerProps) {
  const [selectedOption, setSelectedOption] = useState<Option>(null);
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);

  return (
    <>
      <Pressable onPress={() => setPickerVisible(true)}>
        <Text>{selectedOption?.label || "Select food"}</Text>
      </Pressable>

      {pickerVisible && (
        <Modal
          transparent
          // visible={isVisible}
          animationType="fade"
          // onRequestClose={onClose} // Handle back button press on Android
        >
          <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.title}>Title</Text>
              <ScrollView style={styles.content}>
                {options.length > 0 &&
                  options.map((option) => {
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => {
                          onChange(option.value);
                          setSelectedOption(option);
                          setPickerVisible(false);
                        }}
                      >
                        <Text>{option.label}</Text>
                      </Pressable>
                    );
                  })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

export default Picker;

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
    flex: 1,
    // width: "100%",
    // maxHeight: "50%",
    // backgroundColor: "#fff",
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
  modal: {
    flex: 1,
    backgroundColor: "#fff",
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
