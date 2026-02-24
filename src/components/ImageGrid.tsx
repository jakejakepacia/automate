import React from 'react'
import { View, Image, FlatList, TouchableOpacity } from 'react-native'
import { IconButton } from 'react-native-paper'
export default function ImageGrid({ images, setImages }) {
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <FlatList
      data={images}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3}
      contentContainerStyle={{ gap: 10 }}
      columnWrapperStyle={{ gap: 10 }}
      renderItem={({ item, index }) => (
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: item }}
            style={{
              width: 110,
              height: 110,
              borderRadius: 12,
            }}
          />

          {/* Remove button */}
          <IconButton
            icon="close"
            size={18}
            iconColor="white"
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
            onPress={() => removeImage(index)}
          />
        </View>
      )}
    />
  )
}
