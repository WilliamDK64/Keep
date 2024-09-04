import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  Button,
  Switch,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { auth, db } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

import { GLOBAL } from "@/constants/Global";
import { Colors } from "@/constants/Colors";

const settings = () => {
  const docRef = doc(db, "users", GLOBAL.uid);
  const [inputExpiryReminder, setInputExpiryReminder] = useState(
    GLOBAL.expiryReminder.toString()
  );

  const [expiryFilter, setExpiryFilter] = useState(GLOBAL.nearExpiryFilter);
  const toggleExpiryFilter = (value: boolean) => {
    setExpiryFilter(value);
    GLOBAL.nearExpiryFilter = value;
    setTotalFilter(value == stockFilter && value);
    GLOBAL.filterChanged = true;
  };
  const [stockFilter, setStockFilter] = useState(GLOBAL.lowStockFilter);
  const toggleStockFilter = (value: boolean) => {
    setStockFilter(value);
    GLOBAL.lowStockFilter = value;
    setTotalFilter(value == expiryFilter && value);
    GLOBAL.filterChanged = true;
  };
  const [totalFilter, setTotalFilter] = useState(
    GLOBAL.nearExpiryFilter == GLOBAL.lowStockFilter && GLOBAL.nearExpiryFilter
      ? true
      : false
  );
  const toggleTotalFilter = (value: boolean) => {
    setTotalFilter(value);
    setExpiryFilter(value);
    setStockFilter(value);
    GLOBAL.nearExpiryFilter = value;
    GLOBAL.lowStockFilter = value;
    GLOBAL.filterChanged = true;
  };

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/");
  };

  const handleSave = async () => {
    await setDoc(docRef, {
      Email: GLOBAL.email,
      ExpiryReminder: GLOBAL.expiryReminder,
      Items: GLOBAL.items,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.innerContainer}>
        {/* Title */}
        <Text style={styles.title}>Settings</Text>
        {/* Horizontal line */}
        <View style={styles.line} />
        {/* Sign out */}
        <Text style={styles.header}>Account</Text>
        <Text>
          <Text>Logged in as: </Text>
          <Text style={{ fontFamily: "Inter-Bold" }}>
            {GLOBAL.email}
            {"\n"}
          </Text>
        </Text>
        <Button color={Colors.blue} title="SIGN OUT" onPress={handleSignOut} />
        {/* Horizontal line */}
        <View style={styles.line} />
        <Text style={styles.header}>Filter Items</Text>
        <View style={styles.filter}>
          <Text>Attention required</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={totalFilter ? "#3D7FFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            value={totalFilter}
            onValueChange={toggleTotalFilter}
          />
        </View>
        <View style={styles.filter}>
          <Text>
            {"\t"}
            {"\u2022"}
            {"  "}Low stock
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={stockFilter ? "#3D7FFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            value={stockFilter}
            onValueChange={toggleStockFilter}
          />
        </View>
        <View style={styles.filter}>
          <Text>
            {"\t"}
            {"\u2022"}
            {"  "}Near expiry
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={expiryFilter ? "#3D7FFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            value={expiryFilter}
            onValueChange={toggleExpiryFilter}
          />
        </View>
        {/* Horizontal line */}
        <View style={styles.line} />
        <Text style={styles.header}>Expiry Date Reminder Period</Text>
        <TextInput
          style={styles.input}
          maxLength={3}
          onChangeText={setInputExpiryReminder}
          value={inputExpiryReminder}
          placeholder={GLOBAL.expiryReminder.toString()}
          selectionColor={Colors.link}
          keyboardType="number-pad"
        />
        <Button
          title="Save"
          color={Colors.blue}
          onPress={() => {
            try {
              GLOBAL.expiryReminder = parseInt(inputExpiryReminder);
              Alert.alert(
                "Saved",
                "Successfully changed the expiry reminder to " +
                  GLOBAL.expiryReminder.toString() +
                  " days."
              );
              handleSave();
            } catch {
              Alert.alert(
                "Error",
                "Please ensure that only proper integer numbers are put in the field."
              );
            }
          }}
        />
        {/* Horizontal line */}
        <View style={styles.line} />
        <Text style={styles.header}>Attributions</Text>
        <Text>
          This application was made by William Dimery-Knight in collaboration
          with Hato Hone St John. St John logos and iconography are used with
          permission.{"\n"}
          For any inquiries, please email{" "}
          <Text style={{ fontFamily: "Inter-Bold" }}>
            williamdk.101@gmail.com
          </Text>
          .{"\n"}
        </Text>
      </ScrollView>
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
    marginTop: 20,
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
  },
  line: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: "100%",
    marginVertical: 20,
  },
  button: {
    marginVertical: 10,
    fontFamily: "Inter-Regular",
  },
  filter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18.5,
    borderRadius: 0,
    marginVertical: 10,
  },
});
