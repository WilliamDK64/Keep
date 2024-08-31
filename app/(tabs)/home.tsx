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
  ActivityIndicator,
  Appearance,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { Overlay } from "@rneui/themed";
import DatePicker from "react-native-date-picker";
import { router } from "expo-router";
import { auth, db } from "../../firebase/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { GeneralStyles } from "@/constants/GeneralStyles";
import { Colors } from "@/constants/Colors";

const home = () => {
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [userId, setUserId] = useState("Null");
  const docRef = doc(db, "users", userId);

  const [search, setSearch] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [itemEditing, setItemEditing] = useState(Boolean);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const [inputName, setInputName] = useState("");
  const [inputPreferredQuantity, setInputPreferredQuantity] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");
  const [inputDate, setInputDate] = useState(new Date());
  const [inputCanExpire, setInputCanExpire] = useState(false);

  // This should be changed to be editable in settings
  const EXPIRY_PERIOD: number = 14;

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
    new Item("Example", 1, 5, true, new Date(2025, 1, 1)),
  ]);

  const fetchData = async () => {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      setUserInfo(docSnap.data());
      let importItems: Item[] = [];
      if (docSnap.data().Items != null) {
        docSnap.data().Items.forEach((item: any) => {
          importItems.push(
            new Item(
              item.name,
              item.quantity,
              item.preferredQuantity,
              item.canExpire,
              item.date.toDate()
            )
          );
        });
        setItemArray(importItems);
      }
    } else {
      // docSnap.data() will be undefined in this case
      //console.log("No such document!");
    }
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      //console.log("Logged in as ID: ", user.uid);
      setUserId(user.uid);
    } else {
      // User is signed out
      //console.log("User is signed out");
    }
  });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleSave = async () => {
    let mapItems: any = [];
    itemArray.forEach((item) => {
      mapItems.push({
        name: item.name,
        quantity: item.quantity,
        preferredQuantity: item.preferredQuantity,
        canExpire: item.canExpire,
        date: item.expirationDate,
      });
    });

    await setDoc(docRef, {
      Items: mapItems,
    });
  };

  useEffect(() => {
    handleSave();
  }, [itemArray]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/");
  };

  const handleCancel = () => {
    setInputName("");
    setInputQuantity("");
    setInputPreferredQuantity("");
    setInputDate(new Date());
    setInputCanExpire(false);
    setItemEditing(false);
    setOverlayVisible(false);
  };

  const handleDelete = () => {
    itemArray.splice(currentItemIndex, 1);
    handleCancel();
  };

  const handleQuantityAdjust = (adjustment: number) => {
    try {
      if (adjustment == 1 || (adjustment == -1 && parseInt(inputQuantity) > 0))
        setInputQuantity((parseInt(inputQuantity) + adjustment).toString());
    } catch {
      alert("Please ensure to only adjust the quantity of valid numbers.");
    }
  };

  const handleCreateItem = () => {
    if (itemEditing) {
      itemArray.splice(
        currentItemIndex,
        1,
        new Item(
          inputName,
          parseInt(inputQuantity),
          parseInt(inputPreferredQuantity),
          inputCanExpire,
          inputDate
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
          inputCanExpire,
          inputDate
        ),
      ]);
    }
  };

  function isNumber(num: string) {
    return (
      !isNaN(parseInt(num)) && isFinite(parseInt(num)) && parseInt(num) >= 0
    );
  }

  function expiryWarning(item: Item): boolean {
    let currentDate = new Date();
    let expirationDate = item.expirationDate;
    let expirationWarningDate = new Date(
      expirationDate.getTime() - EXPIRY_PERIOD * 24 * 60 * 60 * 1000
    );

    return expirationWarningDate.getTime() < currentDate.getTime();
  }

  const handleConfirm = () => {
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
      handleCreateItem();
      setOverlayVisible(false);
      setInputName("");
      setInputQuantity("");
      setInputPreferredQuantity("");
      setInputDate(new Date());
      setInputCanExpire(false);
    }
  };

  return (
    <>
      {userInfo == null && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating={userInfo == null}
            size="large"
            color={Colors.blue}
          />
        </View>
      )}
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Search box */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBox}
              onChangeText={setSearch}
              value={search}
              placeholder="Search"
              selectionColor={Colors.link}
            />
            <FontAwesome
              //style={{ position: "absolute", alignSelf: "center", right: 0 }}
              name="search"
              size={22}
              color="black"
            />
          </View>
          {/* Horizontal line */}
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1,
              width: "85%",
              marginTop: 20,
            }}
          />

          {/* ITEM LIST */}
          {itemArray
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <Pressable
                key={itemArray.indexOf(item)}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? Colors.highlightedMinor
                      : "white",
                  },
                  styles.itemBox,
                ]}
                onPress={() => {
                  setCurrentItemIndex(itemArray.indexOf(item));
                  setItemEditing(true);
                  setInputName(item.name);
                  setInputQuantity(item.quantity.toString());
                  setInputPreferredQuantity(item.preferredQuantity.toString());
                  setInputCanExpire(item.canExpire);
                  setInputDate(item.expirationDate);
                  setOverlayVisible(true);
                }}
              >
                <Text style={styles.itemText} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  {expiryWarning(item) && item.canExpire && (
                    <FontAwesome
                      style={{ textAlignVertical: "center", paddingRight: 10 }}
                      name="hourglass-o"
                      size={22}
                      color="red"
                    />
                  )}
                  <View style={styles.itemQuantityBox}>
                    <Text style={styles.itemQuantityText}>
                      <Text
                        style={[
                          styles.itemQuantityText,
                          {
                            color:
                              item.quantity < item.preferredQuantity
                                ? "red"
                                : "black",
                          },
                        ]}
                      >
                        {item.quantity}
                      </Text>
                      <Text style={styles.itemQuantityText}>
                        {" "}
                        / {item.preferredQuantity}
                      </Text>
                    </Text>
                  </View>
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
            <FontAwesome
              style={{ textAlignVertical: "center" }}
              name="plus"
              size={22}
              color="black"
            />
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
            isVisible={overlayVisible}
            overlayStyle={styles.overlayContainer}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.innerOverlayContainer}
            >
              {/* NAME */}
              <TextInput
                style={styles.longInput}
                onChangeText={setInputName}
                value={inputName}
                placeholder="Name"
                selectionColor={Colors.link}
              />
              {/* QUANTITY */}
              <View style={styles.modalContainer}>
                <TextInput
                  style={[styles.longInput, { width: null }]}
                  maxLength={5}
                  onChangeText={setInputQuantity}
                  value={inputQuantity}
                  placeholder="..."
                  selectionColor={Colors.link}
                  keyboardType="number-pad"
                />
                <Pressable
                  onPress={() => handleQuantityAdjust(-1)}
                  style={styles.cancelButton}
                >
                  <FontAwesome name="minus" size={22} color="black" />
                </Pressable>
                <Pressable
                  onPress={() => handleQuantityAdjust(1)}
                  style={styles.cancelButton}
                >
                  <FontAwesome name="plus" size={22} color="black" />
                </Pressable>
              </View>
              {/* PREFERRED QUANTITY */}
              <TextInput
                style={styles.longInput}
                maxLength={5}
                onChangeText={setInputPreferredQuantity}
                value={inputPreferredQuantity}
                placeholder="Preferred Quantity"
                selectionColor={Colors.link}
                keyboardType="number-pad"
              />
              <View style={styles.modalContainer}>
                {/* DATE */}
                <Pressable
                  style={[styles.longInput, { width: null }]}
                  onPress={() => {
                    if (inputCanExpire) {
                      setDateVisible(true);
                    } else {
                      alert(
                        "Please ensure to select whether an expiry date is applicable to this item before trying to change its expiry date."
                      );
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.inputText,
                      { color: inputCanExpire ? "black" : "#969696" },
                    ]}
                  >
                    {inputCanExpire == false
                      ? "-- / -- / ----"
                      : dateVisible == true
                      ? "Loading..."
                      : inputDate
                          .getDate()
                          .toString()
                          .concat(
                            " / ",
                            (inputDate.getMonth() + 1).toString(),
                            " / ",
                            inputDate.getFullYear().toString()
                          )}
                  </Text>
                </Pressable>
                {/* N/A */}
                <Pressable
                  onPress={() => setInputCanExpire(!inputCanExpire)}
                  style={[
                    styles.cancelButton,
                    {
                      backgroundColor: inputCanExpire
                        ? "white"
                        : Colors.highlightedMinor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
                      {
                        fontFamily: inputCanExpire
                          ? "Inter-Regular"
                          : "Inter-Bold",
                      },
                    ]}
                  >
                    N/A
                  </Text>
                </Pressable>
              </View>
              <DatePicker
                modal
                mode="date"
                title={null}
                open={dateVisible}
                date={inputDate}
                onConfirm={(date) => {
                  setDateVisible(false);
                  setInputDate(date);
                }}
                onCancel={() => setDateVisible(false)}
              />
              <View style={[styles.modalContainer, { marginVertical: 10 }]}>
                {/* CONFIRM */}
                <Pressable onPress={handleConfirm} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </Pressable>
                {/* CANCEL */}
                <Pressable onPress={handleCancel} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
              {itemEditing && (
                <Pressable onPress={handleDelete} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete Item</Text>
                </Pressable>
              )}
            </KeyboardAvoidingView>
          </Overlay>
        </ScrollView>
      </SafeAreaView>
    </>
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
  searchContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18.5,
    borderRadius: 0,
    width: "85%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overlayContainer: {
    width: "85%",
    borderRadius: 13,
  },
  innerOverlayContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBox: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    width: "85%",
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
  inputText: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: "#969696",
  },
  confirmButton: {
    padding: 18.5,
    borderRadius: 13,
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
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: "black",
  },
  deleteButton: {
    width: "90%",
    padding: 18.5,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "red",
    alignItems: "center",
    backgroundColor: "white",
    marginVertical: 10,
  },
  deleteButtonText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "red",
  },
});
