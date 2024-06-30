import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User } from '../../types/user';
import { RootStackParamList } from '../../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { RadioButton } from 'react-native-paper';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register_ActivityLevel_3'>;

export default function Register_ActivityLevel_3() {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const route = useRoute();
    const initialValues = route.params as Partial<User>;

    const formik = useFormik<Partial<User>>({
        initialValues: {
            activityLevel: 'sedentary',
        },
        onSubmit: (values) => {
            const completeUserData = { ...initialValues, ...values };
            console.log(completeUserData);
            // registerUser(completeUserData);
            Alert.alert("User registered successfully!");
            // navigation.navigate('Login');
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>What is your baseline activity level?</Text>
            <Text style={styles.subtitle}>Please select the one that best describes you</Text>

            <RadioButton.Group
                onValueChange={value => formik.setFieldValue('activityLevel', value)}
                value={formik.values.activityLevel}
            >
                <View style={styles.radioButtonContainer}>
                    <RadioButton value="sedentary" />
                    <Text style={styles.radioButtonLabel}>
                        Not Very Active {'\n'} <Text style={styles.radioButtonDescription}>sitting most of the day</Text>
                    </Text>
                </View>
                <View style={styles.radioButtonContainer}>
                    <RadioButton value="light" />
                    <Text style={styles.radioButtonLabel}>
                        Lightly Active {'\n'} <Text style={styles.radioButtonDescription}>spend a good part of the day on your feet</Text>
                    </Text>
                </View>
                <View style={styles.radioButtonContainer}>
                    <RadioButton value="moderate" />
                    <Text style={styles.radioButtonLabel}>
                        Moderately Active {'\n'} <Text style={styles.radioButtonDescription}>spend a good part of the day doing physical activity</Text>
                    </Text>
                </View>
                <View style={styles.radioButtonContainer}>
                    <RadioButton value="active" />
                    <Text style={styles.radioButtonLabel}>
                        Active {'\n'} <Text style={styles.radioButtonDescription}>spend a good part of the day doing physical activity</Text>
                    </Text>
                </View>
                <View style={styles.radioButtonContainer}>
                    <RadioButton value="very active" />
                    <Text style={styles.radioButtonLabel}>
                        Very Active {'\n'} <Text style={styles.radioButtonDescription}>spend a most of the day doing heavy physical activity</Text>
                    </Text>
                </View>
            </RadioButton.Group>

            <Button title="Next" onPress={formik.handleSubmit as any} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    radioButtonLabel: {
        fontSize: 16,
    },
    radioButtonDescription: {
        fontSize: 12,
        color: 'gray',
    },
});
