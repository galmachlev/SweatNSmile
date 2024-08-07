// WaterConsumption.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Button } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import ConfettiCannon from 'react-native-confetti-cannon';

const WaterConsumption = () => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const [waterIntake, setWaterIntake] = useState(550); // Initial water intake
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progress = animatedValue.interpolate({
    inputRange: [0, 2000],
    outputRange: [0, 1],
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: waterIntake,
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (waterIntake >= 2000) {
      setShowConfetti(true);
      setShowModal(true);
    }
  }, [waterIntake]);

  const handleAddGlass = () => {
    setWaterIntake(prev => Math.min(prev + 240, 2000));
  };

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Water Consumption</Text>
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
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{`${waterIntake} ml`}</Text>
        <Text style={styles.subText}>of your 2000 ml goal</Text>
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
        animationType="slide"
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 15,
  },
  svg: {
    marginBottom: 15,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  subText: {
    fontSize: 16,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  congratulationsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  modalText: {
    fontSize: 18,
    color: '#6c757d',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default WaterConsumption;
