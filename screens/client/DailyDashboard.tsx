import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import ProgressBar from './weight/progressBar';
import WaterConsumption from './weight/WaterConsumption';
import StepsCounter from './weight/StepsCounter';
import { useUser } from '../../context/UserContext';

const DailyDashboard = () => {
  const { currentUser, updateUserDetails } = useUser();
  const [lastWeight, setLastWeight] = useState(currentUser?.currentWeight || 0);
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [weight, setWeight] = useState('');
  const [isWeightChanged, setIsWeightChanged] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const componentWidth = (screenWidth - 60) / 2;

  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const formattedDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (currentUser) {
      setLastWeight(currentUser.currentWeight);
    }
  }, [currentUser]);

  const handleSave = () => {
    if (weight && isWeightChanged) {
      const newWeight = parseFloat(weight);
      setLastWeight(newWeight);
      setIsAddingWeight(false);
      setWeight('');
      setIsWeightChanged(false);

      updateUserDetails(currentUser.email, { currentWeight: newWeight })
        .then(() => Alert.alert('Success', 'Weight updated successfully.'))
        .catch(() => Alert.alert('Error', 'Failed to update weight. Please try again.'));
    }
  };

  const handleWeightChange = (text) => {
    setWeight(text);
    setIsWeightChanged(true);
  };

  const handlePressOutside = () => {
    if (isAddingWeight) {
      Keyboard.dismiss();
      setIsAddingWeight(false);
      setWeight('');
      setIsWeightChanged(false);
    }
  };

  const handleAddWeightPress = () => {
    if (isAddingWeight) {
      handleSave();
    } else {
      setIsAddingWeight(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar 
            startWeight={currentUser?.startWeight || 0} 
            currentWeight={lastWeight} 
            goalWeight={currentUser?.goalWeight || 0} 
          />
          
          <View style={styles.horizontalContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.weightRow}>
                <Text style={styles.infoTitle}>Current Weight:</Text>
                <Text style={styles.infoValue}>{lastWeight} KG</Text>
              </View>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>

            <TouchableOpacity style={[styles.updateButton, isAddingWeight && isWeightChanged ? { backgroundColor: '#d9534f', paddingHorizontal: 20 } : null]} onPress={handleAddWeightPress}>
            <Text style={styles.updateButtonText}>
              {isAddingWeight
                ? (isWeightChanged ? 'Save\nChanges' : 'Update\n Weight')
                : 'Update\n Weight'}
            </Text>
            </TouchableOpacity>
          </View>

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
    color: '#5AA72A',
  },
  dateText: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: '#5EAD2C',
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
    backgroundColor: '#d9534f', // צבע רקע שונה בעת השינוי
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
