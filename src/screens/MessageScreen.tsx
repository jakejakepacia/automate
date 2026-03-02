import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fetchConversations } from '../services/message'

export default function MessageScreen({ navigation }) {
  const [conversations, setConversations] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      loadConversations()
    }
  }, [isFocused])

  const loadConversations = async () => {
    try {
      const convos = await fetchConversations()
      setConversations(convos)
    } catch (err) {
      console.log('loadConversations error', err)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadConversations()
    setRefreshing(false)
  }

  const renderItem = ({ item }: any) => {
    const other = item.otherUser
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Conversation', {
            conversationId: item.id,
            otherUser: other,
          })
        }
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderColor: '#eee',
          backgroundColor: '#fff',
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {other?.name || 'Unknown'}
        </Text>
        {item.lastMessage && (
          <Text numberOfLines={1} style={{ color: '#555', marginTop: 4 }}>
            {item.lastMessage.content}
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={{ padding: 20 }}>
            <Text>No conversations yet.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}
