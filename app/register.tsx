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
import { doc, setDoc } from "firebase/firestore";

import { Colors } from "@/constants/Colors";
import { createUserWithEmailAndPassword } from "firebase/auth";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        setDoc(doc(db, "users", user.uid), {
          Items: [],
        })
          .then(() => alert("Account created successfully!"))
          .catch((err: any) => {
            alert(err.message);
          });
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        router.back();
      })
      .catch((err: any) => {
        setLoading(false);
        alert(err.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
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
      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirm Password"
        secureTextEntry={true}
        autoCapitalize="none"
        selectionColor={Colors.link}
      />
      {/* Create Account Button */}
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? Colors.highlightedBlue : Colors.blue,
          },
          styles.button,
        ]}
        onPress={
          password == confirmPassword
            ? handleSignUp
            : () =>
                alert(
                  "Please ensure that the password and confirmation password are the same."
                )
        }
      >
        <Text style={styles.buttonText}>
          {loading ? "CREATING..." : "CREATE ACCOUNT"}
        </Text>
      </Pressable>
      {/* Sign In Link */}
      <Text style={styles.link} onPress={() => router.back()}>
        Have an account? Sign In
      </Text>
    </SafeAreaView>
  );
};

export default register;

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
