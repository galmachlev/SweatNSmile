import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { User } from '../../types/user';
import { Picker } from '@react-native-picker/picker';

const cities = [
    "Tel Aviv", "Jerusalem", "Haifa", "Rishon LeZion", "Petah Tikva",
    "Ashdod", "Netanya", "Beer Sheva", "Bnei Brak", "Holon"
];
const streets = [
    "Rothschild", "Ben Yehuda", "Allenby", "Dizengoff", "Herzl",
    "King George", "Beit Habad", "Yaffo", "Bialik", "Haim Ozer"
];

export default function Register_BasicDetails_1() {
    const navigation = useNavigation();

    function validate(values: Partial<User>) {
        const errors: Partial<User> = {};
      
        if (!/^[A-Za-z\s]{2,50}$/.test(values.firstName ?? '')) {
            errors.firstName = 'Invalid first name';
        }

        if (!/^[A-Za-z\s]{2,50}$/.test(values.lastName ?? '')) {
            errors.lastName = 'Invalid last name';
        }

        if (!/^(05\d)-\d{7}$/g.test(values.phoneNumber ?? '')) {
            errors.phoneNumber = 'Invalid phone number';
        }

        const today = new Date();
        const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); 
        const selectedDate = new Date(values.birthDate ?? '');
        if (selectedDate > minDate) {
            errors.birthDateValidate = 'Invalid birth date';
        }

        if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(values.password ?? '')) {
            errors.password = 'Invalid password';
        }
        
        // if (values.address) {
        //     if (!cities.includes(values.address.city)) {
        //         errors.address = { ...errors.address, city: 'Invalid city' };
        //     }
        //     if (!streets.includes(values.address.street)) {
        //         errors.address = { ...errors.address, street: 'Invalid street' };
        //     }
        // }
                
        return errors;
    }

    const formik = useFormik<Partial<User>>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthDate: new Date(),
            birthDateValidate: '',
            phoneNumber: '',
            address: { 
                country: '',
                city: '',
                street: '',
                houseNum: 0,
                postalCode: 0,
                comments: ''
            },
            img: '',
        },
        validate,
        onSubmit: (values) => {
            console.log(values);
            navigation.navigate('Register_PhysicalData_2', values);
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('firstName')}
                value={formik.values.firstName}
                placeholder="First Name"
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('lastName')}
                value={formik.values.lastName}
                placeholder="Last Name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('email')}
                value={formik.values.email}
                placeholder="Email"
            />
            
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('phoneNumber')}
                value={formik.values.phoneNumber}
                placeholder="Phone Number"
            />
            
            <Text style={styles.label}>Birth Date</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('birthDate')}
                value={formik.values.birthDate?.toISOString().split('T')[0] ?? ''}
                placeholder="YYYY-MM-DD"
            />
            
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('password')}
                value={formik.values.password}
                placeholder="Password"
                secureTextEntry
            />

            <Text style={styles.label}>Country</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('address.country')}
                value={formik.values.address?.country}
                placeholder="Country"
            />

            <Text style={styles.label}>City</Text>
            <Picker
                selectedValue={formik.values.address?.city}
                onValueChange={value => formik.setFieldValue('address.city', value)}
                style={styles.input}
            >
                {cities.map(city => <Picker.Item key={city} label={city} value={city} />)}
            </Picker>

            <Text style={styles.label}>Street</Text>
            <Picker
                selectedValue={formik.values.address?.street}
                onValueChange={value => formik.setFieldValue('address.street', value)}
                style={styles.input}
            >
                {streets.map(street => <Picker.Item key={street} label={street} value={street} />)}
            </Picker>

            <Text style={styles.label}>House Number</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('address.houseNum')}
                value={formik.values.address?.houseNum?.toString()}
                placeholder="House Number"
            />

            <Text style={styles.label}>Postal Code</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('address.postalCode')}
                value={formik.values.address?.postalCode?.toString()}
                placeholder="Postal Code"
            />

            <Text style={styles.label}>Comments</Text>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('address.comments')}
                value={formik.values.address?.comments}
                placeholder="Comments"
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
