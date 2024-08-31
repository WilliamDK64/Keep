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
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { auth } from "../firebase/firebase";

import { Colors } from "@/constants/Colors";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        setEmail("");
        setPassword("");
        router.replace("/home");
      })
      .catch((err: any) => {
        setLoading(false);
        alert(err.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.innerContainer}>
        {/* KEEP logo */}
        <Image
          source={require("@/assets/images/castle-tower.png")}
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
        {/* Password Input */}
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          selectionColor={Colors.link}
        />
        {/* Sign In Button */}
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? Colors.highlightedBlue : Colors.blue,
            },
            styles.button,
          ]}
          onPress={/*() => router.navigate("/home")*/ handleSignIn}
        >
          <Text style={styles.buttonText}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </Text>
        </Pressable>
        {/* Forgot Password Link */}
        <Text
          style={styles.link}
          onPress={() => router.navigate("/resetpassword")}
        >
          Forgot password?
        </Text>
        {/* Create Account Button */}
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? Colors.highlightedMinor : "white",
            },
            styles.minorButton,
          ]}
          onPress={() => router.navigate("/register")}
        >
          <Text style={styles.minorButtonText}>CREATE ACCOUNT</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  innerContainer: {
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
