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
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import { Overlay } from "@rneui/themed";
import DatePicker from "react-native-date-picker";
import { router } from "expo-router";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

import { GeneralStyles } from "@/constants/GeneralStyles";
import { Colors } from "@/constants/Colors";

const home = () => {
  const [userInfo, setUserInfo] = useState<any | undefined>(null);

  const [search, setSearch] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [itemEditing, setItemEditing] = useState(Boolean);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const [inputName, setInputName] = useState("");
  const [inputPreferredQuantity, setInputPreferredQuantity] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");
  const [inputDate, setInputDate] = useState(new Date());

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

  const fetchData = async () => {
    const docRef = doc(db, "users", "lvDYGX8rCFe9uSMcphlmezTJJWv2");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserInfo(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/");
  };

  const [itemArray, setItemArray] = useState([
    new Item("Paracetamol", 3, 5, true, new Date(2025, 1, 1)),
    new Item("Ibuprofen", 3, 5, true, new Date(2025, 1, 1)),
    new Item("N95", 3, 5, true, new Date(2025, 1, 1)),
  ]);

  const cancelConfig = () => {
    setInputName("");
    setInputQuantity("");
    setInputPreferredQuantity("");
    setItemEditing(false);
    setOverlayVisible(false);
  };

  const createNewItem = () => {
    if (itemEditing) {
      itemArray.splice(
        currentItemIndex,
        1,
        new Item(
          inputName,
          parseInt(inputQuantity),
          parseInt(inputPreferredQuantity),
          true,
          new Date(2025, 1, 1)
        )
      );
      setItemEditing(false);
    } else {
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
    }
  };

  function isNumber(num: string) {
    return (
      !isNaN(parseInt(num)) && isFinite(parseInt(num)) && parseInt(num) >= 0
    );
  }

  const handleConfirmItem = () => {
    let errorMessage = "";
    // Error Handling
    // TIDY UP LATER
    if (
      inputName == "" ||
      isNumber(inputQuantity) == false ||
      isNumber(inputPreferredQuantity) == false
    ) {
      // Is name empty?
      if (inputName == "") {
        errorMessage = errorMessage.concat(
          "Please ensure that the name field is not empty.\n\n"
        );
      }
      // Is quantity a number?
      if (isNumber(inputQuantity) == false) {
        // Is it empty?
        if (inputQuantity == "") {
          errorMessage = errorMessage.concat(
            "Please ensure that the quantity field is not empty.\n\n"
          );
        }
        // Is it negative?
        else if (parseInt(inputQuantity) < 0) {
          errorMessage = errorMessage.concat(
            "Please do not input a negative number into the quantity field.\n\n"
          );
        }
        // Is it finite?
        else if (isFinite(parseInt(inputQuantity)) == false) {
          errorMessage = errorMessage.concat(
            "Please input a smaller number into the quantity field.\n\n"
          );
        }
        // It is NaN.
        else {
          errorMessage = errorMessage.concat(
            "Please ensure that only numbers are put in the quantity field.\n\n"
          );
        }
      }
      // Is preferred quantity a number?
      if (isNumber(inputPreferredQuantity) == false) {
        // Is it empty?
        if (inputPreferredQuantity == "") {
          errorMessage = errorMessage.concat(
            "Please ensure that the preferred quantity field is not empty.\n\n"
          );
        }
        // Is it negative?
        else if (parseInt(inputPreferredQuantity) < 0) {
          errorMessage = errorMessage.concat(
            "Please do not input a negative number into the preferred quantity field.\n\n"
          );
        }
        // Is it finite?
        else if (isFinite(parseInt(inputPreferredQuantity)) == false) {
          errorMessage = errorMessage.concat(
            "Please input a smaller number into the preferred quantity field.\n\n"
          );
        }
        // It is Nan.
        else {
          errorMessage = errorMessage.concat(
            "Please ensure that only numbers are put in the preferred quantity field.\n\n"
          );
        }
      }
      Alert.alert("ERROR", errorMessage, [{ text: "OK" }]);
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
        <Text>Email: {userInfo?.Email}</Text>
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

        {itemArray
          .filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <Pressable
              key={itemArray.indexOf(item)}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? Colors.highlightedMinor : "white",
                },
                styles.itemBox,
              ]}
              onPress={() => {
                setCurrentItemIndex(itemArray.indexOf(item));
                setItemEditing(true);
                setInputName(item.name);
                setInputQuantity(item.quantity.toString());
                setInputPreferredQuantity(item.preferredQuantity.toString());
                setOverlayVisible(true);
              }}
            >
              <Text style={styles.itemText} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.itemQuantityBox}>
                <Text style={styles.itemQuantityText}>
                  {item.quantity} / {item.preferredQuantity}
                </Text>
              </View>
            </Pressable>
          ))}

        {/* Add Item */}
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? Colors.highlightedMinor : "white",
            },
            styles.itemBox,
          ]}
          onPress={() => {
            setItemEditing(false);
            setOverlayVisible(true);
          }}
        >
          <Text
            style={[styles.itemText, { fontFamily: "Inter-Bold" }]}
            numberOfLines={1}
          >
            Add Item
          </Text>
        </Pressable>

        {/* TEMPORARY SIGN OUT */}
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? Colors.highlightedMinor : "white",
            },
            styles.itemBox,
          ]}
          onPress={handleSignOut}
        >
          <Text
            style={[styles.itemText, { fontFamily: "Inter-Bold" }]}
            numberOfLines={1}
          >
            Sign Out
          </Text>
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
            maxLength={5}
            onChangeText={setInputQuantity}
            value={inputQuantity}
            placeholder="Quantity"
            selectionColor={Colors.link}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.longInput}
            maxLength={5}
            onChangeText={setInputPreferredQuantity}
            value={inputPreferredQuantity}
            placeholder="Preferred Quantity"
            selectionColor={Colors.link}
            keyboardType="number-pad"
          />
          <Pressable
            style={styles.longInput}
            onPress={() => setDateVisible(true)}
          >
            <Text style={styles.longInputText}>
              {inputDate.getDate().toString()} /{" "}
              {(inputDate.getMonth() + 1).toString()} /{" "}
              {inputDate.getFullYear().toString()}
            </Text>
          </Pressable>
          <DatePicker
            modal
            mode="date"
            open={dateVisible}
            date={inputDate}
            onConfirm={(date) => {
              setDateVisible(false);
              setInputDate(date);
            }}
            onCancel={() => setDateVisible(false)}
          />
          <Pressable onPress={handleConfirmItem} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
          <Pressable onPress={cancelConfig} style={styles.cancelButton}>
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
  longInputText: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: "gray",
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
