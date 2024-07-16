import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Pedometer } from 'expo-sensors';

interface HourlyStep {
  hour: number;
  steps: number;
}

const HealthGraph = () => {
  const { width } = Dimensions.get('window');
  const [showModal, setShowModal] = useState(false);
  const [hourlySteps, setHourlySteps] = useState<HourlyStep[]>([]);
  const [summaryData, setSummaryData] = useState({
    lastHour: 0,
    today: 0,
    last24Hours: 0,
  });
  const [selectedHour, setSelectedHour] = useState<HourlyStep | null>(null);
  const [error, setError] = useState<string | null>(null);

  const barWidth = 15;
  const barSpacing = 10;
  const graphHeight = 190;
  const graphWidth = (barWidth + barSpacing) * 5;

  useEffect(() => {
    const fetchData = async () => {
      const end = new Date();
      const startLast24Hours = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      const startSince00Today = new Date(end);
      startSince00Today.setHours(0, 0, 0, 0);

      const hourlyData: HourlyStep[] = [];
      for (let i = 4; i >= 0; i--) {
        const hourStart = new Date(end.getTime() - i * 60 * 60 * 1000);
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
        try {
          const result = await Pedometer.getStepCountAsync(hourStart, hourEnd);
          hourlyData.push({ hour: hourStart.getHours(), steps: result.steps });
        } catch (error) {
          setError('Error reading step data.');
        }
      }
      setHourlySteps(hourlyData);

      try {
        const past24HoursResult = await Pedometer.getStepCountAsync(startLast24Hours, end);
        const todayResult = await Pedometer.getStepCountAsync(startSince00Today, end);
        const lastHourResult = await Pedometer.getStepCountAsync(new Date(end.getTime() - 60 * 60 * 1000), end);

        setSummaryData({
          lastHour: lastHourResult.steps,
          today: todayResult.steps,
          last24Hours: past24HoursResult.steps,
        });
      } catch (error) {
        setError('Error reading step data.');
      }
    };

    fetchData();
  }, []);

  const maxSteps = Math.max(...hourlySteps.map(item => item.steps));
  const maxBarHeight = graphHeight * 0.9; // 90% of graph height

  const renderBars = () => {
    return hourlySteps.map((item, index) => (
      <React.Fragment key={index}>
        <Defs>
          <LinearGradient id={`grad${index}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FDE598" stopOpacity="1" />
            <Stop offset="100%" stopColor="#E8A54B" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          x={index * (barWidth + barSpacing) + barSpacing / 2}
          y={graphHeight - (item.steps / maxSteps) * maxBarHeight}
          width={barWidth}
          height={(item.steps / maxSteps) * maxBarHeight}
          fill={`url(#grad${index})`}
          stroke="#D89E4E"
          strokeWidth="1"
          onPress={() => setSelectedHour(item)}
        />
        <SvgText
          x={index * (barWidth + barSpacing) + barWidth / 2 + barSpacing / 2}
          y={graphHeight + 15}
          fontSize="10"
          fill="#333"
          textAnchor="middle"
        >
          {item.hour}
        </SvgText>
      </React.Fragment>
    ));
  };

  return (
    <View style={[styles.container, { width: width * 0.4 }]}>
      <Text style={styles.title}>Hourly Steps</Text>
      <Svg height={graphHeight + 30} width={graphWidth} style={styles.svg}>
        <Line x1="0" y1={graphHeight} x2={graphWidth} y2={graphHeight} stroke="#ccc" strokeWidth="1" />
        {renderBars()}
      </Svg>
      {selectedHour ? (
        <Text style={styles.selectedHourText}>
          {`${selectedHour.hour}:00 - ${selectedHour.steps} steps`}
        </Text>
      ) : (
        <Text style={styles.selectedHourText}>
          {`${new Date().getHours()}:00 - ${hourlySteps.find(item => item.hour === new Date().getHours())?.steps ?? 0} steps`}
        </Text>
      )}
      {error ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
          <Text style={styles.buttonText}>Show Summary</Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Step Count Summary</Text>
            <Text style={styles.modalText}>{`Last Hour: ${summaryData.lastHour} steps`}</Text>
            <Text style={styles.modalText}>{`Today: ${summaryData.today} steps`}</Text>
            <Text style={styles.modalText}>{`Last 24 Hours: ${summaryData.last24Hours} steps`}</Text>
            <Button title="Close" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    color: '#E8A54B',
    marginBottom: 10,
    textAlign: 'center',
  },
  svg: {
    marginBottom: 0,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#E8A54B',
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
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  modalText: {
    fontSize: 14,
    color: '#6c757d',
    marginVertical: 8,
    textAlign: 'center',
  },
  selectedHourText: {
    fontSize: 12,
    color: '#6c757d',
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    padding: 15,
  },
});

export default HealthGraph;
