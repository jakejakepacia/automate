import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors } from '../constants/colors'
import { getPublicUrl } from '../services/api'
export default function CarCard({ car }) {
  const thumbnail =
    car.car_images?.find((img) => img.is_thumbnail)?.image_url ||
    car.car_images?.[0]?.image_url

  const imageUrl = getPublicUrl(thumbnail)
  const pricePerDay = car.car_pricing?.[0]?.per_per_day
  return (
    <View style={styles.carCard} id={car.id}>
      {/* Car Image */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.carImage}
        resizeMode="contain"
      />

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.carTitle}>
          {car.make} {car.model}
        </Text>
        <Text style={styles.carDetails}>
          {car.year} • {car.color} • {car.city}
        </Text>

        {pricePerDay == null && (
          <TouchableOpacity style={styles.button}>
            <Text style={{ color: 'white', fontFamily: 'MyRegularFont' }}>
              Create Rental Listing
            </Text>
          </TouchableOpacity>
        )}

        {pricePerDay != null && (
          <Text style={styles.carPrice}>
            ₱{car.car_pricing?.[0]?.price_per_day} / day
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  carCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3, // for Android shadow
  },
  carImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  carTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'MyHeaderFontBold',
  },
  carDetails: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
})
