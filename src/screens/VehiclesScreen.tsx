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
  const [tab, setTab] = useState<'active' | 'owned' | 'pending' | 'rented'>(
    'active',
  )
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cars, setCars] = useState([])
  const insents = useSafeAreaInsets()

  const route = useRoute()

  const shouldRefresh = route.params?.shouldRefresh
  const fromAddCarPage = route.params?.fromAddCarPage

  useEffect(() => {
    if (tab === 'active') loadRenting()
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

  return (
    <View style={[styles.container, { marginTop: insents.top }]}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'owned' ? styles.tabActive : null]}
          onPress={handleOwnedCarPress}
        >
          <Text style={tab === 'owned' ? styles.tabTextActive : styles.tabText}>
            Owned
          </Text>
        </TouchableOpacity>
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
          style={[styles.tab, tab === 'pending' ? styles.tabActive : null]}
          onPress={() => setTab('pending')}
        >
          <Text
            style={tab === 'pending' ? styles.tabTextActive : styles.tabText}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'rented' ? styles.tabActive : null]}
          onPress={() => setTab('rented')}
        >
          <Text
            style={tab === 'rented' ? styles.tabTextActive : styles.tabText}
          >
            Rented
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
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
