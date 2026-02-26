import { Text, View, ScrollView, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

import { TextInput } from 'react-native-paper'
import { Colors } from '../../constants/colors'
export default function CarPricingScreen({ formData, setFormData }) {
  const [checked, setChecked] = useState(formData.with_driver)

  const setRentWithDriver = () => {
    setChecked(!checked)
    setFormData({ ...formData, with_driver: !checked })
  }

  return (
    <ScrollView style={{ gap: 20 }} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'MyHeaderFontBold', fontSize: 20 }}>
          Step 1: Rental Pricing{' '}
        </Text>
        <Text style={{ fontFamily: 'MyHeaderFontRegular', fontSize: 16 }}>
          Enter car pricing per day, week and month.
        </Text>
      </View>
      <View style={{ gap: 20, marginTop: 20 }}>
        <TextInput
          label="Daily"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.daily}
          onChangeText={(text) => setFormData({ ...formData, daily: text })}
        />

        <TextInput
          label="Weekly"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.weekly}
          onChangeText={(text) => setFormData({ ...formData, weekly: text })}
        />

        <TextInput
          label="Monthly"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.monthly}
          onChangeText={(text) => setFormData({ ...formData, monthly: text })}
        />

        <View style={styles.container}></View>
        <Pressable style={styles.container} onPress={setRentWithDriver}>
          {checked ? (
            <MaterialIcons name="check-box" size={34} color="#007AFF" />
          ) : (
            <MaterialIcons
              name="check-box-outline-blank"
              size={34}
              color="#ccc"
            />
          )}
          <Text style={styles.label}>Rent with Driver</Text>
        </Pressable>

        {checked && (
          <TextInput
            label="Driver price per day"
            mode="outlined"
            outlineColor={Colors.primary}
            activeOutlineColor={Colors.primary}
            value={formData.driver_price_per_day}
            onChangeText={(text) =>
              setFormData({ ...formData, driver_price_per_day: text })
            }
          />
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  label: { marginLeft: 10, fontSize: 16 },
})
