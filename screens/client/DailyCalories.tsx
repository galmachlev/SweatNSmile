

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

// הגדרת סוג התוצאה שתוחזר מהחישוב
interface Result {
    BMR: number;  // קצב חילוף החומרים הבסיסי
    TDEE: number; // סך הוצאת קלוריות יומית
    DailyCalorieDeficit: number; // הגירעון הקלורי היומי
    RecommendedDailyCalories: number; // קלוריות יומיות מומלצות
}

const DailyCalories: React.FC = () => {
    const [gender, setGender] = useState<string>(''); // סוג המגדר (זכר/נקבה)
    const [height, setHeight] = useState<string>(''); // גובה
    const [currentWeight, setCurrentWeight] = useState<string>(''); // משקל נוכחי
    const [goalWeight, setGoalWeight] = useState<string>(''); // משקל יעד
    const [goalDate, setGoalDate] = useState<Date>(new Date()); // תאריך יעד
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false); // האם להציג את בורר התאריך
    const [activityLevel, setActivityLevel] = useState<string>(''); // רמת פעילות
    const [result, setResult] = useState<Result | null>(null); // תוצאה שתוצג למשתמש

    // פונקציה לחישוב הערכים
    const handleCalculate = () => {
        const bmr = calculateBMR(gender, parseFloat(height), parseFloat(currentWeight)); // חישוב BMR
        const tdee = calculateTDEE(bmr, activityLevel); // חישוב TDEE
        const dailyCalorieDeficit = calculateDailyCalorieDeficit(parseFloat(currentWeight), parseFloat(goalWeight), goalDate); // חישוב הגירעון הקלורי
        const recommendedDailyCalories = tdee - dailyCalorieDeficit; // חישוב קלוריות יומיות מומלצות

        setResult({
            BMR: bmr,
            TDEE: tdee,
            DailyCalorieDeficit: dailyCalorieDeficit,
            RecommendedDailyCalories: recommendedDailyCalories,
        });
    };

    // פונקציה לחישוב BMR
    const calculateBMR = (gender: string, height: number, weight: number, age = 30): number => {
        if (gender.toLowerCase() === 'male') {
            return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age); // חישוב ל-זכר (גיל ממוצע 30)
        } else if (gender.toLowerCase() === 'female') {
            return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age); // חישוב לנקבה (גיל ממוצע 30)
        } else {
            return 0; // אם אין מגדר שנבחר
        }
    };

    const calculateTDEE = (bmr: number, activityLevel: string): number => {
        const activityMultipliers: Record<string, number> = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very active': 1.9,
        };
        return bmr * activityMultipliers[activityLevel];
    };

    const calculateDailyCalorieDeficit = (currentWeight: number, goalWeight: number, goalDate: Date): number => {
        const totalWeightLossNeeded = currentWeight - goalWeight; // in kg
        const totalCalorieDeficitNeeded = totalWeightLossNeeded * 7700; // 1 kg of fat = 7700 calories
        const daysToGoal = (goalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
        return totalCalorieDeficitNeeded / daysToGoal;
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text>Gender:</Text>
                <Picker selectedValue={gender} onValueChange={(value: string) => setGender(value.toString())}>
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                </Picker>

                <Text>Height (cm):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={height}
                    onChangeText={setHeight}
                />

                <Text>Current Weight (kg):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={currentWeight}
                    onChangeText={setCurrentWeight}
                />

                <Text>Goal Weight (kg):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={goalWeight}
                    onChangeText={setGoalWeight}
                />

                <Text>Goal Date:</Text>
                <Button title={format(goalDate, 'yyyy-MM-dd')} onPress={() => setShowDatePicker(true)} />
                {showDatePicker && (
                    <DateTimePicker
                        value={goalDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || goalDate;
                            setShowDatePicker(false);
                            setGoalDate(currentDate);
                        }}
                    />
                )}

                <Text>Activity Level:</Text>
                <Picker selectedValue={activityLevel} onValueChange={(value: string) => setActivityLevel(value.toString())}>
                    <Picker.Item label="Select Activity Level" value="" />
                    <Picker.Item label="Sedentary" value="sedentary" />
                    <Picker.Item label="Light" value="light" />
                    <Picker.Item label="Moderate" value="moderate" />
                    <Picker.Item label="Active" value="active" />
                    <Picker.Item label="Very Active" value="very active" />
                </Picker>

                <Button title="Calculate" onPress={handleCalculate} />

                {result && (
                    <View style={styles.result}>
                        <Text>BMR: {result.BMR.toFixed(2)}</Text>
                        <Text>TDEE: {result.TDEE.toFixed(2)}</Text>
                        <Text>Daily Calorie Deficit: {result.DailyCalorieDeficit.toFixed(2)}</Text>
                        <Text>Recommended Daily Calories: {result.RecommendedDailyCalories.toFixed(2)}</Text>
                    </View>
                )}
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

// סטיילים
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    result: {
        marginTop: 20,
    },
});

export default DailyCalories;
