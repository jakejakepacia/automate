import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { Text, Card, Chip, ActivityIndicator } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fetchCarDetailsById, getPublicUrl } from '../../services/api'
import { useEffect, useState } from 'react'
import { formatPHP } from '../../constants/formatPHP'

export default function ReviewRentalDetailsScreen({
  car_id,
  formData,
  setStep,
}) {
  const [car, setCar] = useState(null)
  const fetchCarDetails = async () => {
    const result = await fetchCarDetailsById(car_id)

    if (result) {
      setCar(result)
    }
  }

  useEffect(() => {
    fetchCarDetails()
  }, [])

  if (!car) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator />
      </View>
    )
  }

  const thumbnail =
    car.car_images?.find((img) => img.is_thumbnail)?.image_url ||
    car.car_images?.[0]?.image_url

  const imageUrl = getPublicUrl(thumbnail)

  return (
    <ScrollView>
      <View style={styles.container}>
        <Card style={styles.card} mode="elevated">
          {thumbnail && (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          )}

          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              {car.make} {car.model}
            </Text>

            <Text style={styles.plate}>Plate: {car.plate_number}</Text>

            <View style={styles.chipRow}>
              <Chip icon="calendar">{car.year}</Chip>
              <Chip icon="fuel">{car.fuel_type}</Chip>
              <Chip icon="car-shift-pattern">{car.transmission}</Chip>
              <Chip icon="seat">{car.seats} seats</Chip>
            </View>

            {/* Rental Section */}
            <View style={styles.pricingContainer}>
              {/* Header */}
              <View style={styles.pricingHeader}>
                <Text style={styles.sectionTitle}>Rental Details</Text>

                <TouchableOpacity onPress={() => setStep(1)}>
                  <Chip icon="pencil" compact>
                    Edit
                  </Chip>
                </TouchableOpacity>
              </View>

              {/* Main Price */}
              <View style={styles.mainPriceRow}>
                <Text style={styles.mainPrice}>
                  {formatPHP(formData.daily)}
                </Text>
                <Text style={styles.perDay}>/ day</Text>
              </View>

              {/* Other Prices */}
              <View style={styles.divider} />

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Per week</Text>
                <Text style={styles.priceValue}>
                  {' '}
                  {formatPHP(formData.weekly)}
                </Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Per month</Text>
                <Text style={styles.priceValue}>
                  {' '}
                  {formatPHP(formData.weekly)}
                </Text>
              </View>

              {/* Driver Section */}
              {formData.with_driver && (
                <View style={styles.driverBox}>
                  <Text style={styles.driverTitle}>With Driver</Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Driver per day</Text>
                    <Text style={styles.priceValue}>
                      ${formData.driver_price_per_day}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                <Text style={styles.sectionTitle}>Pickup Location</Text>

                <TouchableOpacity onPress={() => setStep(2)}>
                  <Chip icon="pencil" compact>
                    Edit
                  </Chip>
                </TouchableOpacity>
              </View>

              <View style={styles.locationRow}>
                <Chip icon="map-marker" style={styles.locationChip}>
                  {formData.pickup_location}
                </Chip>
                <Text>
                  {formData.city}, {formData.province}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6f8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  plate: {
    opacity: 0.6,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
    flex: 1,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  priceLabel: {
    opacity: 0.7,
  },

  priceValue: {
    fontWeight: '700',
    fontSize: 16,
  },
  pricingContainer: {
    marginTop: 20,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
  },

  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  mainPriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },

  mainPrice: {
    fontSize: 32,
    fontWeight: '700',
  },

  perDay: {
    marginLeft: 6,
    marginBottom: 4,
    opacity: 0.6,
  },

  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },

  driverBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },

  driverTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  locationContainer: {
    marginTop: 20,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
  },

  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  locationRow: {
    alignItems: 'flex-start',
    gap: 10,
  },

  locationChip: {
    borderRadius: 50,
  },
})
