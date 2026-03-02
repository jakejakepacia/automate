import { supabase } from '../../lib/supabase'

const findExistingConversation = async (userA, userB) => {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .in('user_id', [userA, userB])

  if (error) {
    console.log(error)
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

const createConversation = async (userA, userB) => {
  const { data: conversation } = await supabase
    .from('conversations')
    .insert({})
    .select()
    .single()

  await supabase.from('conversation_participants').insert([
    { conversation_id: conversation.id, user_id: userA },
    { conversation_id: conversation.id, user_id: userB },
  ])

  return conversation.id
}

export async function startOrSendMessage(otherUserId, text){
  const { data: user } = await supabase.auth.getUser()
  const myId = user.user.id

  let conversationId = await findExistingConversation(myId, otherUserId)

  if (!conversationId) {
    conversationId = await createConversation(myId, otherUserId)
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

    console.log("conversation p: ", rows)
  if (error) {
    console.log('fetchConversations error', error)
    throw error
  }

  const ids = rows.map((r) => r.conversation_id)
  console.log(ids)
  if (ids.length === 0) return []

  // for each conversation, load the other participant and last message
  const conversations = await Promise.all(
    ids.map(async (conversationId) => {
      // load the other user in this conversation
      const { data: participants } = await supabase
      .from('conversation_participants')
  .select('user_id, users(id, name, profile_image)')
  .eq('conversation_id', conversationId)
  .neq('user_id', user.id) // exclude yourself
  .limit(1) 

        console.log("participants: ", participants)

      const otherUser = participants?.[0]?.users || null

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
      }
    }),
  )

  console.log(conversations)
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
    console.log('fetchMessages error', error)
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
    console.log('sendMessage error', error)
    throw error
  }
}


