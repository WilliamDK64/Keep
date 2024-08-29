import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { Colors } from "@/constants/Colors";

const order = () => {
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text>Order Modal</Text>
      </View>
    </View>
  );
};

export default order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "rgba(212, 212, 212, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    width: "85%",
    height: "85%",
    borderColor: Colors.border,
    borderRadius: 13,
  },
});
