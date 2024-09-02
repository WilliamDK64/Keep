import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { auth, db } from "../firebase/firebase";

import { Colors } from "@/constants/Colors";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const resetpassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePassword = async () => {
    await sendPasswordResetEmail(auth, email)
      .then(() =>
        alert(
          "You have been sent an email to reset your password. Please make sure to check your spam folder."
        )
      )
      .catch((error: any) => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/stjohn-adaptive.png")}
        style={{ width: 232, height: 232 }}
      />
      {/*<Text style={styles.title}>KEEP</Text>*/}
      {/* Email Input */}
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        selectionColor={Colors.link}
      />
      {/* Reset Password Button */}
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? Colors.highlightedBlue : Colors.blue,
          },
          styles.button,
        ]}
        onPress={handlePassword}
      >
        <Text style={styles.buttonText}>
          {loading ? "RESETTING..." : "RESET PASSWORD"}
        </Text>
      </Pressable>
      {/* Sign In Link */}
      <Text style={styles.link} onPress={() => router.back()}>
        Return to Sign In
      </Text>
    </SafeAreaView>
  );
};

export default resetpassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
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
