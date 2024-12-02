import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av'; // Importing Video from expo-av

const { width, height } = Dimensions.get('window');

const Onboarding = () => {
  const navigation = useNavigation();
  const swiperRef = useRef<Swiper>(null);
  const videoRef = useRef<Video>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // State for mute/unmute

  useEffect(() => {
    if (currentIndex === 0 && videoRef.current) {
      videoRef.current.playAsync();
    } else if (videoRef.current) {
      videoRef.current.stopAsync();
    }
  }, [currentIndex]);

  const handleSkip = () => {
    navigation.navigate('Login' as never);
    setIsMuted((prev) => !prev);
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleGetStarted = () => {
    navigation.navigate('Register' as never);
  };

  const handleVideoNext = () => {
    if (videoRef.current) {
      videoRef.current.stopAsync();
    }
    handleNext();
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.durationMillis !== undefined && status.positionMillis >= status.durationMillis) {
      handleNext();
    }
  };
  
  const toggleMute = () => {
    setIsMuted((prev) => !prev); // Toggle mute state
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
        onIndexChanged={setCurrentIndex}
      >
        {/* Video slide */}
        <View style={styles.slide}>
        <Video
          ref={videoRef}
          source={require('../../Images/video.mp4')}
          rate={1.0}
          isMuted={isMuted} // השתמש במצב המוטה
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          style={styles.video}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleVideoNext}>
            <MaterialIcons name="arrow-forward-ios" color="#000" size={24} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
            <MaterialIcons name={isMuted ? "volume-off" : "volume-up"} color="#000" size={24} />
          </TouchableOpacity>
        </View>

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
          <Image source={require('../../Images/ONBOARDING3.png')} style={styles.image3} />
          <Text style={styles.title}>AI Food & Recipe Assistant</Text>
          <Text style={styles.text}>Get AI-powered insights on food items and recipes based on your requested ingredients. Discover market-ready options effortlessly.

          </Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  image3: {
    width: '100%',
    height: 340,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    marginTop: 40,
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
  muteButton: { // Style for the mute button
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'transparent',
    padding: 20,
  },
  getStartedContainer: {
    position: 'absolute',
    bottom: 50,
    marginBottom: 60,
    elevation: 4,
    shadowColor: '#808387',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
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
  video: {
    width: '100%',
    height: '100%',
  },
});

export default Onboarding;
