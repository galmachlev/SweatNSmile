import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User } from '../../types/user';
import { RootStackParamList } from '../../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register_PhysicalData_2'>;

export default function Register_PhysicalData_2() {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const route = useRoute();
    const initialValues = route.params as Partial<User>;

    const formik = useFormik<Partial<User>>({
        initialValues: {
            gender: '',
            height: 0,
            currentWeight: 0,
            goalWeight: 0,
            goalDate: new Date(),
        },
        onSubmit: (values) => {
            const completeUserData = { ...initialValues, ...values };
            console.log(completeUserData);
            navigation.navigate('Register_ActivityLevel_3', completeUserData);
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('gender')}
                value={formik.values.gender}
                placeholder="Gender"
            />

            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('height')}
                value={formik.values.height.toString()}
                placeholder="Height"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Current Weight (kg)</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('currentWeight')}
                value={formik.values.currentWeight.toString()}
                placeholder="Current Weight"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Goal Weight (kg)</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('goalWeight')}
                value={formik.values.goalWeight.toString()}
                placeholder="Goal Weight"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Goal Date</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('goalDate')}
                value={formik.values.goalDate.toISOString().split('T')[0]}
                placeholder="YYYY-MM-DD"
            />

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
    label: {
        marginVertical: 8,
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    }
});
