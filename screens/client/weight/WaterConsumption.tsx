import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Button, Image, Dimensions, Alert } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useUser } from '../../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Ionicons } from '@expo/vector-icons'; 

const circleImage = require('../../../Images/water.png');

const WaterConsumption = () => {
  const { currentUser } = useUser();
  const userId = currentUser?.email ?? 'defaultUserEmail'; 
  const userGenderValue = currentUser?.gender ?? 'male';
      
  const waterGoal = userGenderValue === 'male' ? 2600 : 1800; // Water goal based on gender
  const { width } = Dimensions.get('window');
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const [waterIntake, setWaterIntake] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [showFactModal, setShowFactModal] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Sync with AsyncStorage
  useEffect(() => {
    const loadWaterIntake = async () => {
      const storedIntake = await AsyncStorage.getItem('waterIntake');
      const storedDate = await AsyncStorage.getItem('lastIntakeDate');
      const today = new Date().toISOString().slice(0, 10);

      if (storedDate !== today) {
        await AsyncStorage.setItem('waterIntake', '0'); // Reset daily intake
        await AsyncStorage.setItem('lastIntakeDate', today);
      } else {
        setWaterIntake(Number(storedIntake) || 0);
      }
    };

    loadWaterIntake();
  }, []);

// בתוך ה-useEffect המעדכן את animatedValue
useEffect(() => {
  const progress = waterIntake / waterGoal; // חישוב ההתקדמות
  Animated.timing(animatedValue, {
    toValue: progress, // עדכון הערך המתקדם
    duration: 500,
    useNativeDriver: true,
  }).start();

  if (waterIntake >= waterGoal && !isGoalReached) {
    setShowConfetti(true);
    setShowModal(true);
    setIsGoalReached(true);
  }

  // עדכון כמות המים ב-AsyncStorage
  const updateWaterIntake = async () => {
    await AsyncStorage.setItem('waterIntake', String(waterIntake));
  };
  
  updateWaterIntake();
}, [waterIntake]);

// ה-strokeDashoffset
const strokeDashoffset = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [circumference, 0],
});

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingWater = waterGoal - waterIntake;
      if (remainingWater > 0) {
        Alert.alert('Reminder', `You have ${remainingWater} ml left to drink today!`);
      }
    }, 180000); //שינוי תזמון עד להצגת ההתראה - 3 דק'

    return () => clearInterval(interval);
  }, [waterIntake]);

  const handleAddGlass = () => {
    setWaterIntake(prev => prev + 240);
  };

  const handleImagePress = () => {
    setShowFactModal(true);
  };


  // Function to reset intake
  const resetWaterIntake = () => {
    Alert.alert(
      'Reset Water Intake',
      'Are you sure you want to reset your daily intake progress?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setWaterIntake(0); // Reset intake
            AsyncStorage.setItem('waterIntake', '0'); // Update in AsyncStorage
            setShowConfetti(false); // Reset confetti state
            setIsGoalReached(false); // Reset goal reached state
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={[styles.container, { width: width * 0.4 }]}>
      <Text style={styles.title}>Daily Water Consumption</Text>
      <TouchableOpacity style={styles.resetButton} onPress={resetWaterIntake}>
        <Ionicons name="refresh" size={24} color="#3b5998" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageContainer} onPress={handleImagePress}>
        <Image source={circleImage} style={styles.image} />
      </TouchableOpacity>
      <Svg height="150" width="150" viewBox="0 0 120 120" style={styles.svg}>
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx="60"
          cy="60"
          r={radius}
          stroke="#3b5998"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`} // ערך נכון
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={270} // התחלה מהחלק העליון
          originX={60} // מרכז הסיבוב
          originY={60} // מרכז הסיבוב
        />
      </Svg>
       <View style={styles.textContainer}>
        <Text style={styles.text}>{`${waterIntake} ml`}</Text>
        <Text style={styles.subText}>Goal: {waterGoal} ml</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddGlass}>
        <Text style={styles.buttonText}>Add Glass of Water</Text>
      </TouchableOpacity>
      {showConfetti && (
        <ConfettiCannon
          count={300}
          origin={{ x: -10, y: 0 }}
          fadeOut
          colors={['green', 'blue', 'yellow', 'pink', 'orange', 'purple']}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.congratulationsText}>Congratulations!</Text>
            <Text style={styles.modalText}>You have reached your daily water goal!</Text>
            <Button title="Close" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
      <Modal
        visible={showFactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFactModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Did you know?</Text>
            <Text style={styles.modalText2}>
              The National Institute of Medicine (IOM) recommends consuming 2.6 liters of fluids for men and 1.8 liters for women (from drinking alone, not from food).
            </Text>
            <Button title="Close" onPress={() => setShowFactModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  image: {
    position: 'absolute',
    top: 25,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  svg: {
    marginBottom: 15,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b5998',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#6c757d',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  congratulationsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalText2: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  resetButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10, // Ensure the button is on top
  },
});

export default WaterConsumption;

