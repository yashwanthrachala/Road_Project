import React, { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
// import * as Permissions from 'expo-permissions';
// import firebase from 'firebase';
// import 'firebase/firestore';

const LocationDataManager = () => {
    const [location, setLocation] = useState(null);
    const [axes, setAxes] = useState({ x: 0, y: 0, z: 0 });
    const [data, setData] = useState({});

    // useEffect(() => {
    //     (async () => {
    //         const { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //             Alert.alert('Permission to access location was denied');
    //             return;
    //         }

    //         Location.watchPositionAsync({
    //             accuracy: Location.Accuracy.High,
    //             timeInterval: 10,
    //             distanceInterval: 1
    //         }, (newLocation) => {
    //             console.log({ newLocation });
    //             setLocation(newLocation);
    //             const speed = newLocation.coords.speed;
    //             const speedInMilesPerHour = speed * 2.23694;
    //             // if (speedInMilesPerHour > 15) {
    //             saveLocationData(newLocation);
    //             // }
    //             // You may add additional logic here for 'isDriving' detection
    //         });
    //     })();
    // }, []);

    const detectDriving = () => {
        const { x, y, z } = axes;
        const accelerationThreshold = 0.5;
        const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
        console.log({ totalAcceleration })
        return totalAcceleration > accelerationThreshold;
    };

    const doStuff = () => {
        if (!location?.coords) {
            return;
        }
        const { latitude, longitude, altitude, speed } = location.coords;
        const speedInMilesPerHour = speed * 2.23694; // Convert m/s to mph
        const currentTime = new Date();

        // Date and time formatting
        const dateFormatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const timeFormatter = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const formattedDate = dateFormatter.format(currentTime);
        const formattedTime = timeFormatter.format(currentTime);
        const formattedDateTime = `${formattedDate} ${formattedTime}`;

        // Getting accelerometer data
        const accelerometerData = axes;
        const { x: rotationX, y: rotationY, z: rotationZ } = accelerometerData || {};

        // Log the data
        const newData = {
            datetime: formattedDateTime,
            date: formattedDate,
            time: formattedTime,
            isDriving: detectDriving(),
            speed: speedInMilesPerHour,
            location_altitude: altitude,
            location_lat: latitude,
            location_lng: longitude,
            rotationX,
            rotationY,
            rotationZ,
        }
        setData(newData);
        // console.log(newData);
    };


    const setupLocationManager = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            // Location.startLocationUpdatesAsync('LocationTask', {
            //     accuracy: Location.Accuracy.BestForNavigation,
            //     showsBackgroundLocationIndicator: true,
            //     timeInterval: 10,
            // });
            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1,
                    distanceInterval: 0
                }, (newLoc) => {
                    console.log({ newLoc })
                    setLocation(newLoc);
                }
            );
        }
    };

    const setupMotionManager = () => {
        Accelerometer.setUpdateInterval(1000);
        Accelerometer.addListener(accelerometerData => {
            console.log({ accelerometerData })
            const { x: newX, y: newY, z: newZ } = accelerometerData;
            setAxes({ x: newX, y: newY, z: newZ });
        });
    };

    useEffect(() => {
        setupLocationManager();
        setupMotionManager();
    }, []);

    useEffect(doStuff, [location, axes]);

    // const saveLocationData = (locationData) => {
    //     // const db = firebase.firestore();
    //     // const uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'uid';
    //     // const collectionRef = db.collection(`roadData-${uid}`);
    //     console.log("HEREEE")
    //     const data = {
    //         datetime: new Date().toISOString(),
    //         date: new Date().toLocaleDateString(),
    //         time: new Date().toLocaleTimeString(),
    //         isDriving: isDriving,
    //         speed: locationData.coords.speed,
    //         // displayName: firebase.auth().currentUser ? firebase.auth().currentUser.displayName : '',
    //         location_altitude: locationData.coords.altitude,
    //         location_lat: locationData.coords.latitude,
    //         location_log: locationData.coords.longitude,
    //         // rotation data not available directly in Expo
    //     };

    //     console.log({ data });

    //     // collectionRef.add(data)
    //     //     .then(() => console.log('Document successfully written!'))
    //     //     .catch(err => console.log('Error writing document:', err));
    // };

    return (
        <View>
            {Object.keys(data || {}).map(k => <Text>{`${k}: ${data[k] || '-'}`}</Text>)}
            {/* Display location data or other content here */}
        </View>
    );
};

export default LocationDataManager;
