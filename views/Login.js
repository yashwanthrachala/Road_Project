import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Login = ({ setIsLoggedIn }) => {
    const auth = getAuth();
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const onSubmit = () => {
        signInAnonymously(auth).then(() => {
            setIsLoggedIn(true);
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
            />
            <TouchableOpacity style={styles.button} onPress={onSubmit}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        height: 40,  // Adjusted height
        width: '100%',  // Occupy entire width
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Login;
