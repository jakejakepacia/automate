import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native'
import { supabase } from '../../lib/supabase'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fetchOwnedCars } from '../services/carService'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '../constants/colors'
import { Car } from '../types/car'
import { getPublicUrl } from '../services/api'

type BookingCountMap = Record<
  string,
  { requested: number; scheduled: number; rentedToday: boolean }
>

function getLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function sortCarsByRentedToday(
  cars: Car[],
  counts: BookingCountMap,
) {
  return [...cars].sort((a, b) => {
    const aRentedToday = counts[a.id]?.rentedToday ? 1 : 0
    const bRentedToday = counts[b.id]?.rentedToday ? 1 : 0

    return bRentedToday - aRentedToday
  })
}

function filterCarsByTab(
  cars: Car[],
  tab: 'active' | 'all vehicles' | 'pending',
) {
  if (tab === 'active') {
    return cars.filter((car) => car.isApprovedByAdmin === true)
  }

  if (tab === 'pending') {
    return cars.filter((car) => car.isApprovedByAdmin === false)
  }

  return cars
}

export default function VehiclesScreen({ navigation }) {
  const [tab, setTab] = useState<'active' | 'all vehicles' | 'pending'>(
    'all vehicles',
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [allCars, setAllCars] = useState<Car[]>([])
  const [bookingCounts, setBookingCounts] = useState<BookingCountMap>({})
  const insents = useSafeAreaInsets()

  const route = useRoute()

  const shouldRefresh = route.params?.shouldRefresh
  const fromAddCarPage = route.params?.fromAddCarPage

  useEffect(() => {
    if (tab === 'all vehicles') loadOwnedCars()
  }, [tab])

  useFocusEffect(
    useCallback(() => {
      loadOwnedCars()
    }, [tab]),
  )

  useEffect(() => {
    if (fromAddCarPage) {
      setTab('all vehicles')
      loadOwnedCars()
    }
  }, [fromAddCarPage])

  // async function loadRenting() {
  //   try {
  //     setLoading(true)
  //     setError(null)
  //     const result = await fetchBookings()
  //     setBookings(result)
  //   } catch (error) {
  //     console.error('Error fetching cars:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  async function loadOwnedCars() {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchOwnedCars()
      const cars = result || []

      setAllCars(cars)
      const counts = await loadBookingCounts(cars)
      const nextCars = filterCarsByTab(cars, tab)
      setFilteredCars(sortCarsByRentedToday(nextCars, counts))
      setLoading(false)
    } catch (error) {
      console.error('error fetching owned cars: ', error)
      setLoading(false)
    }
  }

  async function loadBookingCounts(cars: Car[]): Promise<BookingCountMap> {
    if (cars.length === 0) {
      setBookingCounts({})
      return {}
    }

    const carIds = cars.map((car) => car.id)
    const { data, error } = await supabase
      .from('bookings')
      .select('car_id, status, start_date, end_date')
      .in('car_id', carIds)

    if (error) {
      console.error('error fetching booking counts: ', error)
      setBookingCounts({})
      return {}
    }

    const counts = carIds.reduce<BookingCountMap>((acc, carId) => {
      acc[carId] = { requested: 0, scheduled: 0, rentedToday: false }
      return acc
    }, {})

    const today = getLocalDateString(new Date())

    data?.forEach((booking) => {
      if (!counts[booking.car_id]) {
        counts[booking.car_id] = {
          requested: 0,
          scheduled: 0,
          rentedToday: false,
        }
      }

      if (booking.status === 'pending') {
        counts[booking.car_id].requested += 1
      }

      if (booking.status === 'approved') {
        counts[booking.car_id].scheduled += 1

        if (
          booking.start_date &&
          booking.end_date &&
          booking.start_date <= today &&
          booking.end_date >= today
        ) {
          counts[booking.car_id].rentedToday = true
        }
      }
    })

    setBookingCounts(counts)
    return counts
  }

  const handleOwnedCarPress = () => {
    loadOwnedCars()
    setTab('all vehicles')
  }

  const handleActiveCarPress = () => {
    const activeCars = filterCarsByTab(allCars, 'active')
    setFilteredCars(sortCarsByRentedToday(activeCars, bookingCounts))
    setTab('active')
  }

  const handlePendingCarPress = () => {
    const activeCars = filterCarsByTab(allCars, 'pending')
    setFilteredCars(sortCarsByRentedToday(activeCars, bookingCounts))
    setTab('pending')
  }

  function renderOwneCars({ item }: { item: Car }) {
    const thumbnail =
      item.car_images?.find((img) => img.is_thumbnail)?.image_url ||
      item.car_images?.[0]?.image_url

    const imageUrl = getPublicUrl(thumbnail)
    const counts = bookingCounts[item.id] || {
      requested: 0,
      scheduled: 0,
      rentedToday: false,
    }

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          navigation.navigate('Details', { car: item, fromOwnedCars: true })
        }        
      >
        <View style={styles.card}>
          {thumbnail ? (
            <Image source={{ uri: imageUrl }} style={styles.thumb} />
          ) : (
            <View style={styles.thumbPlaceholder} />
          )}
          <View style={styles.info}>
            {counts.rentedToday && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Rented today</Text>
              </View>
            )}
            <Text style={styles.title} numberOfLines={1}>
              {`${item.make} ${item.model} ${item.year || ''}`}
            </Text>
            <View style={styles.bookingRow}>
              <TouchableOpacity
                style={styles.bookingBadge}
                onPress={() =>
                  navigation.navigate('OwnerBookings', {
                    car: item,
                    initialStatus: 'pending',
                  })
                }
              >
                <Text style={styles.bookingLabel}>Requested</Text>
                <Text style={styles.bookingValue}>{counts.requested}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bookingBadge}
                onPress={() =>
                  navigation.navigate('OwnerBookings', {
                    car: item,
                    initialStatus: 'approved',
                  })
                }
              >
                <Text style={styles.bookingLabel}>Scheduled</Text>
                <Text style={styles.bookingValue}>{counts.scheduled}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { marginTop: insents.top }]}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'all vehicles' ? styles.tabActive : null]}
          onPress={handleOwnedCarPress}
        >
          <Text
            style={
              tab === 'all vehicles' ? styles.tabTextActive : styles.tabText
            }
          >
            All Vehicles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'active' ? styles.tabActive : null]}
          onPress={handleActiveCarPress}
        >
          <Text
            style={tab === 'active' ? styles.tabTextActive : styles.tabText}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'pending' ? styles.tabActive : null]}
          onPress={handlePendingCarPress}
        >
          <Text
            style={tab === 'pending' ? styles.tabTextActive : styles.tabText}
          >
            Pending
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={{ gap: 5, flex: 1 }}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={filteredCars}
              keyExtractor={(i) => i.id}
              renderItem={renderOwneCars}
              showsVerticalScrollIndicator={false}
              style={{ padding: 2 }}
            />
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('VehicleForm')}
          >
            <Ionicons
              name="add-circle-sharp"
              size={80}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, paddingBottom: 110 },
  tabRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  tabActive: { backgroundColor: '#1e90ff' },
  tabText: { color: '#333', fontWeight: '600' },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  content: { flex: 1 },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 1,
  },
  thumb: { width: 100, height: 80, borderRadius: 6, marginRight: 10 },
  thumbPlaceholder: {
    width: 100,
    height: 80,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  info: { flex: 1, justifyContent: 'center' },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f7ee',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  statusBadgeText: {
    color: '#1f7a45',
    fontSize: 11,
    fontWeight: '700',
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  bookingRow: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  bookingBadge: {
    backgroundColor: '#f4f7fb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 92,
  },
  bookingLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  bookingValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  meta: { fontSize: 13, color: '#666' },
  price: { marginTop: 6, fontSize: 15, fontWeight: '700', color: '#1e90ff' },
  empty: { textAlign: 'center', marginTop: 30, color: '#666' },
  error: { textAlign: 'center', marginTop: 30, color: '#c0392b' },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
})
