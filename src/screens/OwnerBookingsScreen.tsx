import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import NavigationBar from '../components/NavigationBar'
import { Colors } from '../constants/colors'
import { formatPHP } from '../constants/formatPHP'
import { fetchOwnerBookingsByCar, updateBookingStatus } from '../services/api'
import { startOrSendMessage } from '../services/message'

const STATUS_LABELS = {
  pending: 'Requested',
  approved: 'Scheduled',
}

export default function OwnerBookingsScreen({ route, navigation }) {
  const { car, initialStatus = 'pending' } = route.params
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>(
    initialStatus,
  )
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionBookingId, setActionBookingId] = useState<string | null>(null)

  const loadBookings = useCallback(async () => {
    setLoading(true)
    const result = await fetchOwnerBookingsByCar(car.id, activeTab)
    setBookings(result || [])
    setLoading(false)
  }, [activeTab, car.id])

  useFocusEffect(
    useCallback(() => {
      loadBookings()
    }, [loadBookings]),
  )

  const handleMessageRenter = async (booking: any) => {
    const renter = Array.isArray(booking.users) ? booking.users[0] : booking.users

    if (!renter?.id) return

    const conversationId = await startOrSendMessage(renter.id, '', booking.car_id)

    navigation.navigate('Conversation', {
      conversationId,
      otherUser: renter,
      car: { car_id: booking.car_id },
    })
  }

  const handleBookingAction = async (
    bookingId: string,
    nextStatus: 'approved' | 'rejected',
  ) => {
    setActionBookingId(bookingId)
    await updateBookingStatus(bookingId, nextStatus)
    await loadBookings()
    setActionBookingId(null)
  }

  const renderBooking = ({ item }: { item: any }) => {
    const renter = Array.isArray(item.users) ? item.users[0] : item.users
    const isProcessing = actionBookingId === item.id

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.renterName}>{renter?.name || 'Unknown renter'}</Text>
            <Text style={styles.metaText}>{renter?.city || 'No city provided'}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              {STATUS_LABELS[item.status] || item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.metaText}>
          {`From: ${item.start_date || '-'} • To: ${item.end_date || '-'}`}
        </Text>
        <Text style={styles.amountText}>
          {`Total: ${formatPHP(item.total_price || item.initial_price || 0)}`}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => handleMessageRenter(item)}
          >
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>

          {activeTab === 'pending' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleBookingAction(item.id, 'rejected')}
                disabled={isProcessing}
              >
                <Text style={styles.rejectButtonText}>
                  {isProcessing ? 'Updating...' : 'Reject'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleBookingAction(item.id, 'approved')}
                disabled={isProcessing}
              >
                <Text style={styles.acceptButtonText}>
                  {isProcessing ? 'Updating...' : 'Accept'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar title={`${car.make} ${car.model} Bookings`} navigation={navigation} />

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' ? styles.tabActive : null]}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            style={activeTab === 'pending' ? styles.tabTextActive : styles.tabText}
          >
            Requested
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'approved' ? styles.tabActive : null]}
          onPress={() => setActiveTab('approved')}
        >
          <Text
            style={activeTab === 'approved' ? styles.tabTextActive : styles.tabText}
          >
            Scheduled
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={bookings.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {`No ${STATUS_LABELS[activeTab].toLowerCase()} bookings yet.`}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#eef1f5',
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: '#334155',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  renterName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  metaText: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 6,
  },
  amountText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  statusPill: {
    backgroundColor: '#e8eefc',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageButton: {
    backgroundColor: '#e2e8f0',
  },
  messageButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  rejectButton: {
    backgroundColor: '#fee2e2',
  },
  rejectButtonText: {
    color: '#b91c1c',
    fontWeight: '700',
  },
  acceptButton: {
    backgroundColor: '#dcfce7',
  },
  acceptButtonText: {
    color: '#15803d',
    fontWeight: '700',
  },
})
