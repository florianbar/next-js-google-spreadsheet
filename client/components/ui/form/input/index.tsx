import { View, Text, TextInput, StyleSheet } from "react-native";

function Input(props) {
  const { containerStyle, textInputStyle, prefix, ...rest } = props;
  const { placeholder } = rest;
  console.log("placeholder", placeholder);
  return (
    <View style={[styles.container, containerStyle]}>
      {prefix && <View style={styles.prefix}>{prefix}</View>}
      <TextInput style={[styles.textInput, textInputStyle]} {...rest} />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 12,
    paddingVertical: 10,
  },
  prefix: {
    paddingLeft: 8,
  },
});
