import React, { Suspense, useEffect, useState } from 'react'
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
import { useRoute } from '@react-navigation/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { fetchBookings, fetchOwnedCars } from '../services/api'
import CarCard from '../components/carCard'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '../constants/colors'
export default function VehiclesScreen({ navigation }) {
  const [tab, setTab] = useState<'renting' | 'owned'>('renting')
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cars, setCars] = useState([])
  const insents = useSafeAreaInsets()

  const route = useRoute()

  const shouldRefresh = route.params?.shouldRefresh
  const fromAddCarPage = route.params?.fromAddCarPage

  useEffect(() => {
    if (tab === 'renting') loadRenting()
  }, [tab])

  useEffect(() => {
    if (fromAddCarPage) {
      setTab('owned')
      loadOwnedCars()
    }
  }, [fromAddCarPage])

  async function loadRenting() {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchBookings()
      setBookings(result)
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadOwnedCars() {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchOwnedCars()
      setCars(result)
      setLoading(false)
    } catch (error) {
      console.error('error fetching owned cars: ', error)
    }
  }

  const handleOwnedCarPress = () => {
    loadOwnedCars()
    setTab('owned')
  }

  function renderOwneCars({ item }: { item: any }) {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          navigation.navigate('Details', { car: item, fromOwnedCars: true })
        }
      >
        <Suspense fallback={<ActivityIndicator />}>
          <CarCard car={item} />
        </Suspense>
      </TouchableOpacity>
    )
  }

  function renderBooking({ item }: { item: any }) {
    const car = item.cars || null
    const thumbnail = car?.car_images?.find(
      (img: any) => img.is_thumbnail,
    )?.image_url

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { car: car })}
      >
        <View style={styles.card}>
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.thumb} />
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
          style={[styles.tab, tab === 'renting' ? styles.tabActive : null]}
          onPress={() => setTab('renting')}
        >
          <Text
            style={tab === 'renting' ? styles.tabTextActive : styles.tabText}
          >
            Renting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'owned' ? styles.tabActive : null]}
          onPress={handleOwnedCarPress}
        >
          <Text style={tab === 'owned' ? styles.tabTextActive : styles.tabText}>
            Owned
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tab === 'renting' ? (
          loading ? (
            <ActivityIndicator />
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
          )
        ) : (
          <View style={{ gap: 5, flex: 1 }}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={cars}
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
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
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
