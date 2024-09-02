import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  Button,
} from "react-native";
import { router } from "expo-router";
import { auth, db } from "../../firebase/firebase";
import React from "react";

import { GLOBAL } from "@/constants/Global";

const settings = () => {
  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Settings</Text>
        <Text>Logged in as: {GLOBAL.email}</Text>
        <Button title="SIGN OUT" onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    //backgroundColor: "rgba(211, 211, 211, 0.4)",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
  },
  innerContainer: {
    width: "85%",
    backgroundColor: "white",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 30,
  },
  header: {},
});
