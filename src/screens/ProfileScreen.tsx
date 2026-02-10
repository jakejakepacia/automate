import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { supabase } from '../../lib/supabase'

type Props = {
  user: any
  onSignOut: () => Promise<void>
}

export default function ProfileScreen({ user, onSignOut }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{user?.email ?? '—'}</Text>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Sign out"
          onPress={async () => {
            await supabase.auth.signOut()
            await onSignOut()
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
  label: { color: '#666', marginTop: 8 },
  value: { fontSize: 16, marginTop: 4 },
})
