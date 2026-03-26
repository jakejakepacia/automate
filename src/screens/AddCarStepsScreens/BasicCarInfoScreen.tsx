import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native'
import { TextInput } from 'react-native-paper'
import { Colors } from '../../constants/colors'
export default function BasicCarInfoScreen({ formData, setFormData }) {
  return (
    <ScrollView style={{ gap: 10 }} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'MyHeaderFontBold', fontSize: 20 }}>
          {' '}
          Step 2: Basic Information{' '}
        </Text>
        <Text style={{ fontFamily: 'MyHeaderFontRegular', fontSize: 16 }}>
          Enter the basic information exactly as it appears on the vehicle
          registration.
        </Text>
      </View>

      <View style={{ gap: 20, marginTop: 20 }}>
        <TextInput
          label="Make"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.make}
          onChangeText={(text) => setFormData({ ...formData, make: text })}
        />

        <TextInput
          label="Model"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.model}
          onChangeText={(text) => setFormData({ ...formData, model: text })}
        />

        <View style={{ gap: 10, flexDirection: 'row' }}>
          <TextInput
            style={{ flex: 1 }}
            label="Year"
            mode="outlined"
            keyboardType="numeric"
            outlineColor={Colors.primary}
            activeOutlineColor={Colors.primary}
            value={formData.year}
            onChangeText={(text) => setFormData({ ...formData, year: text })}
          />
          <TextInput
            style={{ flex: 1 }}
            label="Color"
            mode="outlined"
            outlineColor={Colors.primary}
            activeOutlineColor={Colors.primary}
            value={formData.color}
            onChangeText={(text) => setFormData({ ...formData, color: text })}
          />
        </View>

        <TextInput
          label="Plate number"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.plate_number}
          onChangeText={(text) =>
            setFormData({ ...formData, plate_number: text })
          }
        />
      </View>
    </ScrollView>
  )
}
