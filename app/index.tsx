import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import { useState } from "react";

import { Colors } from "@/constants/Colors";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Image
        source={require("@/assets/images/castle-tower.png")}
        style={{ width: 232, height: 232 }}
      />
      {/*<Text style={styles.title}>KEEP</Text>*/}
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        selectionColor={Colors.link}
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        selectionColor={Colors.link}
      />
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? Colors.highlightedBlue : Colors.blue,
          },
          styles.button,
        ]}
        onPress={() => console.log("Sign in")}
      >
        <Text style={styles.buttonText}>SIGN IN</Text>
      </Pressable>
      <Text style={styles.link} onPress={() => console.log("Forgot password")}>
        Forgot password?
      </Text>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? Colors.highlightedMinor : "white",
          },
          styles.minorButton,
        ]}
        onPress={() => console.log("Create account")}
      >
        <Text style={styles.minorButtonText}>CREATE ACCOUNT</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Inter-ExtraBold",
    fontSize: 52,
    marginBottom: 10,
  },
  input: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18.5,
    borderRadius: 13,
    width: "70%",
    margin: 10,
  },
  button: {
    padding: 18.5,
    borderRadius: 13,
    width: "70%",
    margin: 10,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "white",
  },
  link: {
    color: Colors.link,
    fontFamily: "Inter-Regular",
    fontSize: 20,
    textDecorationLine: "underline",
    margin: 10,
  },
  minorButton: {
    padding: 18.5,
    borderRadius: 13,
    width: "70%",
    margin: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  minorButtonText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "black",
  },
});
