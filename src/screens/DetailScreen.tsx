import React, { useEffect, useState, useTransition } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Colors } from '../constants/colors'
import Modal from 'react-native-modal'
import ScheduleScreen from './ScheduleScreen'
import { fetchBookings } from '../services/api'
import { formatPHP } from '../constants/formatPHP'
import { getPublicUrl } from '../services/api'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

export default function DetailScreen({ route, navigation }) {
  const { car, fromOwnedCars } = route.params
  const [favorite, setFavorite] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [selectedCar, setSelectedCar] = useState(car)
  const toggleModal = () => setModalVisible((prev) => !prev)
  const [requestedBooking, setRequestedBooking] = useState(false)
  const [successRequestBooking, setSuccessRequestBook] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState(null)
  const thumbnail =
    car.car_images?.find((img) => img.is_thumbnail)?.image_url ||
    car.car_images?.[0]?.image_url

  const imageUrl = getPublicUrl(thumbnail)

  const price = car.car_pricing?.[0]?.price_per_day

  useEffect(() => {
    loadBookings()
  }, [])

  const handleCloseModal = () => {
    toggleModal()
    // // Reload user data when modal closes (after successful login)
    // setTimeout(() => {
    //   loadUserData();
    // }, 300);
  }

  const loadBookings = async () => {
    try {
      setIsLoading(true)
      const result = await fetchBookings()
      const booking = result.find((booking) => booking.car_id === car.id)

      if (booking != null) {
        setRequestedBooking(true)
        setBookingDetails(booking)
        console.log('booking details, ', bookingDetails)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookingRequested = () => {
    loadBookings()
    setSuccessRequestBook(true)
  }

  const handleBackNavigation = () => {
    if (successRequestBooking) {
      navigation.navigate('Tabs', {
        screen: 'Vehicles',
        params: { shouldRefresh: true },
      })
    } else {
      navigation.goBack()
    }
  }

  const handleConfirmButton = () => {
    if (requestedBooking) {
    } else {
      setModalVisible(true)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackNavigation} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back-ios" size={20} color={Colors.black} />
        </TouchableOpacity>

        <Text style={styles.title}>
          {car.make} {car.model}
        </Text>

        <TouchableOpacity
          onPress={() => setFavorite(!favorite)}
          style={styles.iconBtn}
        >
          <MaterialIcons
            name={favorite ? 'favorite' : 'favorite-border'}
            size={22}
            color={favorite ? '#e0245e' : Colors.black}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.carTitle}>
              {car.make} {car.model}
            </Text>
            <Text style={styles.carSub}>
              {car.year} • {car.color} • {car.city}
            </Text>
          </View>

          <View>
            <Text style={styles.price}>
              {price != null ? `₱ ${price} / per day` : 'Not available'}
            </Text>
            <Text style={{ fontSize: 8 }}>Prices may varies</Text>
          </View>
        </View>

        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Seats</Text>
            <Text style={styles.specValue}>{car.seats ?? 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Transmission</Text>
            <Text style={styles.specValue}>{car.transmission ?? 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Fuel</Text>
            <Text style={styles.specValue}>{car.fuel_type ?? 'N/A'}</Text>
          </View>
        </View>

        {!fromOwnedCars && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Owner</Text>
            <View style={styles.ownerRow}>
              <View>
                <Text style={styles.ownerName}>
                  {car.users?.name || 'Unknown'}
                </Text>
                <Text style={styles.ownerSub}>
                  {car.users?.city || car.city}
                </Text>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={{ color: 'white' }}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {requestedBooking && !fromOwnedCars && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={styles.ownerRow}>
              <View>
                <Text style={styles.ownerSub}>
                  {' '}
                  {`From: ${bookingDetails.start_date || '-'} • To: ${bookingDetails.end_date || '-'}`}
                </Text>

                <Text style={styles.ownerSub}>
                  {' '}
                  {`Initial Amount: ${formatPHP(bookingDetails.initial_price) || '-'}`}
                </Text>
                <Text style={styles.ownerSub}>
                  {' '}
                  {`Status: ${bookingDetails.status || '-'}`}
                </Text>
                <Text style={styles.ownerSub}>
                  {' '}
                  {`Total Amount: ${formatPHP(bookingDetails.total_price) || '-'} (waitng for the owner to confirm)`}
                </Text>
              </View>
              {/* <TouchableOpacity style={styles.button}>
                                    <Text style={{color: "white"}}>Cancel</Text>
                                </TouchableOpacity> */}
            </View>
          </View>
        )}

        {!fromOwnedCars && (
          <View>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  marginTop: 20,
                  backgroundColor: requestedBooking
                    ? 'darkgrey'
                    : Colors.primary,
                },
              ]}
              onPress={handleConfirmButton}
              disabled={requestedBooking || isLoading || price == null}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" /> // smaller size
              ) : (
                <Text style={{ color: 'white' }}>
                  {requestedBooking
                    ? 'Submitted Booking'
                    : price == null
                      ? 'Not available'
                      : 'Inquire'}
                </Text>
              )}
            </TouchableOpacity>

            <Modal
              isVisible={isModalVisible}
              style={{ justifyContent: 'flex-end', margin: 0 }}
            >
              <View style={styles.modalContainer}>
                <ScheduleScreen
                  car={selectedCar}
                  onClose={handleCloseModal}
                  onBookingRequested={handleBookingRequested}
                />
              </View>
            </Modal>
          </View>
        )}

        {fromOwnedCars && (
          <View style={{ gap: 10, marginTop: 20 }}>
            <TouchableOpacity
              style={styles.forRentButton}
              onPress={() =>
                navigation.navigate('CreateRentalListing', {
                  car_id: selectedCar.id,
                })
              }
            >
              <Text style={styles.step}>Create Rental Listing</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.goHomeBtn}>
              <Text style={[styles.step, { color: Colors.primary }]}>
                Edit Car Details
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: { padding: 6 },
  title: {
    fontFamily: 'MySubHeaderFontSemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  mainImage: {
    width: windowWidth - 32,
    height: windowHeight * 0.35,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  carTitle: { fontSize: 20, fontWeight: '700', fontFamily: 'MyHeaderFontBold' },
  carSub: { fontSize: 13, color: Colors.secondary, marginTop: 4 },
  price: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  specItem: { flex: 1, alignItems: 'center' },
  specLabel: { fontSize: 12, color: Colors.secondary },
  specValue: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  section: {
    marginTop: 10,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  description: { fontSize: 13, color: '#333', lineHeight: 18 },
  ownerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerName: { fontSize: 15, fontWeight: '700' },
  ownerSub: { fontSize: 12, color: Colors.secondary, marginTop: 4 },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },

  modalContainer: {
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  forRentButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  goHomeBtn: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  step: {
    fontSize: 14,
    lineHeight: 22,
    color: 'white',
    fontFamily: 'MyRegularFont',
  },
})
