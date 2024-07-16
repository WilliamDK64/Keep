import { StyleSheet } from 'react-native';

import { Colors } from './Colors';

export const GeneralStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
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
});