import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Overlay } from "@rneui/themed";

import { GeneralStyles } from "@/constants/GeneralStyles";
import { Colors } from "@/constants/Colors";

const home = () => {
  const [search, setSearch] = useState("");

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
    new Item("N95", 3, 5, true, new Date(2025, 1, 1)),
    new Item("N95", 3, 5, true, new Date(2025, 1, 1)),
    new Item("N95", 3, 5, true, new Date(2025, 1, 1)),
    new Item("N95", 3, 5, true, new Date(2025, 1, 1)),
    new Item("N95", 3, 5, true, new Date(2025, 1, 1)),
    new Item("N95", 3, 5, true, new Date(2025, 1, 1)),
    new Item("N95", 3, 5, true, new Date(2025, 1, 1)),
  ]);

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

        <View style={styles.itemBox}>
          <Text
            style={[styles.itemText, { fontFamily: "Inter-Bold" }]}
            numberOfLines={1}
          >
            Add Item
          </Text>
        </View>

        {/*
        <Overlay isVisible={true}>
          <Text>Hello world!</Text>
        </Overlay>
        */}

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
});
