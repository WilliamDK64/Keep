import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontFamily: "Inter-Bold" }}>Hello world!</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
