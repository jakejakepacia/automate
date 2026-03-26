import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.4
export default function CarCategoriesCard({
  image,
  title,
  subtitle,
  selected,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected, { width: CARD_WIDTH }]}
      onPress={onPress}
    >
      <Image source={image} style={styles.image} contentFit="contain" />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,

    margin: 4,
  },

  selected: {
    borderWidth: 2,
    borderColor: '#007BFF',
    backgroundColor: '#EAF2FF',
  },

  image: {
    width: '60%',
    aspectRatio: 1,
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
})
