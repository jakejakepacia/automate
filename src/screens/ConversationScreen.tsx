import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fetchMessages, sendMessage } from '../services/message'
import { supabase } from '../../lib/supabase'

export default function ConversationScreen({ route, navigation }) {
  const { conversationId, otherUser } = route.params
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [myId, setMyId] = useState<string | null>(null)
  const flatListRef = useRef<any>(null)

  useEffect(() => {
    navigation.setOptions({ title: otherUser?.name || 'Conversation' })
    getCurrentUser()
    loadMessages()

    // subscribe to realtime updates so the list refreshes automatically
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const getCurrentUser = async () => {
    const { data } = await supabase.auth.getUser()
    setMyId(data.user?.id || null)
  }

  const loadMessages = async () => {
    const msgs = await fetchMessages(conversationId)
    setMessages(msgs || [])
    // scroll to bottom after new load
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 200)
  }

  const handleSend = async () => {
    if (!text.trim()) return
    await sendMessage(conversationId, text)
    setText('')
    // new message will be added via realtime but also reload to be safe
    // loadMessages()
  }

  const renderItem = ({ item }: any) => {
    const isMine = item.sender_id === myId
    return (
      <View
        style={{
          alignSelf: isMine ? 'flex-end' : 'flex-start',
          backgroundColor: isMine ? '#DCF8C6' : '#FFFFFF',
          padding: 10,
          marginVertical: 4,
          borderRadius: 8,
          maxWidth: '80%',
        }}
      >
        <Text>{item.content}</Text>
        <Text style={{ fontSize: 10, alignSelf: 'flex-end', color: '#555' }}>
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View
          style={{
            flexDirection: 'row',
            padding: 8,
            borderTopWidth: 1,
            borderColor: '#ddd',
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: '#fff',
            }}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
          />
          <TouchableOpacity
            onPress={handleSend}
            style={{
              justifyContent: 'center',
              marginLeft: 8,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
