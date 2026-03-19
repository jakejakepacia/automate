import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { fetchUserInfo } from '../services/api'

type Props = {
  user: any
  onSignOut: () => Promise<void>
  navigation: any
}

export default function ProfileScreen({ user, onSignOut, navigation }: Props) {
  const [userInfo, setUserInfo] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await fetchUserInfo()
      setUserInfo(data)
      setLoading(false)
    }

    load()
  }, [])

  const displayName =
    userInfo?.name ?? user?.email?.split('@')[0] ?? 'Your profile'

  const avatarUri =
    userInfo?.image ??
    user?.user_metadata?.avatar_url ??
    'https://picsum.photos/200'

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{user?.email ?? '—'}</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 28 }}
          size="small"
          color="#192f6a"
        />
      ) : (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account details</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Full name</Text>
            <Text style={styles.rowValue}>{userInfo?.name ?? '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue}>{user?.email ?? '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Member since</Text>
            <Text style={styles.rowValue}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : '—'}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#f2f2f7',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },
  profileCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
  },
  rowLabel: {
    color: '#6b7280',
  },
  rowValue: {
    fontWeight: '600',
    color: '#111827',
  },
  signOutButton: {
    marginTop: 24,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
})
