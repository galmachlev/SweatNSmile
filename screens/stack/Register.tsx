/*
 * This component is the registration screen of the app.
 * It displays a swiper with 4 slides.
 * The first slide is a welcome message.
 * The second slide is a form to input the user's first name, last name, email and password.
 * The third slide is a form to input the user's gender, height and weight.
 * The fourth slide is a form to input the user's birth date and activity level.
 * After the user fills in all the forms, the component navigates to the HomeScreen.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
import { useFormik } from 'formik';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { User } from '../../types/user';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export type RootStackParamList = {
    OnBoarding: undefined;
    HomeScreen: undefined;
    DailyCalories: undefined;
    Register: undefined;
    Gallery: undefined;
    Profile: undefined;
    AllMenusTable: undefined;
    HomeStore: undefined;
    Login: undefined ;
};
const cities = [
    "Tel Aviv", "Jerusalem", "Haifa", "Rishon LeZion", "Petah Tikva",
    "Ashdod", "Netanya", "Beer Sheva", "Bnei Brak", "Holon"
];
const streets = [
    "Rothschild", "Ben Yehuda", "Allenby", "Dizengoff", "Herzl",
    "King George", "Beit Habad", "Yaffo", "Bialik", "Haim Ozer"
];

type CustomCheckboxProps = {
    checked: boolean;
    onPress: () => void;
  };
  
const CustomCheckbox = ({ checked, onPress }: CustomCheckboxProps) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Icon name="check" size={16} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
);  

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
    };

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
                        
                        {/* page intro */}
                        <View style={styles.screenTitleContainer}>
                            <Text style={styles.screenPageTitle1}>Hey new user! </Text>
                            <Text style={styles.screenPageTitle2}>please fill the following information</Text>
                        </View>
                        {/* first name */}
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('firstName')}
                            value={formik.values.firstName ?? ''}
                            placeholder="John"
                        />
                        {/* last name */}
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('lastName')}
                            value={formik.values.lastName ?? ''}
                            placeholder="Doe"
                        />
                        {/* email */}
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('email')}
                            value={formik.values.email ?? ''}
                            placeholder="John123@example.com"
                            keyboardType="email-address"
                        />
                        {/* phone number */}
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('phoneNumber')}
                            value={formik.values.phoneNumber ?? ''}
                            placeholder="054-1234567"
                            keyboardType="phone-pad"
                        />
                        {/* birth date */}
                        <Text style={styles.label}>Birth Date</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('birthDate')}
                            value={formik.values.birthDate ? formik.values.birthDate.toISOString().split('T')[0] : ''}
                            placeholder="YYYY-MM-DD"
                            keyboardType="numeric"
                        />
                        {/* password */}
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('password')}
                            value={formik.values.password ?? ''}
                            placeholder="********"
                            secureTextEntry
                        />
                        {/* next button */}
                        <TouchableOpacity style={styles.nextButton} onPress={() => swiperRef.current?.scrollBy(1)}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                        {/* login link */}
                        <TouchableOpacity style={styles.loginLinkContainer} onPress={() => navigation.navigate('Login' as never)}>
                            <Text style={styles.loginLinkText1}>Already have an account?   <Text style={styles.loginLinkText2}>Login</Text></Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

                {/********************************** Screen 2 **********************************/}

                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.screenContainer}>

                        {/* page intro */}
                        <View style={styles.screenTitleContainer}>
                            <Text style={styles.screenPageTitle1}>Tell us a little more about yourself </Text>
                        </View>
                        {/* gender */}
                        <Text style={styles.label}>Please select your gender</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    formik.values.gender === 'male' && styles.selectedButton,
                                    styles.leftButton
                                ]}
                                onPress={() => formik.setFieldValue('gender', 'male')}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    formik.values.gender === 'male' && { color: '#fff' }
                                ]}>
                                    Male
                                </Text>
                            </TouchableOpacity>

                            {/* divider */}
                            <View style={styles.divider} />

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    formik.values.gender === 'female' && styles.selectedButton,
                                    styles.rightButton
                                ]}
                                onPress={() => formik.setFieldValue('gender', 'female')}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    formik.values.gender === 'female' && { color: '#fff' }
                                ]}>
                                    Female
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* height */}
                        <Text style={styles.label}>How tall are you?</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('height')}
                            value={formik.values.height ? formik.values.height.toString() : ''}
                            placeholder="Height (cm)"
                            keyboardType="numeric"
                        />
                        {/* current weight */}
                        <Text style={styles.label}>How much do you weight?</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('currentWeight')}
                            value={formik.values.currentWeight ? formik.values.currentWeight.toString() : ''}
                            placeholder="Current Weight (kg)"
                            keyboardType="numeric"
                        />
                        {/* goal weight */}
                        <Text style={styles.label}>What’s your goal weight?</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('goalWeight')}
                            value={formik.values.goalWeight ? formik.values.goalWeight.toString() : ''}
                            placeholder="Goal Weight (kg)"
                            keyboardType="numeric"
                        />
                        {/* goal date */}
                        <Text style={styles.label}>What's your target date to reach your goal?</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('goalDate')}
                            value={formik.values.goalDate ? formik.values.goalDate.toISOString().split('T')[0] : ''}
                            placeholder="YYYY-MM-DD"
                            keyboardType="numeric"
                        />
                        {/* next button */}
                        <TouchableOpacity style={styles.nextButton} onPress={() => swiperRef.current?.scrollBy(1)}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

                {/********************************** Screen 3 **********************************/}

                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.screenContainer}>

                        {/* page intro */}
                        <View style={styles.screenTitleContainer}>
                            <Text style={styles.screenPageTitle1}>What is your baseline activity level?</Text>
                            <Text style={styles.screenPageTitle2}>Please select the one that best describes you</Text>
                        </View>              
                        {/* activity level options */}
                        {['notVeryActive', 'lightlyActive', 'active', 'veryActive'].map((level) => (
                            <TouchableOpacity 
                                key={level}
                                style={[
                                    styles.activityButton,
                                    formik.values.activityLevel === level && styles.selectedActivityButton
                                ]}
                                onPress={() => formik.setFieldValue('activityLevel', level)}
                            >
                                <Text style={[
                                    styles.activityButtonTitle,
                                    formik.values.activityLevel === level && styles.selectedActivityButtonText
                                ]}>
                                    {level === 'notVeryActive' ? 'Not Very Active' :
                                    level === 'lightlyActive' ? 'Lightly Active' :
                                    level === 'active' ? 'Active' : 'Very Active'}
                                </Text>
                                <Text style={[
                                    styles.activityButtonSubtext,
                                    formik.values.activityLevel === level && styles.selectedActivityButtonText
                                ]}>
                                    {level === 'notVeryActive' ? 'sitting most of the day' :
                                    level === 'lightlyActive' ? 'spend a good part of the day on your feet' :
                                    level === 'active' ? 'spend a good part of the day doing physical activity' :
                                    'spend a most of the day doing heavy physical activity'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        {/* next button */}
                        <TouchableOpacity  style={styles.nextButton} onPress={() => swiperRef.current?.scrollBy(1)}>
                            <Text style={styles.nextButtonText}>NEXT</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

                {/********************************** Screen 4 **********************************/}

                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.screenContainer}>
                        <Text style={styles.congratulationsText}>Congratulations!</Text>
                        <Text style={styles.greetingText}>Nice to meet you <Text style={styles.userName}>John Doe{formik.values.firstName} {formik.values.lastName}</Text></Text>
                        <Text style={styles.infoText}>
                            Your custom diet plan is ready and you're one{'\n'}
                            step closer to reach your goal!
                        </Text>
                        <Text style={styles.calorieInfoText}>
                            Your daily net calorie goal is:
                        </Text>
                        {/* <Text style={styles.calorieNumber}>
                            {formik.values.caloricIntake}1710 <Text style={styles.calorieUnit}>calories</Text>
                        </Text> */}
                        
                        <View style={styles.optionsContainer}>
                            {/* <View style={styles.optionRow}>
                                <CustomCheckbox
                                    checked={formik.values.trackSteps}
                                    onPress={() => formik.setFieldValue('trackSteps', !formik.values.trackSteps)}
                                />
                                <Text style={styles.optionText}>Use my phone to track my steps</Text>
                            </View> */}
                            <View style={styles.optionRow}>
                                {/* <CustomCheckbox
                                    checked={formik.values.receiveEmails}
                                    onPress={() => formik.setFieldValue('receiveEmails', !formik.values.receiveEmails)}
                                /> */}
                                <Text style={styles.optionText}>Would you like to receive our emails?</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.nextButton} onPress={() => SendToDb()}>
                            <Text style={styles.nextButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 90,
    },
    screenTitleContainer: {
        marginTop: 10,
        marginBottom: 50
    },
    screenPageTitle1: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#696B6D',
    },
    screenPageTitle2: {
        fontSize: 14,
        textAlign: 'center',
        color: '#696B6D',
    },
    nextButton: {
        marginTop: 25,
        backgroundColor: '#3E6613',
        paddingVertical: 12,
        borderRadius: 7,
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 7,
        backgroundColor: '#fff',
        borderBlockColor: '#ccc',
        // הוספת הצללה
        shadowColor: '#000', // צבע הצל
        shadowOffset: { width: 0, height: 1.5 }, // מיקום הצל
        shadowOpacity: 0.2, // אטימות הצל
        shadowRadius: 1, // טווח הצל
        // הצללה באנדרואיד
        elevation: 2,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioButtonLabel: {
        marginLeft: 8,
        fontSize: 14,
    },
    picker: {
        height: 200,
        width: '100%',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    loginLinkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginLinkText1: {
        color: '#696B6D',
        fontSize: 14,
        fontWeight: 'bold',
    },
    loginLinkText2: {
        color: '#9AB28B',
        textDecorationLine: 'underline',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Align items vertically center
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 7,
        backgroundColor: 'white',
        shadowColor: '#000', // Color of the shadow
        shadowOffset: { width: 0, height: 1.5 }, // Shadow offset
        shadowOpacity: 0.2, // Shadow opacity
        shadowRadius: 1, // Shadow radius
        elevation: 2, // Shadow for Android
    },
    button: {
        flex: 1, // Make each button take up equal space
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    leftButton: {
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
    },
    rightButton: {
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
    },
    divider: {
        width: 3,
        height: '100%', // Adjust height to fit between buttons
        backgroundColor: '#808387', // Color of the divider
    },
    buttonText: {
        fontSize: 16,
        color: '#808387',
    },
    selectedButton: {
        backgroundColor: '#9AB28B',
    },
    selectedButtonText: {
        color: '#fff',
    },


    
      questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#696B6D',
      },
      selectedActivityButton: {
        backgroundColor: '#3E6613',
      },  
      selectedActivityButtonText: {
        color: 'white',
      },      
      activityButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      activityButtonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#696B6D',
      },
      activityButtonSubtext: {
        fontSize: 14,
        color: '#696B6D',
      },


      checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#808080',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      },
      checked: {
        backgroundColor: '#3E6613', // צבע ירוק כהה
        borderColor: '#3E6613',
      },    
      congratulationsText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#808080', // צבע אפור כהה
        textAlign: 'center',
        marginBottom: 10,
      },
      greetingText: {
        fontSize: 24,
        color: '#808080', // צבע אפור כהה
        textAlign: 'center',
        marginVertical: 20,
      },
      userName: {
          color: '#3E6613', // צבע ירוק כהה
          fontWeight: 'bold',
      },
      infoText: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'center',
        marginTop: 40,
      },
      calorieInfoText: {
        fontSize: 18,
        color: '#808080',
        textAlign: 'center',
        marginTop: 70,
      },
      calorieNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3E6613', // צבע ירוק כהה
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 15,
      },
      calorieUnit: {
        fontSize: 16,
        fontWeight: 'normal',
      },
      optionsContainer: {
        alignSelf: 'stretch',
        marginTop: 80,
        marginBottom: 20,
      },
      optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      optionText: {
        fontSize: 14,
        color: '#808080',
        marginLeft: 10,
      },    
});

export default Register;
