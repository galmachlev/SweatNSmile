import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { useUser } from '../../../context/UserContext';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Card, Title, Paragraph, Menu } from 'react-native-paper';

const workoutTypes = [
  'Strength Training',
  'Cardio',
  'HIIT (High-Intensity Interval Training)',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Bodyweight Training',
  'Dance (e.g., Zumba)',
  'Circuit Training',
  'Martial Arts',
  'Other',
];

const ChallengeDetails = ({ route }) => {
  const { currentUser, updateUserDetails } = useUser();
  const { goalType } = route.params;
  const navigation = useNavigation();
  const challenge = currentUser?.weeklyGoals?.find((goal) => goal.goalType === goalType);

  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
  const [otherWorkout, setOtherWorkout] = useState('');
  const [dailySleep, setDailySleep] = useState('');
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  if (!challenge) {
    return <Text style={styles.errorText}>Loading challenge...</Text>;
  }

  const progress = challenge.progressValue / challenge.targetValue;

  const isWorkoutAllowedToday = () => {
    if (!lastWorkoutDate) return true;
    const today = new Date();
    return today.toDateString() !== new Date(lastWorkoutDate).toDateString();
  };

  const handleWorkoutSubmit = () => {
    const workoutEntry = {
      date: new Date(),
      type: selectedWorkoutType === 'Other' ? otherWorkout : selectedWorkoutType,
    };

    const updatedWeeklyGoals = currentUser.weeklyGoals.map((goal) =>
      goal.goalType === goalType
        ? {
            ...goal,
            progressValue: goal.progressValue + 1,
            workoutEntries: [...(goal.workoutEntries || []), workoutEntry],
          }
        : goal
    );

    updateUserDetails(currentUser.email, { weeklyGoals: updatedWeeklyGoals });
    setLastWorkoutDate(new Date());
    setSelectedWorkoutType('');
    setOtherWorkout('');
  };

  const handleSleepInput = () => {
    const newSleepEntry = { date: new Date(), hours: parseFloat(dailySleep) };
    const updatedWeeklyGoals = currentUser.weeklyGoals.map((goal) =>
      goal.goalType === goalType
        ? {
            ...goal,
            progressValue: goal.progressValue + newSleepEntry.hours,
            sleepEntries: [...(goal.sleepEntries || []), newSleepEntry],
          }
        : goal
    );
    updateUserDetails(currentUser.email, { weeklyGoals: updatedWeeklyGoals });
    setDailySleep('');
  };

  const renderWorkoutContent = () => (
    <>
      <Paragraph style={styles.description}>
        Complete {challenge.targetValue} workouts this week. You're almost there, keep it up!
      </Paragraph>

      <Menu
        visible={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        anchor={
          <Button onPress={() => setIsMenuVisible(true)} mode="outlined" style={styles.dropdown}>
            {selectedWorkoutType || 'Select Workout Type'}
          </Button>
        }
      >
        {workoutTypes.map((type, index) => (
          <Menu.Item
            key={index}
            onPress={() => {
              setSelectedWorkoutType(type);
              setIsMenuVisible(false);
            }}
            title={type}
          />
        ))}
      </Menu>

      {selectedWorkoutType === 'Other' && (
        <TextInput
          mode="outlined"
          label="Specify Workout"
          value={otherWorkout}
          onChangeText={setOtherWorkout}
          style={styles.input}
        />
      )}

      <Button
        mode="contained"
        onPress={handleWorkoutSubmit}
        disabled={!isWorkoutAllowedToday() || !selectedWorkoutType || (selectedWorkoutType === 'Other' && !otherWorkout)}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
      >
        Log Workout
      </Button>

      <Card style={styles.workoutLogContainer}>
        <Card.Content>
          <Title style={styles.workoutLogTitle}>Workout Log</Title>
          <ScrollView>
            {challenge.workoutEntries?.map((entry, index) => (
              <Paragraph key={index} style={styles.workoutLogText}>
                {new Date(entry.date).toLocaleDateString()}: {entry.type}
              </Paragraph>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
    </>
  );

  const renderSleepContent = () => (
    <>
      <Paragraph style={styles.description}>
        Aim to sleep {challenge.targetValue} hours each night. Track your sleep hours for this week!
      </Paragraph>
      <TextInput
        mode="outlined"
        label="Hours slept last night"
        keyboardType="numeric"
        value={dailySleep}
        onChangeText={setDailySleep}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSleepInput}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
      >
        Log Sleep Hours
      </Button>
      <Card style={styles.sleepLogContainer}>
        <Card.Content>
          <Title style={styles.sleepLogTitle}>Sleep Log</Title>
          <ScrollView>
            {challenge.sleepEntries?.map((entry, index) => (
              <Paragraph key={index} style={styles.sleepLogText}>
                {entry.date.toLocaleDateString()}: {entry.hours} hours
              </Paragraph>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
    </>
  );

  const renderActiveDaysContent = () => (
    <>
      <Paragraph style={styles.description}>
        Stay active every day this week! Mark each active day to track your progress.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => {
          updateUserDetails(currentUser.email, {
            weeklyGoals: currentUser.weeklyGoals.map((goal) =>
              goal.goalType === goalType ? { ...goal, progressValue: goal.progressValue + 1 } : goal
            ),
          });
        }}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
      >
        Mark Active Day
      </Button>
    </>
  );

  const renderTrySomethingNewContent = () => (
    <>
      <Paragraph style={styles.description}>
        Try something new this week! Whether it's zumba, kickboxing, or another activity, have fun and stay motivated!
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => {
          updateUserDetails(currentUser.email, {
            weeklyGoals: currentUser.weeklyGoals.map((goal) =>
              goal.goalType === goalType ? { ...goal, isCompleted: true } : goal
            ),
          });
        }}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
      >
        Mark as Tried
      </Button>
    </>
  );

  const renderChallengeContent = () => {
    switch (goalType) {
      case 'workouts':
        return renderWorkoutContent();
      case 'sleep':
        return renderSleepContent();
      case 'activeDays':
        return renderActiveDaysContent();
      case 'trySomethingNew':
        return renderTrySomethingNewContent();
      default:
        return null;
    }
  };

  return (
    <ImageBackground
      source={
        goalType === 'sleep'
          ? require('../../../Images/Sleep.png')
          : goalType === 'activeDays'
          ? require('../../../Images/run.png')
          : goalType === 'trySomethingNew'
          ? require('../../../Images/run.png')
          : require('../../../Images/run.png')
      }
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.header}>
          {goalType === 'workouts' && 'Your Weekly Workout Challenge'}
          {goalType === 'sleep' && 'Your Weekly Sleep Challenge'}
          {goalType === 'activeDays' && 'Your Weekly Active Days Challenge'}
          {goalType === 'trySomethingNew' && 'Try Something New Challenge'}
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

        {renderChallengeContent()}

        {challenge.isCompleted && (
          <Text style={styles.completedText}>Challenge Completed! Great job!</Text>
        )}

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('WeeklyChallenge')}
          style={styles.backButton}
          contentStyle={styles.backButtonContent}
        >
          Back to Challenges
        </Button>
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
  dropdown: {
    width: screenWidth * 0.8,
    marginBottom: 20,
  },
  input: {
    width: screenWidth * 0.8,
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 20,
    width: screenWidth * 0.6,
  },
  actionButtonContent: {
    paddingVertical: 8,
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
  workoutLogContainer: {
    width: screenWidth * 0.8,
    maxHeight: 200,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  workoutLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 5,
  },
  workoutLogText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  sleepLogContainer: {
    width: screenWidth * 0.8,
    maxHeight: 200,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  sleepLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 5,
  },
  sleepLogText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  backButton: {
    borderColor: '#FF6347',
    marginTop: 20,
    width: screenWidth * 0.6,
  },
  backButtonContent: {
    paddingVertical: 8,
  },
});

export default ChallengeDetails;
