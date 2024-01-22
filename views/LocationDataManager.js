import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { Accelerometer, Gyroscope } from "expo-sensors";
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
    const [accAxes, setAccAxes] = useState({ x: 0, y: 0, z: 0 });
    const [gyrAxes, setgyrAxes] = useState({ x: 0, y: 0, z: 0 });
    const [data, setData] = useState({});
    const [isStarted, setIsStarted] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [currDocs, setCurrDocs] = useState([]);

    const doStuff = () => {
        if (!location?.coords) {
            return;
        }
        const { latitude, longitude, altitude, speed } = location.coords;
        const speedInKMPH = speed * 3.6;

        const newData = {
          SESSION_ID: sessionId,
          DATETIME: new Date().toISOString(),
          SPEED: speedInKMPH,
          ALTITUDE: altitude,
          LATITUDE: latitude,
          LONGITUDE: longitude,
          ACCELEROMETER_X: accAxes.x,
          ACCELEROMETER_Y: accAxes.y,
          ACCELEROMETER_Z: accAxes.z,
          GYROSCOPE_X: gyrAxes.x,
          GYROSCOPE_Y: gyrAxes.y,
          GYROSCOPE_Z: gyrAxes.z,
        };
        setData(newData);
        const newCurrDocs = [...currDocs];
        newCurrDocs.push(currDocs);
        setCurrDocs(newCurrDocs);
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
          setAccAxes(accelerometerData);
        });
        Gyroscope.setUpdateInterval(5000);
        Gyroscope.addListener((gyroscopeData) => {
          setgyrAxes(gyroscopeData);
        })
    };

    useEffect(() => {
        setSessionId(Random.getRandomBytes(12).join(""))
        setupLocationManager();
        setupMotionManager();
    }, []);

    useEffect(doStuff, [location, accAxes, gyrAxes ]);

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
