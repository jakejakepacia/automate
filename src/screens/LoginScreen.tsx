import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native'
import { supabase } from '../../lib/supabase'
import RegisterScreen from './RegisterScreen'

type Props = {
  onLogin: (user: any) => void
}

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRegister, setShowRegister] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    setError(null)
    try {
      const res = await supabase.auth.signInWithPassword({ email, password })
      if (res.error) {
        setError(res.error.message)
      } else if (res.data?.user) {
        onLogin(res.data.user)
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (showRegister) {
    return (
      <RegisterScreen
        onRegistered={(user) => {
          if (user) onLogin(user)
          setShowRegister(false)
        }}
        onCancel={() => setShowRegister(false)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
        <Button title="Sign In" onPress={handleSignIn} />
      )}
      <View style={{ marginTop: 12 }}>
        <Button title="Create account" onPress={() => setShowRegister(true)} />
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
})
