import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { getCityProvince } from '../services/locationService'

interface LocationCoords {
  latitude: number
  longitude: number
}

export default function PickupMap({ formData, setFormData }) {
  const [location, setLocation] = useState<LocationCoords | null>(null)
  const [pin, setPin] = useState<LocationCoords | null>(null) // user-selected pin
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        alert('Permission to access location was denied!')
        return
      }

      const userLocation = await Location.getCurrentPositionAsync({})
      setLocation(userLocation.coords)
    })()
  }, [])

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    setPin({ latitude, longitude })
    console.log('Selected location:', latitude, longitude)

    const { city, province } = await getCityProvince(latitude, longitude)

    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
      city,
      province,
    }))

    console.log('Updated formData:', {
      latitude,
      longitude,
      city,
      province,
    })
  }

  if (!location) {
    return <View style={styles.container} /> // could be a loader
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        onPress={handleMapPress} // <-- this handles taps
      >
        {/* User location marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
        />

        {/* Pin placed by user tap */}
        {pin && (
          <Marker coordinate={pin} title="Selected Location" pinColor="blue" />
        )}
      </MapView>
    </View>
  )
}

const { height } = Dimensions.get('window')
const mapHeight = height * 0.3

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { height: mapHeight },
  coordsBox: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
})
