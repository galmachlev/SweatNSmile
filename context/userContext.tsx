import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { User } from '../types/user';

// Define the RootStackParamList type for navigation
type RootStackParamList = {
    OnBoarding: undefined;
    HomeScreen: undefined;
    DailyCalories: undefined;
    Register: undefined;
    Gallery: undefined;
    Profile: undefined;
    AllMenusTable: undefined;
    HomeStore: undefined;
    Login: undefined;
    HomeAdmin: undefined;
};

// Define the context type
type UserContextType = {
    login: (email: string, password: string) => Promise<void>;
    currentUser: User | null;
    users: User[];
    fetchUsers: () => Promise<void>;
    deleteUser: (email: string) => Promise<void>;
    profileImage: string | null;
    updateProfileImage: (imageUri: string) => void;
    updateUserDetails: (email: string, updates: Partial<User>) => Promise<void>; // Add this line
    calculateDailyCalories: (
        gender: string, height: string, currentWeight: string,
        goalWeight: string, activityLevel: string
    ) => Result | null;
};

// Define the Result type
interface Result {
    BMR: number;
    TDEE: number;
    DailyCalorieDeficit: number;
    RecommendedDailyCalories: number;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a custom hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Define the props for the UserProvider
type UserProviderProps = {
    children: ReactNode;
};

// Create the UserProvider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    // Login function
    const login = async (email: string, password: string) => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Invalid email address.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        try {
            if (email === 'admin@gmail.com' && password === 'admin1234321!') {
                navigation.navigate('HomeAdmin');
                return;
            }

            let res = await fetch('https://database-s-smile.onrender.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                let data = await res.json();
                data.user.age = new Date().getFullYear() - new Date(data.user.dateOfBirth).getFullYear();
                setCurrentUser(data.user);
                console.log('User Logged In:', data.user); // הדפסת פרטי המשתמש לאחר התחברות
                navigation.navigate('HomeScreen');
            } else {
                Alert.alert('Error', 'Invalid email or password.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while logging in. Please try again.');
        }
    };

    // Function to update user details
    const updateUserDetails = async (email: string, updates: Partial<User>) => {
        try {
            const res = await fetch('https://database-s-smile.onrender.com/api/users/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, updates }),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setCurrentUser((prevUser) => {
                    // Update the local user state if the current user matches the edited one
                    if (prevUser && prevUser.email === email) {
                        return { ...prevUser, ...updates };
                    }
                    return prevUser;
                });
                Alert.alert('Success', 'Profile updated successfully.');
            } else {
                const errorResponse = await res.json();
                throw new Error(errorResponse.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            Alert.alert('Error', 'An error occurred while updating the user. Please try again.');
        }
    };

    // Fetch users from the API
    const fetchUsers = async () => {
        try {
            let res = await fetch('https://database-s-smile.onrender.com/api/users/');
            if (res.ok) {
                let data = await res.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const defaultProfileImage = require('../Images/profile_img.jpg');
    const [profileImage, setProfileImage] = useState(defaultProfileImage);

    const updateProfileImage = (imageUri: string) => {
        setProfileImage(imageUri);
    };

    // Delete user function
    const deleteUser = async (email: string) => {
        try {
            let res = await fetch('https://database-s-smile.onrender.com/api/users/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                await fetchUsers();
                Alert.alert('Success', 'User deleted successfully.');
            } else {
                const errorResponse = await res.json();
                throw new Error(errorResponse.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Alert.alert('Error', 'An error occurred while deleting the user. Please try again.');
        }
    };

    // Calculate BMR (assuming a default age of 30)
    const calculateBMR = (gender: string, height: number, weight: number, age = 30): number => {
        if (gender.toLowerCase() === 'male') {
            return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else if (gender.toLowerCase() === 'female') {
            return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        } else {
            return 0;
        }
    };

    const calculateTDEE = (bmr: number, activityLevel: string): number => {
        const activityMultipliers: Record<string, number> = {
            'notVeryActive': 1.2,
            'lightlyActive': 1.375,
            'moderatelyActive': 1.55,
            'active': 1.725,
            'veryActive': 1.9,
        };

        return bmr * (activityMultipliers[activityLevel] || 1.2);
    };

    const calculateDailyCalorieDeficit = (currentWeight: number, goalWeight: number): number => {
        const totalWeightLossNeeded = currentWeight - goalWeight;
        const weeklyWeightLoss = 0.5;
        const caloriesPerKg = 7700;
        const weeklyCalorieDeficit = weeklyWeightLoss * caloriesPerKg;
        const dailyCalorieDeficit = weeklyCalorieDeficit / 7;
        return dailyCalorieDeficit;
    };

    const calculateDailyCalories = (
        gender: string,
        height: string,
        currentWeight: string,
        goalWeight: string,
        activityLevel: string
    ): Result | null => {
        const bmr = calculateBMR(gender, parseFloat(height), parseFloat(currentWeight));
        const tdee = calculateTDEE(bmr, activityLevel);
        const dailyCalorieDeficit = calculateDailyCalorieDeficit(parseFloat(currentWeight), parseFloat(goalWeight));
        const recommendedDailyCalories = Math.round(tdee - dailyCalorieDeficit);

        return {
            BMR: bmr,
            TDEE: tdee,
            DailyCalorieDeficit: dailyCalorieDeficit,
            RecommendedDailyCalories: recommendedDailyCalories,
        };
    };

    return (
        <UserContext.Provider value={{
            login,
            currentUser,
            users,
            fetchUsers,
            deleteUser,
            profileImage,
            updateProfileImage,
            updateUserDetails, // Include the new function here
            calculateDailyCalories
        }}>
            {children}
        </UserContext.Provider>
    );
};
