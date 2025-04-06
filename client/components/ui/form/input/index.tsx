import { TextInput, StyleSheet } from "react-native";

function Input(props) {
  const { style, ...rest } = props;
  return <TextInput {...rest} style={[styles.textInput, style]} />;
}

export default Input;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
});
