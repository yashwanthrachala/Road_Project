import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import { collection, addDoc } from "firebase/firestore";
import * as Random from 'expo-crypto';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  infoContainer: {
    padding: 1,
    borderRadius: 10,
    marginBottom: 20,
    width: "100vw"
  },
  buttonText: {
    minWidth: '95%',
    padding: 10,
    backgroundColor: "#0099fe",
    color: "#fff",
    marginBottom: 5, 
  },
});

const RoadConditionManager = ({ db }) => {
    const [location, setLocation] = useState(null);
    const [axes, setAxes] = useState({ x: 0, y: 0, z: 0 });
    const [data, setData] = useState({});
    const [isStarted, setIsStarted] = useState(false);
    const [sessionId, setSessionId] = useState("");

    const doStuff = () => {
        if (!location?.coords) {
            return;
        }
        const { latitude, longitude, altitude, speed } = location.coords;
        const speedInKMPH = speed * 3.6;
        const currentTime = new Date();

        // Date and time formatting
        const dateFormatter = new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        const timeFormatter = new Intl.DateTimeFormat("en", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        const formattedDate = dateFormatter.format(currentTime);
        const formattedTime = timeFormatter.format(currentTime);
        const formattedDateTime = `${formattedDate} ${formattedTime}`;

        // Getting accelerometer data
        const accelerometerData = axes;
        const {
            x: rotationX,
            y: rotationY,
            z: rotationZ,
        } = accelerometerData || {};

        // Log the data
        const newData = {
            DATETIME: (new Date()).toISOString(),
            SPEED: speedInKMPH,
            ALTITUDE: altitude,
            LATITUDE: latitude,
            LONGITUDE: longitude,
            ROTATION_X: rotationX,
            ROTATION_Y: rotationY,
            ROTATION_Z: rotationZ,
            SESSION_ID: sessionId,
            VIBRATION: Math.sqrt(rotationX*rotationX + rotationY*rotationY + rotationZ*rotationZ)
        };
        setData(newData);
        if (isStarted && !!sessionId) {
            addDoc(collection(db, "road_data"), newData)
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch((e) => {
                    console.error("Error adding document: ", e);
                });
        }
    };

    const setupLocationManager = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000,
                    distanceInterval: 0,
                },
                (newLoc) => {
                    setLocation(newLoc);
                }
            );
        }
    };

    const setupMotionManager = () => {
        Accelerometer.setUpdateInterval(5000);
        Accelerometer.addListener((accelerometerData) => {
            const { x: newX, y: newY, z: newZ } = accelerometerData;
            setAxes({ x: newX, y: newY, z: newZ });
        });
    };

    useEffect(() => {
        setSessionId(Random.getRandomBytes(12).join(""))
        setupLocationManager();
        setupMotionManager();
    }, []);

    useEffect(doStuff, [location, axes]);

    return (
      <View style={styles.container}>
        <View style={[styles.infoContainer]}>
          {isStarted ? (
            <>
              {Object.keys(data || {}).map((k) => (
                <Text key={k} style={styles.buttonText}>{`${k}: ${
                  data[k] || "-"
                }`}</Text>
              ))}
              <Button
                title="Stop Recording Data"
                onPress={() => {
                  setIsStarted(false);
                }}
                color="red"
                style={styles.stopButton}
              />
            </>
          ) : (
            <Button
              title="Start Recording Data"
              onPress={() => {
                setIsStarted(true);
              }}
              style={styles.startButton}
            />
          )}
        </View>
      </View>
    );
};

export default RoadConditionManager;
