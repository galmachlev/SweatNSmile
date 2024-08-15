import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import ProgressBar from './weight/progressBar';
import WaterConsumption from './weight/WaterConsumption';
import StepsCounter from './weight/StepsCounter';

const DailyWeight = () => {
  const [lastWeight, setLastWeight] = useState(0);
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [weight, setWeight] = useState('');
  const [isWeightChanged, setIsWeightChanged] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const componentWidth = (screenWidth - 60) / 2;

  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height*1.5);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handleSave = () => {
    if (weight && isWeightChanged) {
      setLastWeight(parseFloat(weight));
      setIsAddingWeight(false);
      setWeight('');
      setIsWeightChanged(false);
    }
  };

  const handleWeightChange = (text: React.SetStateAction<string>) => {
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
      setTimeout(() => {
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar onLastValueChange={setLastWeight} />
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Current weight</Text>
            <Text style={styles.infoValue}>{lastWeight} KG</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>          
          <View style={styles.buttonContainer}>
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
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddWeightPress}
            >
              <Text style={styles.addButtonText}>
                {isAddingWeight ? (isWeightChanged ? "Save Changes" : "Add Weight") : "Add Weight"}
              </Text>
            </TouchableOpacity>
          </View>

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
  mainContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 70, // Add extra padding at the bottom
  },
  infoContainer: {
    margin: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
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
  buttonContainer: {
    width: '95%',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#9AB28B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weightInputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginBottom: 10,
    borderRadius: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default DailyWeight;