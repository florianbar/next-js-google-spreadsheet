import { useState, useMemo, useRef } from "react";
import {
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Text,
  Pressable,
  View,
  Keyboard,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Input from "../form/input";

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
  // const searchInputRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState<Option>(null);
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const closeModal = () => {
    Keyboard.dismiss();
    setPickerVisible(false);
    setSearchQuery("");
  };

  const orderedOptions = useMemo(() => {
    const updatedOptions = options.filter((option) => {
      // exclude selected option
      return !(selectedOption && option.value === selectedOption.value);
    });

    if (selectedOption) {
      updatedOptions.unshift(selectedOption);
    }

    return updatedOptions;
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 3) {
      return orderedOptions;
    }
    return orderedOptions.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, orderedOptions]);

  return (
    <>
      <Pressable style={styles.picker} onPress={() => setPickerVisible(true)}>
        {selectedOption?.label ? (
          <Text style={styles.pickerText}>{selectedOption.label}</Text>
        ) : (
          <Text style={styles.pickerPlaceholderText}>Select food</Text>
        )}

        <Ionicons name="chevron-down" size={20} />
      </Pressable>

      {pickerVisible && (
        <Modal transparent animationType="fade">
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>
            <View style={styles.modalInner}>
              <View style={styles.header}>
                <Input
                  // ref={searchInputRef}
                  containerStyle={styles.searchInputContainer}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  prefix={<Ionicons name="search" size={20} />}
                />
                <Pressable onPress={closeModal}>
                  <Ionicons name="close" size={24} />
                </Pressable>
              </View>

              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setSelectedOption(item);
                      onChange(item.value);
                      closeModal();
                    }}
                    style={styles.option}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>

                    {selectedOption?.value === item.value && (
                      <View style={styles.optionCheckmark}>
                        <Ionicons name="checkmark-outline" size={24} />
                      </View>
                    )}
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

export default Picker;

const styles = StyleSheet.create({
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
    width: "100%",
    paddingLeft: 12,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  pickerText: {
    paddingVertical: 10,
    fontSize: 16,
  },
  pickerPlaceholderText: {
    paddingVertical: 10,
    fontSize: 16,
    opacity: 0.5,
  },
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
    paddingHorizontal: 16,
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
  },
  searchInputContainer: {
    flex: 1,
    marginRight: 12,
  },
  options: {
    flex: 1,
  },
  option: {
    position: "relative",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
  },
  optionCheckmark: {
    position: "absolute",
    right: 16,
    top: "50%",
    width: 24,
    height: 24,
  },
});
