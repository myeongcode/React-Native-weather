import * as Location from 'expo-location';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


const {width:SCREEN_WIDTH} = Dimensions.get("window");

const API_KEY = "16d6e7928e145485fde5d1a32d9a8b89";

const icons = { 
  Clouds : "weather-cloudy",
  Rain : "weather-rainy",
  Snow : "weather-snowy"
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);

  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }

    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps: false}
    );
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);

  }

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={ styles.container }>
      <View style={ styles.city }>
        <Text style={ styles.cityName }>{city}</Text>
      </View>
      <ScrollView 
      horizontal 
      indicatorStyle='white'
      pagingEnabled  
      contentContainerStyle={ styles.weather }
      >
        {
          days.length === 0
          ? (
            <View style={ styles.day }>
              <ActivityIndicator color="white" size="large"/>
            </View>
          )
          : (
              days.map((day, index) =>
                <View key={index} style={ styles.day }>
                  <View style={styles.weatherIcons}>
                    <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                    <MaterialCommunityIcons name={icons[day.weather[0].main]} size={88} color="black" />
                  </View>
                  <Text style={styles.description}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                </View>
            )
          )
        }
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E82CD"
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    color: "black",
    fontSize: 48,
    fontWeight: "500"
  },
  weather: {
  },
  day: {
    width:SCREEN_WIDTH - 30,
    flex:1,
    alignItems:"flex-start",
    marginLeft: 30,
  },
  temp: {
    marginTop: 50,
    fontSize: 108
  },
  description: {
    marginTop: -30,
    fontSize: 40
  },
  tinyText: {
    fontSize:20,
  },
  weatherIcons: {
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  }
})