/*
 * This component renders a login screen for the user.
 * It consists of a form with two TextInput fields for the user's email and password,
 * a Button to submit the form,
 * and a TouchableOpacity to navigate to the Register screen.
 * The component uses the useUser hook to get the login function from the UserContext,
 * and the useNavigation hook to get the navigation object.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { login } = useUser();
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={() => login(email, password)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                {/* Register link */}
                <TouchableOpacity style={styles.RegisterLinkContainer} onPress={() => navigation.navigate('Register' as never)}>
                    <Text style={styles.RegisterLinkText1}>Don't have an account?   <Text style={styles.RegisterLinkText2}>Register</Text></Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#696B6D',
        marginTop: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    button: {
        marginTop: 50,
        backgroundColor: '#3E6613',
        paddingVertical: 12,
        borderRadius: 7,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    RegisterLinkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    RegisterLinkText1: {
        color: '#696B6D',
        fontSize: 14,
        fontWeight: 'bold',
    },
    RegisterLinkText2: {
        color: '#9AB28B',
        textDecorationLine: 'underline',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
