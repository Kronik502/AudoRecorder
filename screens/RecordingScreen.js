import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const RecordingScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingsList, setRecordingsList] = useState([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingName, setRecordingName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecordings = recordingsList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        Alert.alert("Permission Denied", "You need to enable microphone access to record audio.");
      }
    };
    requestPermission();
    loadRecordings();
  }, []);

  useEffect(() => {
    return recording ? () => recording.stopAndUnloadAsync() : undefined;
  }, [recording]);

  const loadRecordings = async () => {
    try {
      const storedRecordings = await AsyncStorage.getItem("recordings");
      if (storedRecordings) {
        setRecordingsList(JSON.parse(storedRecordings));
      }
    } catch (error) {
      console.error("Failed to load recordings", error);
    }
  };

  const saveRecording = async (uri) => {
    const newRecording = {
      uri,
      name: recordingName || `Recording - ${new Date().toLocaleString()}`,
      date: new Date().toISOString(),
    };
    const newRecordingsList = [...recordingsList, newRecording];
    setRecordingsList(newRecordingsList);
    setRecordingName("");
    try {
      await AsyncStorage.setItem("recordings", JSON.stringify(newRecordingsList));
    } catch (error) {
      console.error("Failed to save recording", error);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingDuration(0);

      const interval = setInterval(() => setRecordingDuration((prev) => prev + 1), 1000);

      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isDoneRecording) {
          clearInterval(interval);
        }
      });
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      saveRecording(recording.getURI());
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const pauseRecording = async () => {
    if (recording) {
      await recording.pauseAsync();
      setIsPaused(true);
    }
  };

  const resumeRecording = async () => {
    if (recording) {
      await recording.startAsync();
      setIsPaused(false);
    }
  };

  const playRecording = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  };

  const deleteRecording = async (uri) => {
    const updatedRecordings = recordingsList.filter((item) => item.uri !== uri);
    setRecordingsList(updatedRecordings);
    try {
      await AsyncStorage.setItem("recordings", JSON.stringify(updatedRecordings));
    } catch (error) {
      console.error("Failed to delete recording", error);
    }
  };

  const shareRecording = async (uri) => {
    try {
      const fileExists = await FileSystem.getInfoAsync(uri);
      if (!fileExists.exists) {
        Alert.alert("Error", "File does not exist");
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Failed to share recording", error);
      Alert.alert("Error", "Unable to share the recording");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No permission to access the microphone</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kronikle Rekords</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter recording name"
          value={recordingName}
          onChangeText={setRecordingName}
          placeholderTextColor="#ddd"
        />
      </View>

      <FlatList
        data={filteredRecordings}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text style={styles.recordingName}>{item.name}</Text>
            <Text style={styles.recordingDate}>{new Date(item.date).toLocaleString()}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => playRecording(item.uri)}>
                <Icon name="play-circle" size={24} color="#FF5722" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => shareRecording(item.uri)}>
                <Icon name="share-variant" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRecording(item.uri)}>
                <Icon name="delete" size={24} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.recordingDuration}>Duration: {recordingDuration}s</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search recordings..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#ddd"
      />

      {/* Record button positioned at the bottom */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.recordButton, isRecording && styles.recordingActive]}
        >
          <Icon name={isRecording ? "stop-circle" : "microphone"} size={40} color="#fff" />
        </TouchableOpacity>
        {isRecording && (
          <TouchableOpacity onPress={isPaused ? resumeRecording : pauseRecording} style={styles.pauseButton}>
            <Icon name={isPaused ? "play-circle" : "pause-circle"} size={40} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    marginVertical: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 15,
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    elevation: 5,
    left:20 ,
  },
  recordingActive: {
    backgroundColor: '#D32F2F',
  },
  pauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    marginLeft: 10,
    elevation: 3,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -35 }],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingDuration: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  searchBar: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 80, // Give space for the record button
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
  },
  noRecordingsText: {
    textAlign: 'center',
    color: '#ddd',
  },
  recordingItem: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#333',
    elevation: 5,
  },
  recordingName: {
    fontSize: 18,
    color: '#fff',
  },
  recordingDate: {
    fontSize: 14,
    color: '#bbb',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
});


export default RecordingScreen;
