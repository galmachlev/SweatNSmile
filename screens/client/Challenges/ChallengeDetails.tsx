import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useUser } from '../../../context/UserContext';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';


const ChallengeDetails = ({ route }) => {
  const { currentUser, updateUserDetails } = useUser();
  const { goalType } = route.params;
  const navigation = useNavigation();
  const challenge = currentUser?.weeklyGoals?.find((goal) => goal.goalType === goalType);

  if (!challenge) {
    return <Text style={styles.errorText}>uploading challenge...</Text>;
  }

  const progress = challenge.progressValue / challenge.targetValue;

  return (
    <ImageBackground source={require('../../../Images/run.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Weekly Workout Challenge</Text>

        <Text style={styles.description}>
          Complete {challenge.targetValue} workouts this week. You're almost there, keep it up!
        </Text>

        <Progress.Circle
          size={150}
          progress={progress}
          showsText
          thickness={10}
          color="#4CAF50"
          unfilledColor="#C8E6C9"
          borderWidth={0}
          style={styles.progressCircle}
        />

        <Text style={styles.progressText}>
          Progress: {challenge.progressValue} / {challenge.targetValue}
        </Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Increment progress for testing
            updateUserDetails(currentUser.email, {
              weeklyGoals: currentUser.weeklyGoals.map((goal) =>
                goal.goalType === goalType ? { ...goal, progressValue: goal.progressValue + 1 } : goal
              ),
            });
          }}
        >
          <Text style={styles.actionButtonText}>Add Workout</Text>
        </TouchableOpacity>

        {challenge.isCompleted && <Text style={styles.completedText}>Challenge Completed! Awesome job!</Text>}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('WeeklyChallenge')}>
  <Text style={styles.backButtonText}>Back to Challenges</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  progressCircle: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#3E6613',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
    marginBottom: 20,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedText: {
    fontSize: 20,
    color: '#FFD700',
    marginTop: 30,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChallengeDetails;
