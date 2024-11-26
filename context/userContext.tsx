import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { User } from '../types/user';

// הגדרת רשימת הניווט באפליקציה (שמות המסכים והפרמטרים שלהם)
type RootStackParamList = {
    OnBoarding: undefined; // מסך פתיחה
    HomeScreen: undefined; // מסך הבית
    Register: undefined; // מסך הרשמה
    Gallery: undefined; // גלריית תמונות
    Profile: undefined; // פרופיל משתמש
    AllMenusTable: undefined; // טבלת כל התפריטים
    HomeStore: undefined; // מסך החנות
    Login: undefined; // מסך התחברות
    HomeAdmin: undefined; // מסך אדמין
};

// הגדרת טיפוס הקונטקסט של המשתמש
type UserContextType = {
    login: (email: string, password: string) => Promise<void>; // פונקציה להתחברות
    currentUser: User | null; // פרטי המשתמש המחובר
    users: User[]; // רשימת כל המשתמשים
    fetchUsers: () => Promise<void>; // פונקציה לשליפת משתמשים
    deleteUser: (email: string) => Promise<void>; // פונקציה למחיקת משתמש
    profileImage: string | null; // תמונת פרופיל
    updateProfileImage: (imageUri: string) => void; // פונקציה לעדכון תמונת פרופיל
    updateUserDetails: (email: string, updates: Partial<User>) => Promise<void>; // פונקציה לעדכון פרטי משתמש
    calculateDailyCalories: ( // פונקציה לחישוב הקלוריות היומיות
        gender: string,
        height: string,
        currentWeight: string,
        goalWeight: string,
        activityLevel: string,
        age: number
    ) => Result | null;
};

// טיפוס שמגדיר את תוצאות חישוב הקלוריות
interface Result {
    BMR: number; // חילוף חומרים בסיסי
    TDEE: number; // סך הוצאת האנרגיה היומית
    DailyCalorieDeficit: number; // גירעון קלורי יומי
    RecommendedDailyCalories: number; // קלוריות יומיות מומלצות
}

// יצירת קונטקסט עבור המשתמש
const UserContext = createContext<UserContextType | undefined>(undefined);

// הוק מותאם לשימוש בקונטקסט של המשתמש
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// טיפוס עבור פרופס של ספק הקונטקסט
type UserProviderProps = {
    children: ReactNode;
};

// ספק הקונטקסט של המשתמש
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [currentUser, setCurrentUser] = useState<User | null>(null); // סטייט של המשתמש הנוכחי
    const [users, setUsers] = useState<User[]>([]); // סטייט של רשימת המשתמשים

    // פונקציה להתחברות
    const login = async (email: string, password: string) => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields.'); // בדיקת שדות חובה
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // אימות כתובת מייל
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Invalid email address.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long'); // אימות אורך הסיסמה
            return;
        }

        try {
            if (email === 'admin@gmail.com' && password === 'admin1234321!') {
                navigation.navigate('HomeAdmin'); // כניסה כאדמין
                return;
            }

            let res = await fetch('https://database-s-smile.onrender.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // שליחה לשרת
            });

            if (res.ok) {
                let data = await res.json();
                data.user.age = new Date().getFullYear() - new Date(data.user.dateOfBirth).getFullYear(); // חישוב גיל המשתמש
                setCurrentUser(data.user); // שמירת פרטי המשתמש הנוכחי
                navigation.navigate('HomeScreen'); // מעבר למסך הבית
            } else {
                Alert.alert('Error', 'Invalid email or password.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while logging in. Please try again.');
        }
    };

    // פונקציה לעדכון פרטי משתמש
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
                    if (prevUser && prevUser.email === email) {
                        return { ...prevUser, ...updates }; // עדכון סטייט המשתמש
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

    // פונקציה למחיקת משתמש
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
                await fetchUsers(); // עדכון רשימת המשתמשים לאחר מחיקה
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

    // פונקציה לשליפת משתמשים מהשרת
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

    const defaultProfileImage = require('../Images/profile_img.jpg'); // תמונת פרופיל ברירת מחדל
    const [profileImage, setProfileImage] = useState(defaultProfileImage);

    const updateProfileImage = (imageUri: string) => {
        setProfileImage(imageUri); // עדכון תמונת פרופיל
    };

    // חישוב חילוף חומרים בסיסי (BMR)
    const calculateBMR = (gender: string, height: number, weight: number, age: number): number => {
        if (gender.toLowerCase() === 'male') {
            return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else if (gender.toLowerCase() === 'female') {
            return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        } else {
            return 0;
        }
    };
    
    // חישוב הוצאת אנרגיה יומית (TDEE)
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

    // חישוב גירעון קלורי יומי
    const calculateDailyCalorieDeficit = (currentWeight: number, goalWeight: number): number => {
        const totalWeightLossNeeded = currentWeight - goalWeight; // כמה ק"ג צריך להוריד
        const weeklyWeightLoss = 0.5; // ירידה שבועית מומלצת
        const caloriesPerKg = 7700; // קלוריות בק"ג שומן
        const weeklyCalorieDeficit = weeklyWeightLoss * caloriesPerKg;
        return weeklyCalorieDeficit / 7; // חלוקה לגירעון יומי
    };

    // חישוב קלוריות יומיות מומלצות
    const calculateDailyCalories = (
        gender: string,
        height: string,
        currentWeight: string,
        goalWeight: string,
        activityLevel: string,
        age: number
    ): Result | null => {
        const bmr = calculateBMR(gender, parseFloat(height), parseFloat(currentWeight), age);
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
            updateUserDetails,
            calculateDailyCalories
        }}>
            {children}
        </UserContext.Provider>
    );
};
