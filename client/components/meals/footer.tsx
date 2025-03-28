import { View, Text, StyleSheet } from "react-native";

function MealsFooter() {
  return (
    <View style={styles.footer}>
      {/* <Text style={styles.footerText}>This is the end</Text> */}
    </View>
  );
}

export default MealsFooter;

const styles = StyleSheet.create({
  footer: {
    height: 300,
    paddingTop: 20,
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
  },
});
