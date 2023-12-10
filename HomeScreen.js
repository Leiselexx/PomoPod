import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, Animated, TextInput, FlatList, Modal, Button} from 'react-native';
import Sidebar from './Sidebar'; // Import the Sidebar component

const API_URL = "http://192.168.100.9/ict132/api/v3/index.php";

const HomeScreen = ({ navigation }) => {
  const [totalSeconds, setTotalSeconds] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    // Fetch tasks from API
    fetch(API_URL)
      .then((response) => response.json())
      .then((json) => setTasks(json)) // Update tasks state with fetched data
      .catch((error) => console.error(error));
    
    let timer;
    // Update the timer every second
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTotalSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    // Clear the timer when the component unmounts
    return () => clearInterval(timer);
  }, [isTimerRunning]); // Empty dependency array to run the effect only once when the component mounts

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const handleStartButton = () => {
    setIsTimerRunning(true);
  };

  const handlePauseButton = () => {
    setIsTimerRunning(false);
  };

  const handleStopButton = () => {
    setIsTimerRunning(false);
    setTotalSeconds(1500); // Reset the timer to the initial value
  };
  
  const handleAddTaskButton = () => {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task_name: newTask,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === 'Task added') {
          setTasks([...tasks, { task_name: newTask }]);
        }
      })
      .catch((error) => console.error(error));

    console.log('handleAddTaskButton called'); // Add this line
    console.log('New Task Value:', newTask); // Add this line

    if (newTask.trim() !== '') {
      console.log('Adding task:', newTask);
      setTasks((prevTasks) => [
        ...(Array.isArray(prevTasks) ? prevTasks : []),
        { id: Number(Date.now()).toString(), text: newTask || '', completed: false },
      ]);                
      setNewTask('');
    }
    setModalVisible(!isModalVisible);
  };
  
  const handleCheckButton = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteButton = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    const toValue = isSidebarVisible ? 0 : 1;

    Animated.timing(slideAnim, {
      toValue,
      duration: 100, // Adjust the duration as needed
      useNativeDriver: false,
    }).start(() => {
      setIsSidebarVisible((prev) => !prev);
    });
  };

  return (
    <SafeAreaView style={styles.container}>


      <View style={styles.mainContent}>
        <Text style = {styles.PomodoroText}>Pomodoro</Text>
        <StatusBar backgroundColor="#E0F0FF" barStyle="dark-content" />
        <View style={styles.timeContainer}>
          <Text style={styles.timer}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</Text>
        </View>
        <View style={styles.timeButtons}>
          <TouchableOpacity style={styles.Button} onPress={handleStartButton}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={handlePauseButton}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={handleStopButton}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taskMainContainer}>
        <View style={styles.TaskView}>
        <Text style={styles.TaskMainTitle}>Tasks</Text>
        <View style={styles.AddButtonContainer}>
        <TouchableOpacity style={styles.AddButton} onPress={toggleModal}>
        <Image source={require('./whale.png')} style={styles.AddIcon} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide" // You can customize the animation type
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TextInput 
            style={styles.input}
            value={newTask}
            onChangeText={(text) => setNewTask(text)}
            placeholder="Enter task..."
          />
            <TouchableOpacity style={styles.AddButton} onPress={handleAddTaskButton}>
              <Image source={require('./whale.png')} style={styles.AddIcon} />
            </TouchableOpacity>
            {/* Button to close the modal */}
            <Button title="Close" onPress={toggleModal} />
            
          </View>
        </View>
      </Modal>
            

        </View>
        </View>

      


        
          <FlatList
          style={styles.flatList}
          data={tasks}
          keyExtractor={(item) => item.id ? item.id.toString() : ''}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text
                style={[
                  styles.taskText,
                  { textDecorationLine: item.completed ? 'line-through' : 'none' },
                ]}
              >
                {item.text}
              </Text>
              <TouchableOpacity onPress={() => handleCheckButton(item.id)}>
                <Text>{item.completed ? 'Uncheck' : 'Check'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteButton(item.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
              </View>
          )}
        />
        </View>
        
      </View>

      <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 2], outputRange: [-300, 0] }) }] }]}>
    {   isSidebarVisible && <Sidebar navigation={navigation} />}
      </Animated.View>


      <TouchableOpacity style={styles.sidebarButton} onPress={toggleSidebar}>
        <Image source={require('./menu-icon.png')} style={styles.whale} />
      </TouchableOpacity>

      {/* Button to trigger the modal */}
      

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F0FF',
    paddingTop: StatusBar.currentHeight,
  },
  mainContent: {
    flex: 1,
    marginTop: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  PomodoroText:{
    fontSize: 25,
    color:'#486B9A',
    marginBottom: 20
    
  },
  timer: {
    fontSize: 55,
    marginBottom: 16,
  },
  Button: {
    backgroundColor: '#72AEEA',
    borderRadius: 20,
    marginTop: 20,
    width: 100,
    alignItems: 'center',
    padding: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  timeContainer: {
    display: 'flex',
    width: 200,
    height: 200,
    borderWidth: 3,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderColor: '#72AEEA',
    marginBottom: 30
  },
  sidebarButton: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#72AEEA',
    position: 'absolute',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
    zIndex: 1,
  },
  sidebarContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    bottom: 0,
    right: 0,
    width: '70%', // Adjusted width to match the Sidebar width
  },
  taskMainContainer: {
    margin: 10,
    width: '70%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'left',
    justifyContent: 'flex-start',
    flex: 1
  },
  TaskMainTitle: {
    fontSize: 16,
    
  },
  TaskView:{
    borderBottomWidth: 1,
    borderColor: 'blue',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  AddIcon:{
    borderRadius:5,
    width: 30,
    height: 30
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 8,
    width: '100%'
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  taskText: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    width: '100%',
    marginBottom: '10%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: -300,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%'
    
  },
  
  
});

export default HomeScreen;
