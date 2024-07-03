import React, { useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Onboarding() {
  const navigation = useNavigation();
  const swiperRef = useRef<Swiper>(null);

  const handleSkip = () => {
    navigation.navigate('Register' as never);
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
    }
  };

  const handleGetStarted = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <View style={styles.wrapper}>
      
      <Image source={require('../../Images/onboarding_background.png')} style={styles.backgroundImage} />
      <Swiper
        ref={swiperRef}
        loop={false}
        showsButtons={false}
        paginationStyle={styles.pagination}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >

        {/* Slide 1 */}
        <View style={styles.slide}>
          <Image source={require('../../Images/ONBOARDING1.png')} style={styles.image} />
          <Text style={styles.title}>Personalized Nutrition Menus</Text>
          <Text style={styles.text}>Create customized meal plans tailored to your goals with just a click.</Text>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <MaterialIcons name="arrow-forward-ios" color="#000" size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Slide 2 */}
        <View style={styles.slide}>
          <Image source={require('../../Images/ONBOARDING2.png')} style={styles.image} />
          <Text style={styles.title}>Track Your Progress</Text>
          <Text style={styles.text}>Monitor your daily health metrics and see your progress in real-time.</Text>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <MaterialIcons name="arrow-forward-ios" color="#000" size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Slide 3 - Get Started */}
        <View style={styles.slide}>
          <Image source={require('../../Images/ONBOARDING3.png')} style={styles.image} />
          <Text style={styles.title}>Shop for Health</Text>
          <Text style={styles.text}>Access a wide range of fitness and health products directly from our store.</Text>
          <View style={styles.getStartedContainer}>
          <Button style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </Button>
          </View>
        </View>

      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    marginTop: 120,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 20,
  },
  skipButton: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    backgroundColor: 'transparent',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  nextButton: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    backgroundColor: '#FFF',
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
    color: '#000',
  },
  getStartedContainer: {
    position: 'absolute',
    bottom: 50,
    marginBottom: 60,
    elevation: 4, // גובה תלת מימד / צל
    shadowColor: '#808387', // צבע הצל
    shadowOffset: { width: 0, height: 2 }, // גודל ומיקום הצל
    shadowOpacity: 0.8, // שקיפות הצל
    shadowRadius: 2, // רדיוס הצל
  },
  getStartedButton: {
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 100,
  },
  getStartedButtonText: {
    color: '#808387',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pagination: {
    bottom: 50,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 10,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FFF',
    width: 25,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
});
