import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import { User } from '../../types/user';

const cities = [
    "Tel Aviv", "Jerusalem", "Haifa", "Rishon LeZion", "Petah Tikva",
    "Ashdod", "Netanya", "Beer Sheva", "Bnei Brak", "Holon"
];
const streets = [
    "Rothschild", "Ben Yehuda", "Allenby", "Dizengoff", "Herzl",
    "King George", "Beit Habad", "Yaffo", "Bialik", "Haim Ozer"
];


const Register = () => {
    
    const [cityPickerOpen, setCityPickerOpen] = useState(false);
    const [streetPickerOpen, setStreetPickerOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const swiperRef = React.useRef<Swiper>(null);
    const navigation = useNavigation();

    const screenTitles = [
        'Basic Details',
        'Physical Details',
        'Activity Level',
        'Congratulations'
    ];
    const SendToDb = async () => {
        //לשנות את זה בהתאם לרנדר
        let res = await fetch('http://89.207.132.170:3000/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formik.values)
        });
        let data = await res.json();
        console.log(data);
        navigation.navigate('Login' as never);
    }

    useEffect(() => {
        navigation.setOptions({ headerTitle: screenTitles[currentIndex] });
    }, [currentIndex, navigation]);

    const validate = (values: Partial<User>) => {
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
                
        return errors;
    };

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
            if (swiperRef.current) {
                swiperRef.current.scrollBy(1); // Move swiper to the next screen
            }
        },
    });

    return (
        <View style={styles.container}>
            <Swiper
                ref={swiperRef}
                loop={false}
                showsButtons={false}
                showsPagination={false}
                onIndexChanged={(index) => navigation.setOptions({ headerTitle: screenTitles[index] })}
            >

                {/********************************** Screen 1 **********************************/}
                
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.screenContainer}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('firstName')}
                            value={formik.values.firstName ?? ''}
                            placeholder="First Name"
                        />
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('lastName')}
                            value={formik.values.lastName ?? ''}
                            placeholder="Last Name"
                        />
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('email')}
                            value={formik.values.email ?? ''}
                            placeholder="Email"
                        />
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('phoneNumber')}
                            value={formik.values.phoneNumber ?? ''}
                            placeholder="Phone Number"
                        />
                        <Text style={styles.label}>Birth Date</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('birthDate')}
                            value={formik.values.birthDate ? formik.values.birthDate.toISOString().split('T')[0] : ''}
                            placeholder="YYYY-MM-DD"
                        />
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('password')}
                            value={formik.values.password ?? ''}
                            placeholder="Password"
                            secureTextEntry
                        />
                        <Text style={styles.label}>Country</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('address.country')}
                            value={formik.values.address?.country ?? ''}
                            placeholder="Country"
                        />
                        <TouchableOpacity onPress={() => setCityPickerOpen(!cityPickerOpen)}>
                            <Text style={styles.label}>City</Text>
                            <Text style={styles.input}>{formik.values.address?.city ?? ''}</Text>
                        </TouchableOpacity>
                        {cityPickerOpen && (
                            <Picker
                                selectedValue={formik.values.address?.city}
                                onValueChange={value => formik.setFieldValue('address.city', value)}
                                style={styles.picker}
                            >
                                {cities.map(city => <Picker.Item key={city} label={city} value={city} />)}
                            </Picker>
                        )}
                        <TouchableOpacity onPress={() => setStreetPickerOpen(!streetPickerOpen)}>
                            <Text style={styles.label}>Street</Text>
                            <Text style={styles.input}>{formik.values.address?.street ?? ''}</Text>
                        </TouchableOpacity>
                        {streetPickerOpen && (
                            <Picker
                                selectedValue={formik.values.address?.street}
                                onValueChange={value => formik.setFieldValue('address.street', value)}
                                style={styles.picker}
                            >
                                {streets.map(street => <Picker.Item key={street} label={street} value={street} />)}
                            </Picker>
                        )}
                        <Text style={styles.label}>House Number</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('address.houseNum')}
                            value={formik.values.address?.houseNum?.toString() ?? ''}
                            placeholder="House Number"
                        />
                        <Text style={styles.label}>Postal Code</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('address.postalCode')}
                            value={formik.values.address?.postalCode?.toString() ?? ''}
                            placeholder="Postal Code"
                        />
                        <Text style={styles.label}>Comments</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('address.comments')}
                            value={formik.values.address?.comments ?? ''}
                            placeholder="Comments"
                        />
                        <Button title="Next" onPress={() => swiperRef.current?.scrollBy(1)} />
                    </View>
                </ScrollView>

                {/********************************** Screen 2 **********************************/}
                
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.screenContainer}>
                        <Text style={styles.label}>Gender</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('gender')}
                            value={formik.values.gender ?? ''}
                            placeholder="Gender"
                        />
                        <Text style={styles.label}>Height (cm)</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('height')}
                            value={formik.values.height ? formik.values.height.toString() : ''}
                            placeholder="Height"
                            keyboardType="numeric"
                        />
                        <Text style={styles.label}>Current Weight (kg)</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('currentWeight')}
                            value={formik.values.currentWeight ? formik.values.currentWeight.toString() : ''}
                            placeholder="Current Weight"
                            keyboardType="numeric"
                        />
                        <Text style={styles.label}>Goal Weight (kg)</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('goalWeight')}
                            value={formik.values.goalWeight ? formik.values.goalWeight.toString() : ''}
                            placeholder="Goal Weight"
                            keyboardType="numeric"
                        />
                        <Text style={styles.label}>Goal Date</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('goalDate')}
                            value={formik.values.goalDate ? formik.values.goalDate.toISOString().split('T')[0] : ''}
                            placeholder="YYYY-MM-DD"
                        />
                        <Button title="Next" onPress={() => swiperRef.current?.scrollBy(1)} />
                    </View>
                </ScrollView>

                {/********************************** Screen 3 **********************************/}

                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.screenContainer}>
                        <Text style={styles.label}>Activity Level</Text>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="sedentary"
                                status={formik.values.activityLevel === 'sedentary' ? 'checked' : 'unchecked'}
                                onPress={() => formik.setFieldValue('activityLevel', 'sedentary')}
                            />
                            <Text style={styles.radioButtonLabel}>Sedentary (little or no exercise)</Text>
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="light"
                                status={formik.values.activityLevel === 'light' ? 'checked' : 'unchecked'}
                                onPress={() => formik.setFieldValue('activityLevel', 'light')}
                            />
                            <Text style={styles.radioButtonLabel}>Lightly Active (light exercise/sports 1-3 days/week)</Text>
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="moderate"
                                status={formik.values.activityLevel === 'moderate' ? 'checked' : 'unchecked'}
                                onPress={() => formik.setFieldValue('activityLevel', 'moderate')}
                            />
                            <Text style={styles.radioButtonLabel}>Moderately Active (moderate exercise/sports 3-5 days/week)</Text>
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="active"
                                status={formik.values.activityLevel === 'active' ? 'checked' : 'unchecked'}
                                onPress={() => formik.setFieldValue('activityLevel', 'active')}
                            />
                            <Text style={styles.radioButtonLabel}>Active (hard exercise/sports 6-7 days a week)</Text>
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="veryActive"
                                status={formik.values.activityLevel === 'very active' ? 'checked' : 'unchecked'}
                                onPress={() => formik.setFieldValue('activityLevel', 'veryActive')}
                            />
                            <Text style={styles.radioButtonLabel}>Very Active (very hard exercise/sports & physical job)</Text>
                        </View>
                        <Button title="Next" onPress={() => swiperRef.current?.scrollBy(1)} />
                    </View>
                </ScrollView>

                {/********************************** Screen 4 **********************************/}

                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.screenContainer}>
                        <Text style={styles.label}>Daily Caloric Intake</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('caloricIntake')}
                            // value={formik.values.caloricIntake ? formik.values.caloricIntake.toString() : ''}
                            placeholder="Caloric Intake"
                            keyboardType="numeric"
                        />
                        <Button title="Submit" onPress={() => SendToDb()}/>
                    </View>
                </ScrollView>

            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioButtonLabel: {
        marginLeft: 8,
    },
    picker: {
        height: 200,
        width: '100%',
    },
});

export default Register;
