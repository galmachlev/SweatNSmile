import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView,Image, Alert } from 'react-native';
import Swiper from 'react-native-swiper';
import { useFormik } from 'formik';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { User } from '../../types/user';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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
 
const Register = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const swiperRef = React.useRef<Swiper>(null);
    const navigation = useNavigation();
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined); // שמירה כ- Date או undefined
    const [targetDate, setTargetDate] = useState<Date | undefined>(undefined); // שמירה כ- Date או undefined

    const handleDateChange = (event: any, selectedDate: Date | undefined, setter: React.Dispatch<React.SetStateAction<Date | undefined>>) => {
        if (selectedDate) {
            setter(selectedDate);  // עדכון התאריך אם נבחר
        }
    };

    const screenTitles = [
        'Basic Details',
        'Physical Details',
        'Activity Level',
        'Congratulations'
    ];

    const SendToDb = async () => {
        try {
            const user = {
                firstName: formik.values.firstName,
                lastName: formik.values.lastName,
                email: formik.values.email,
                password: formik.values.password,
                phoneNumber: formik.values.phoneNumber,
                startWeight: formik.values.startWeight
                    ? parseFloat(formik.values.startWeight.toString())
                    : parseFloat(formik.values.currentWeight?.toString() || '0'),
                currentWeight: formik.values.currentWeight
                    ? parseFloat(formik.values.currentWeight.toString())
                    : formik.values.startWeight
                    ? parseFloat(formik.values.startWeight.toString())
                    : 0,
                goalWeight: formik.values.goalWeight
                    ? parseFloat(formik.values.goalWeight.toString())
                    : undefined,
                gender: formik.values.gender ?? '',
                height: formik.values.height
                    ? parseFloat(formik.values.height.toString())
                    : undefined,
                targetDate: targetDate,
                activityLevel: formik.values.activityLevel ?? '',
                profileImageUrl: profileImageUri,
                isAdmin: false,
                dateOfBirth: dateOfBirth,
            };
            console.log(user);

            let res = await fetch('https://database-s-smile.onrender.com/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                let data = await res.json();
                if (res.status === 201) {
                    alert('User added successfully!\nPlease Login to continue.');
                    navigation.navigate('Login' as never);
                } else {
                    alert(`Error: ${data.error || 'Failed to add user'}`);
                }
            } else {
                const text = await res.text();
                alert('An error occurred. Please check the server.');
            }
        } catch (error) {
            alert('An error occurred while adding the user.');
        }
    };
            
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Camera roll permissions are needed to select a profile image.');
            return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        if (!result.canceled && result.assets.length > 0) {
            setProfileImageUri(result.assets[0].uri);
        }
    };
    
    useEffect(() => {
        navigation.setOptions({ headerTitle: screenTitles[currentIndex] });
    }, [currentIndex, navigation]);

    const validate = (values: Partial<User>) => {
        const errors: Partial<Record<keyof User, string>> = {};

        // Validate first name
        if (values.firstName && !/^[A-Za-z\s]{2,50}$/.test(values.firstName)) {
            errors.firstName = 'Invalid first name';
        } else if (!values.firstName) {
            errors.firstName = 'First name is required';
        }

        // Validate last name
        if (values.lastName && !/^[A-Za-z\s]{2,50}$/.test(values.lastName)) {
            errors.lastName = 'Invalid last name';
        } else if (!values.lastName) {
            errors.lastName = 'Last name is required';
        }

        // Validate phone number
        if (values.phoneNumber && !/^(05\d)-\d{7}$/.test(values.phoneNumber)) {
            errors.phoneNumber = 'Invalid phone number';
        } else if (!values.phoneNumber) {
            errors.phoneNumber = 'Phone number is required';
        }

        // Validate password
        if (values.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/.test(values.password)) {
            errors.password = 'Invalid password (min 6 chars, letters and numbers required)';
        } else if (!values.password) {
            errors.password = 'Password is required';
        }

        // Validate height
        if (values.height !== undefined && (isNaN(values.height) || values.height <= 0)) {
            errors.height = 'Height must be a positive number';
        }

        if (values.startWeight === undefined || isNaN(values.startWeight) || values.startWeight <= 0) {
            errors.startWeight = 'Start weight is required and must be a positive number';
        }

        // Validate current weight
        if (values.currentWeight === undefined || isNaN(values.currentWeight) || values.currentWeight <= 0) {
            errors.currentWeight = 'Current weight must be a positive number';
        }

        // Validate goal weight (optional)
        if (values.goalWeight !== undefined && (isNaN(values.goalWeight) || values.goalWeight <= 0)) {
            errors.goalWeight = 'Goal weight must be a positive number';
        }

        // Validate dateOfBirth
        if (!values.dateOfBirth) { // אם dateOfBirth לא הוגדר
            errors.dateOfBirth = 'Date of birth is required';
        } else if (!(values.dateOfBirth instanceof Date) || isNaN(values.dateOfBirth.getTime())) {
            errors.dateOfBirth = 'Invalid date format';
        } else if (values.dateOfBirth > new Date()) {
            errors.dateOfBirth = 'Date of birth cannot be in the future';
        }

        // Validate targetDate
        if (values.targetDate !== undefined && !(values.targetDate instanceof Date)) {
            errors.targetDate = 'Invalid date format, must be a Date object';
        } else if (values.targetDate && values.targetDate < new Date()) {
            errors.targetDate = 'Target date cannot be in the past';
        }

        return errors;
    };
    

    const formik = useFormik<Partial<User>>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: '',
            profileImageUrl: '',
            gender: undefined,
            height: undefined,
            startWeight: undefined,
            currentWeight: undefined,
            goalWeight: undefined,
            age: 0,       
            dailyCalories: undefined,
        },
        validate,
        onSubmit: (values) => {
            console.log(values); 
            if (swiperRef.current) {
                swiperRef.current.scrollBy(1); 
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
                        {/* Date of Birth */}
                        <Text style={styles.label}>Date of Birth</Text>
                        <DateTimePicker
                            value={dateOfBirth || new Date()} // אם התאריך לא מוגדר, השתמש בתאריך נוכחי
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (event.type === 'set' && selectedDate) {
                                    handleDateChange(event, selectedDate, setDateOfBirth);
                                }
                            }}
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
                        <Text style={styles.label}>Profile Image</Text>
                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            {profileImageUri ? (
                                <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
                            ) : (
                                <Text style={styles.imagePickerText}>Upload Profile Image</Text>
                            )}
                        </TouchableOpacity>
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
                        {/* target date */}
                        <Text style={styles.label}>Target Date</Text>
                        <DateTimePicker
                            value={targetDate || new Date()} // אם התאריך לא מוגדר, השתמש בתאריך נוכחי
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (event.type === 'set' && selectedDate) {
                                    console.log('Selected Date:', selectedDate);
                                    handleDateChange(event, selectedDate, setTargetDate);
                                }
                            }}
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
                        {/* ברכה אישית למשתמש */}
                        <Text style={styles.greetingText}>
                            Final Step!
                        </Text>

                        {/* מידע על השלב הבא */}
                        <Text style={styles.infoText}>
                            After submitting, we'll verify your details and prepare your custom diet plan 🚀{'\n'}
                            Soon, you'll be ready to access your dashboard and start your journey to a healthier lifestyle!
                        </Text>

                        {/* כפתור מעבר לדף הבית */}
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => {
                                SendToDb(); // שמירת הנתונים או ביצוע פעולה עם ה-DB
                            }}
                        >
                            <Text style={styles.nextButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>               
                </ScrollView>
            </Swiper>
        </View>
    );
};

// סטיילים
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
        backgroundColor: '#3E6613',
    },
    selectedButtonText: {
        color: '#fff',
    },
    datePicker: {
        width: 200,
        marginBottom: 20,
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
      congratulationsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#808080', // צבע אפור כהה
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 50,
      },
      greetingText: {
        fontSize: 24,
        color: '#808080', // צבע אפור כהה
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 100,
      },
      infoText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#808080',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 163,
      },
      userName: {
          color: '#3E6613', // צבע ירוק כהה
          fontWeight: 'bold',
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
      imagePicker: {
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 7,
        backgroundColor: '#ddd',
    },
    imagePickerText: {
        color: '#555',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },  
});

export default Register;
