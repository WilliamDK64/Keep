import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useState } from "react";
import { Overlay } from "@rneui/themed";

import { GeneralStyles } from "@/constants/GeneralStyles";
import { Colors } from "@/constants/Colors";

const home = () => {
  const [search, setSearch] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [inputName, setInputName] = useState("");
  const [inputPreferredQuantity, setInputPreferredQuantity] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");

  class Item {
    name: string;
    quantity: number;
    preferredQuantity: number;
    canExpire: boolean;
    expirationDate: Date;

    constructor(
      name: string,
      quantity: number,
      preferredQuantity: number,
      canExpire: boolean,
      expirationDate: Date = new Date()
    ) {
      this.name = name;
      this.quantity = quantity;
      this.preferredQuantity = preferredQuantity;
      this.canExpire = canExpire;
      this.expirationDate = expirationDate;
    }
  }

  const [itemArray, setItemArray] = useState([
    new Item("Paracetamol", 3, 5, true, new Date(2025, 1, 1)),
    new Item("Ibuprofen", 3, 5, true, new Date(2025, 1, 1)),
    new Item("N95", 3, 5, true, new Date(2025, 1, 1)),
  ]);

  const addItem = () => {
    setOverlayVisible(true);
  };

  const createNewItem = () => {
    setItemArray((itemArray) => [
      ...itemArray,
      new Item(
        inputName,
        parseInt(inputQuantity),
        parseInt(inputPreferredQuantity),
        true,
        new Date(2025, 1, 1)
      ),
    ]);
  };

  const handleConfirmItem = () => {
    try {
      parseInt(inputQuantity);
    } catch {
      if (inputQuantity == "") {
        Alert.alert(
          "Error",
          "Please ensure that the quantity field is not empty.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      } else {
        Alert.alert(
          "Error",
          "Please ensure that only numbers are put in the quantity field.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    }
    try {
      parseInt(inputPreferredQuantity);
    } catch {
      if (inputPreferredQuantity == "") {
        Alert.alert(
          "Error",
          "Please ensure that the preferred quantity field is not empty.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      } else {
        Alert.alert(
          "Error",
          "Please ensure that only numbers are put in the preferred quantity field.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    }
    if (inputName == "") {
      Alert.alert(
        "Error",
        "Please ensure that the preferred quantity field is not empty.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    } else {
      createNewItem();
      setOverlayVisible(false);
      setInputName("");
      setInputPreferredQuantity("");
      setInputQuantity("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Search box */}
        <TextInput
          style={styles.searchBox}
          onChangeText={setSearch}
          value={search}
          placeholder="Search"
          selectionColor={Colors.link}
        />
        {/* Horizontal line */}
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            width: "85%",
            marginTop: 20,
          }}
        />

        {itemArray.map((item) => (
          <View key={itemArray.indexOf(item)} style={styles.itemBox}>
            <Text style={styles.itemText} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.itemQuantityBox}>
              <Text style={styles.itemQuantityText}>
                {item.quantity} / {item.preferredQuantity}
              </Text>
            </View>
          </View>
        ))}

        {/* Add Item */}
        <Pressable style={{ width: "85%" }} onPress={addItem}>
          <View style={[styles.itemBox, { width: "100%" }]}>
            <Text
              style={[styles.itemText, { fontFamily: "Inter-Bold" }]}
              numberOfLines={1}
            >
              Add Item
            </Text>
          </View>
        </Pressable>

        {/* Item Config */}
        <Overlay
          overlayStyle={styles.overlayContainer}
          isVisible={overlayVisible}
        >
          <TextInput
            style={styles.longInput}
            onChangeText={setInputName}
            value={inputName}
            placeholder="Name"
            selectionColor={Colors.link}
          />
          <TextInput
            style={styles.longInput}
            onChangeText={setInputQuantity}
            value={inputQuantity}
            placeholder="Quantity"
            selectionColor={Colors.link}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.longInput}
            onChangeText={setInputPreferredQuantity}
            value={inputPreferredQuantity}
            placeholder="Preferred Quantity"
            selectionColor={Colors.link}
            keyboardType="number-pad"
          />
          <Pressable onPress={handleConfirmItem} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
          <Pressable
            onPress={() => setOverlayVisible(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </Overlay>

        {/*
        <View style={styles.itemBox}>
          <Text style={styles.itemText} numberOfLines={1}>
            Paracetamol
          </Text>
          <View style={styles.itemQuantityBox}>
            <Text style={styles.itemQuantityText}>10 / 8</Text>
          </View>
        </View>
        <View style={styles.itemBox}>
          <Text style={styles.itemText} numberOfLines={1}>
            Ibuprofen
          </Text>
          <View style={styles.itemQuantityBox}>
            <Text style={styles.itemQuantityText}>
              <Text style={[styles.itemQuantityText, { color: "red" }]}>5</Text>
              <Text style={styles.itemQuantityText}> / 4</Text>
            </Text>
          </View>
        </View>
        <View style={styles.itemBox}>
          <Text style={styles.itemText} numberOfLines={1}>
            N95
          </Text>
          <View style={styles.itemQuantityBox}>
            <Text style={styles.itemQuantityText}>
              <Text style={[styles.itemQuantityText, { color: "red" }]}>1</Text>
              <Text style={styles.itemQuantityText}> / 10</Text>
            </Text>
          </View>
        </View>
        */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    //backgroundColor: "rgba(211, 211, 211, 0.4)",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
  },
  overlayContainer: {
    width: "85%",
    borderRadius: 13,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  searchBox: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18.5,
    borderRadius: 0,
    width: "85%",
    marginTop: 20,
  },
  itemBox: {
    width: "85%",
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 17,
    borderRadius: 13,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  itemText: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    width: "60%",
    textAlignVertical: "center",
  },
  itemQuantityBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginLeft: "auto",
    backgroundColor: "#ECECEC",
  },
  itemQuantityText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  longInput: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18.5,
    borderRadius: 0,
    width: "90%",
    marginVertical: 10,
  },
  confirmButton: {
    padding: 18.5,
    borderRadius: 13,
    width: "50%",
    margin: 10,
    alignItems: "center",
    backgroundColor: Colors.blue,
  },
  confirmButtonText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "white",
  },
  cancelButton: {
    padding: 18.5,
    borderRadius: 13,
    width: "50%",
    margin: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: "black",
  },
});
