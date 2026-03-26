import React, { useEffect, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  StyleSheet,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fetchConversations } from '../services/message'
import { Colors } from '../constants/colors'

function getFallbackAvatar(name?: string) {
  const label = encodeURIComponent(name || 'User')
  return `https://ui-avatars.com/api/?name=${label}&background=E2E8F0&color=334155`
}

export default function MessageScreen({ navigation }) {
  const [conversations, setConversations] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const pulse = useRef(new Animated.Value(0.55)).current

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      loadConversations()
    }
  }, [isFocused])

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    )

    animation.start()

    return () => {
      animation.stop()
    }
  }, [pulse])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const convos = await fetchConversations()
      setConversations(convos)
    } catch (err) {
      return
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadConversations()
    setRefreshing(false)
  }

  const renderItem = ({ item }: any) => {
    const other = item.otherUser
    const car = item.car
    const avatarUri =
      other?.profile_image || other?.image || getFallbackAvatar(other?.name)

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Conversation', {
            conversationId: item.id,
            otherUser: other,
            car: car,
          })
        }
        style={styles.messageCard}
      >
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.messageBody}>
          <Text style={styles.messageName}>{other?.name || 'Unknown'}</Text>
          {item.lastMessage && (
            <Text numberOfLines={1} style={styles.messagePreview}>
              {item.fromOtherUser ? '' : 'You:'} {item.lastMessage.content}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingTitle}>Loading your conversations</Text>
      <Text style={styles.loadingSubtitle}>
        Pulling recent chats and renter updates.
      </Text>

      {[0, 1, 2, 3].map((item) => (
        <Animated.View
          key={item}
          style={[styles.skeletonCard, { opacity: pulse }]}
        >
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonTextGroup}>
            <View style={styles.skeletonName} />
            <View style={styles.skeletonMessage} />
          </View>
        </Animated.View>
      ))}
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {loading && !refreshing ? (
        renderLoadingState()
      ) : (
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Messages from renters and owners will show up here once a chat
              starts.
            </Text>
          </View>
        )}
      />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#f5f5f5',
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  skeletonCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  skeletonAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#dbe3ef',
    marginRight: 14,
  },
  skeletonTextGroup: {
    flex: 1,
    gap: 10,
  },
  skeletonName: {
    height: 15,
    width: '45%',
    borderRadius: 999,
    backgroundColor: '#dbe3ef',
  },
  skeletonMessage: {
    height: 12,
    width: '78%',
    borderRadius: 999,
    backgroundColor: '#e8edf5',
  },
  messageCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e2e8f0',
  },
  messageBody: {
    flex: 1,
  },
  messageName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0f172a',
  },
  messagePreview: {
    color: '#555',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 21,
  },
})
