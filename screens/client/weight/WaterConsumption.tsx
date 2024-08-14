import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Button, Image, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import ConfettiCannon from 'react-native-confetti-cannon';

const circleImage = require('../../../Images/water.png');

const WaterConsumption = () => {
  const { width } = Dimensions.get('window');
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const [waterIntake, setWaterIntake] = useState(550);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [showFactModal, setShowFactModal] = useState(false); // State for fact modal
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progress = animatedValue.interpolate({
    inputRange: [0, 2600],
    outputRange: [0, 1],
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: Math.min(waterIntake, 2600), // Cap the animated value at the recommended goal
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (waterIntake >= 2600 && !isGoalReached) {
      setShowConfetti(true);
      setShowModal(true);
      setIsGoalReached(true); // Set the goal as reached
    }
  }, [waterIntake]);

  const handleAddGlass = () => {
    setWaterIntake(prev => prev + 240);
  };

  const handleImagePress = () => {
    setShowFactModal(true);
  };

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: width * 0.4 }]}>
      <Text style={styles.title}>Daily Water Consumption</Text>
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
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{`${waterIntake} ml`}</Text>
        <Text style={styles.subText}>Goal: 2600 ml</Text>
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
      {/* Fact Modal */}
      <Modal
        visible={showFactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFactModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Did you know? The National Institute of Medicine (IOM) recommends consuming 2.6 liters of fluids for men and 1.8 liters for women (from drinking alone, not from food).
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
