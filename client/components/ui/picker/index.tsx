import { useState, useMemo, useRef } from "react";
import {
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Text,
  Pressable,
  View,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Input from "../form/input";

type OptionValue = string | number;

type Option = {
  label: string;
  value: OptionValue;
};

interface PickerProps {
  style: any;
  options: Option[];
  onChange: (value: OptionValue) => void;
}

function Picker({ style, options, onChange }: PickerProps) {
  // const searchInputRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState<Option>(null);
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  // const [searchQuery, setSearchQuery] = useState<string>("");

  const closeModal = () => {
    Keyboard.dismiss();
    setPickerVisible(false);
    // setSearchQuery("");
  };

  const orderedOptions = useMemo(() => {
    return options.sort((a, b) => a.label.localeCompare(b.label));
  }, [options]);

  // const filteredOptions = useMemo(() => {
  //   if (!searchQuery || searchQuery.length < 3) {
  //     return options;
  //   }
  //   return options.filter((option) =>
  //     option.label.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // }, [searchQuery, options]);

  return (
    <>
      <Input
        style={style}
        placeholder="Select food"
        value={selectedOption?.label}
        onPressIn={() => setPickerVisible(true)}
        // editable={false}
      />

      {pickerVisible && (
        <Modal transparent animationType="fade">
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>
            <View style={styles.modalInner}>
              <View style={styles.header}>
                <Text style={styles.title}>Select Food</Text>
                <Pressable onPress={closeModal}>
                  <Ionicons name="close" size={24} />
                </Pressable>
              </View>
              {/* <Input
                // ref={searchInputRef}
                placeholder="Search for food"
                value={searchQuery}
                onChangeText={setSearchQuery}
              /> */}
              <ScrollView style={styles.options}>
                {orderedOptions.length > 0 &&
                  orderedOptions.map((option) => {
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => {
                          onChange(option.value);
                          setSelectedOption(option);
                          setPickerVisible(false);
                        }}
                        style={styles.option}
                      >
                        <Text style={styles.optionText}>{option.label}</Text>

                        {selectedOption?.value === option.value && (
                          <View style={styles.optionCheckmark}>
                            <Ionicons name="checkmark-outline" size={24} />
                          </View>
                        )}
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
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  modalInner: {
    flex: 1,
    maxHeight: "75%",
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  options: {
    flex: 1,
  },
  option: {
    position: "relative",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  optionText: {
    fontSize: 16,
  },
  optionCheckmark: {
    position: "absolute",
    right: 12,
    top: "50%",
    width: 24,
    height: 24,
  },
});
