import { supabase } from '../../lib/supabase'

const findExistingConversation = async (userA, userB) => {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .in('user_id', [userA, userB])

  if (error) {
    throw error
  }

  // Group by conversation_id
  const grouped = data.reduce((acc, row) => {
    acc[row.conversation_id] = acc[row.conversation_id] || []
    acc[row.conversation_id].push(row.user_id)
    return acc
  }, {})

  for (const [conversationId, users] of Object.entries(grouped)) {
    if (users.length === 2) return conversationId
  }

  return null
}

const createConversation = async (userA, userB, carId) => {
  const { data: conversation } = await supabase
    .from('conversations')
    .insert({
      car_id: carId 
    })
    .select()
    .single()
  await supabase.from('conversation_participants').insert([
    { conversation_id: conversation.id, user_id: userA },
    { conversation_id: conversation.id, user_id: userB },
  ])

  return conversation.id
}

export async function startOrSendMessage(otherUserId, text, carId){
  const { data: user } = await supabase.auth.getUser()
  const myId = user.user.id

  let conversationId = await findExistingConversation(myId, otherUserId)

  if (!conversationId) {
    conversationId = await createConversation(myId, otherUserId, carId)
  }

  // only send a message if text is provided and non-empty
  if (text && text.trim().length > 0) {
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: myId,
      content: text,
    })
  }

  return conversationId
}

// fetch all conversations for the currently authenticated user
export async function fetchConversations() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return []

  // first, get all conversation ids the user participates in
  const { data: rows, error } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', user.id)
  if (error) {
    throw error
  }

  const ids = rows.map((r) => r.conversation_id)
  if (ids.length === 0) return []

  // for each conversation, load the other participant and last message
  const conversations = await Promise.all(
    ids.map(async (conversationId) => {
      // load the other user in this conversation
      const { data: participants } = await supabase
      .from('conversation_participants')
  .select()
  .eq('conversation_id', conversationId)
  .neq('user_id', user.id) // exclude yourself
  .single() 

  //User info of the other participant
      const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', participants.user_id)
      .single()

      const otherUser = data || null

      // load th car id in conversation
       const { data: car } = await supabase
            .from('conversations')
            .select('car_id')
            .eq('id', conversationId)
            .single()

      // load the last message (most recent)
      const { data: msgs } = await supabase
        .from('messages')
        .select('id, content, sender_id, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1)

      const lastMessage = msgs?.[0] || null

      return {
        id: conversationId,
        otherUser,
        lastMessage,
        fromOtherUser: lastMessage?.sender_id != user.id,
        car
      }
    }),
  )

  return conversations
}

// fetch all messages inside a conversation id (ordered ascending)
export async function fetchMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, content, sender_id, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export async function sendMessage(conversationId, text) {
  const { data: user } = await supabase.auth.getUser()
  const myId = user.user.id

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: myId,
    content: text,
  })

  if (error) {
    throw error
  }
}

