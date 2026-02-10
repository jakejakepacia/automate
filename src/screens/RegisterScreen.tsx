import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native'
import { supabase } from '../../lib/supabase'

type Props = {
  onRegistered: (user: any | null) => void
  onCancel?: () => void
}

export default function RegisterScreen({ onRegistered, onCancel }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSignUp() {
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const res = await supabase.auth.signUp({ email, password })
      if (res.error) {
        setError(res.error.message)
      } else {
        if (res.data?.user) {
          onRegistered(res.data.user)
        } else {
          setMessage('Check your email for a confirmation link.')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Create account" onPress={handleSignUp} />
      )}
      <View style={{ marginTop: 12 }}>
        <Button title="Back to Sign In" onPress={onCancel} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  message: {
    color: 'green',
    marginBottom: 8,
  },
})
