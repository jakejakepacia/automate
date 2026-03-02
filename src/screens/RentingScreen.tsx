import React, { Suspense, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { supabase } from '../../lib/supabase'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  fetchActiveBookings,
  fetchBookings,
  fetchOwnedCars,
  fetchPendingBookings,
  fetchUpcomingBookings,
  getPublicUrl,
} from '../services/api'
import CarCard from '../components/carCard'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '../constants/colors'
export default function RentingScreen({ navigation }) {
  const [tab, setTab] = useState<'active' | 'requested' | 'upcoming'>('active')
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cars, setCars] = useState([])
  const insents = useSafeAreaInsets()

  const route = useRoute()

  const shouldRefresh = route.params?.shouldRefresh
  const fromAddCarPage = route.params?.fromAddCarPage

  useEffect(() => {
    loadRenting()
  }, [tab])

  async function loadRenting() {
    try {
      setLoading(true)
      setError(null)

      if (tab === 'requested') {
        const result = await fetchPendingBookings()
        console.log('pending bookings', result)
        setBookings(result)
      } else if (tab === 'upcoming') {
        const result = await fetchUpcomingBookings()
        setBookings(result)
      } else {
        const result = await fetchActiveBookings()
        setBookings(result)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  function renderBooking({ item }: { item: any }) {
    const car = item.cars || null
    const thumbnail =
      car.car_images?.find((img) => img.is_thumbnail)?.image_url ||
      car.car_images?.[0]?.image_url

    const imageUrl = getPublicUrl(thumbnail)

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { car: car })}
      >
        <View style={styles.card}>
          {thumbnail ? (
            <Image source={{ uri: imageUrl }} style={styles.thumb} />
          ) : (
            <View style={styles.thumbPlaceholder} />
          )}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {car
                ? `${car.make} ${car.model} ${car.year || ''}`
                : `Car ID: ${item.car_id}`}
            </Text>
            <Text style={styles.meta}>
              {`From: ${item.start_date || '-'} • To: ${item.end_date || '-'}`}
            </Text>
            <Text
              style={styles.meta}
            >{`Status: ${item.status || 'pending'}`}</Text>
            {item.total_price != null ? (
              <Text style={styles.price}>{`$${item.total_price}`}</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { marginTop: insents.top }]}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'active' ? styles.tabActive : null]}
          onPress={() => setTab('active')}
        >
          <Text
            style={tab === 'active' ? styles.tabTextActive : styles.tabText}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'upcoming' ? styles.tabActive : null]}
          onPress={() => setTab('upcoming')}
        >
          <Text
            style={tab === 'upcoming' ? styles.tabTextActive : styles.tabText}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'requested' ? styles.tabActive : null]}
          onPress={() => setTab('requested')}
        >
          <Text
            style={tab === 'requested' ? styles.tabTextActive : styles.tabText}
          >
            Requested
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator />
          </View>
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : bookings.length === 0 ? (
          <Text style={styles.empty}>No bookings found</Text>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(i) => i.id}
            renderItem={renderBooking}
            style={{ padding: 2 }}
          />
        )}
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
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
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
