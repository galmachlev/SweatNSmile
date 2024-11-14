import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import ProgressBar from './weight/progressBar';
import WaterConsumption from './weight/WaterConsumption';
import StepsCounter from './weight/StepsCounter';
import { useUser } from '../../context/UserContext';

const DailyDashboard = () => {
  const { currentUser, updateUserDetails } = useUser(); // שימוש בהוק לקבלת ועדכון פרטי משתמש
  const [lastWeight, setLastWeight] = useState(currentUser?.currentWeight || 0); // שדה לשמירת משקל אחרון של המשתמש
  const [isAddingWeight, setIsAddingWeight] = useState(false); // מצב אם המשתמש מוסיף משקל חדש
  const [weight, setWeight] = useState(''); // שדה לשמירת ערך המשקל שהמשתמש הכניס
  const [isWeightChanged, setIsWeightChanged] = useState(false); // מצב אם המשקל שהוזן שונה מהמשקל הקודם
  const screenWidth = Dimensions.get('window').width; // גודל המסך הנוכחי
  const componentWidth = (screenWidth - 60) / 2; // חישוב רוחב עבור רכיבים שונים

  const inputRef = useRef(null); // הפניה לשדה הקלט של המשקל
  const scrollViewRef = useRef(null); // הפניה ל-ScrollView

  const currentDate = new Date().toLocaleDateString('en-US', { // תאריך נוכחי בפורמט יומי
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const formattedDate = new Date().toISOString().split('T')[0]; // תאריך בפורמט יISO

  // אפקט שמשתנה כאשר פרטי המשתמש משתנים, ומעדכן את המשקל האחרון
  useEffect(() => {
    if (currentUser) {
      setLastWeight(currentUser.currentWeight);
    }
  }, [currentUser]);

  // פונקציה שמעדכנת את הערך של המשקל שהמשתמש הכניס
  const handleWeightChange = (text) => {
    setWeight(text);
    setIsWeightChanged(true);
  };

  // פונקציה שמתבצעת כאשר לוחצים על הכפתור של הוספת משקל
  const handleAddWeightPress = () => {
    if (isAddingWeight) {
      handleSave(); // אם כבר מזינים משקל, שומרים את הנתון
    } else {
      setIsAddingWeight(true); // אם לא, מתחילים להזין משקל
      setTimeout(() => inputRef.current?.focus(), 100); // ממקדים את השדה לאחר זמן קצר
    }
  };

  // פונקציה לסגירת המקלדת בעת לחיצה מחוץ לשדה הקלט
  const handlePressOutside = () => {
    if (isAddingWeight) { //
      Keyboard.dismiss(); // סגירת המקלדת
      setIsAddingWeight(false); // שינוי מצב האם המשתמש מכניס משקל
      setWeight(''); // איפוס ערך המשקל
      setIsWeightChanged(false); // איפוס מצב שינוי המשקל
    }
  };

  // פונקציה ששומרת את השינוי במשקל
  const handleSave = () => {
    if (weight && isWeightChanged) { // אם יש ערך חדש שהוזן
      const newWeight = parseFloat(weight); // ממירים את הערך שהוזן למספר
      setLastWeight(newWeight); // עדכון המשקל האחרון
      setIsAddingWeight(false); // סיום הזנת המשקל
      setWeight(''); // איפוס שדה הקלט
      setIsWeightChanged(false); // איפוס מצב שינוי המשקל

      updateUserDetails(currentUser.email, { currentWeight: newWeight }) // עדכון פרטי המשתמש
        .then(() => Alert.alert('Success', 'Weight updated successfully.')) // הצלחה בעדכון
        .catch(() => Alert.alert('Error', 'Failed to update weight. Please try again.')); // כישלון בעדכון
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={handlePressOutside}>{/*הפעלת הפונקציה  שאחראית לסגור את המקלדת בעת לחיצה מחוצה לה*/}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/*  */}
          <ProgressBar 
            startWeight={currentUser?.startWeight || 0} 
            currentWeight={lastWeight} 
            goalWeight={currentUser?.goalWeight || 0} 
          />
          
          {/*  */}
          <View style={styles.horizontalContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.weightRow}>
                <Text style={styles.infoTitle}>Current Weight:</Text>
                <Text style={styles.infoValue}>{lastWeight} KG</Text>
              </View>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>

            {/*   */}
            <TouchableOpacity style={[styles.updateButton, isAddingWeight && isWeightChanged ? { backgroundColor: '#d9534f', paddingHorizontal: 20 } : null]} onPress={handleAddWeightPress}>
              <Text style={styles.updateButtonText}>
                {isAddingWeight
                  ? (isWeightChanged ? 'Save\nChanges' : 'Update\n Weight')
                  : 'Update\n Weight'}
              </Text>
            </TouchableOpacity>
          </View>

          {/*  */}
          {isAddingWeight && (
            <View style={styles.weightInputContainer}>
              <Text style={styles.inputLabel}>Date: {formattedDate}</Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Weight (KG)"
                keyboardType="numeric"
                value={weight}
                onChangeText={handleWeightChange}
              />
            </View>
          )}

          {/*  */}
          <View style={styles.row}>
            <View style={[styles.componentContainer, { width: componentWidth }]}>
              <WaterConsumption />
            </View>
            <View style={[styles.componentContainer, { width: componentWidth }]}>
              <StepsCounter />
            </View>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

//סטיילים
const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 70,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    width: '65%',
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    paddingHorizontal: 10,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E6613',
  },
  dateText: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: '#3E6613',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveChangesButton: {
    backgroundColor: '#d9534f',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  weightInputContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
    width: '95%',
    alignItems: 'center',
  },
  inputLabel: { fontSize: 16, marginBottom: 10 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    marginVertical: 20,
  },
  componentContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default DailyDashboard;
