import { 
  View, Image, ScrollView, Platform, Dimensions, StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 3.25;
const CARD_WIDTH = CARD_HEIGHT - 20;

const PhotoGallerys = ({ route }: Route) => {
  const PHOTOS = Array.from({ length: 10 }).map(
    (_, i) => `https://unsplash.it/300/300/?random&__id=${route.key}${i}`
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {PHOTOS.map((uri) => (
        <View key={uri} style={styles.item}>
          <Image source={{ uri }} style={styles.photo} />
        </View>
      ))}
    </ScrollView>    
  );
};

const styles = StyleSheet.create({
  ...Platform.select({
    /*
    web: {
      content: {
        // there is no 'grid' type in RN :(
        display: '',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gridRowGap: '8px',
        gridColumnGap: '8px',
        padding: 8,
      },
      item: {
        width: '100%',
        height: 150,
      },
    },
    */
    default: {
      content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
      },
      item: {
        height: Dimensions.get('window').width / 2,
        width: '50%',
        padding: 4,
      },
    },
  }),
  photo: {
    flex: 1,
    resizeMode: 'cover',
  }
});