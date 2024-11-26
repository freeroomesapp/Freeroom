import { 
  View, Image, ScrollView, Platform, Dimensions, StyleSheet
} from 'react-native';
import { Cardstyles } from '../assets/styles';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 3.25;
const CARD_WIDTH = CARD_HEIGHT - 20;

export const PhotoGallery = ({id}) => {
  const PHOTOS = Array.from({ length: 4 }).map(
    (_, i) => `https://unsplash.it/300/300/?random&__id=${id}${i}`
  );

const { container, containerMarket, triangle, bubble, button, buttonContain, card, cardImage, textContent, cardtitle, cardDescription, iconButton } = Cardstyles();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {PHOTOS.map((uri) => (
        <View key={uri} style={card}>
          <Image source={{ uri }} style={cardImage} />
        </View>
      ))}
    </ScrollView>    
  );
};
const styles = StyleSheet.create({
  ...Platform.select({
    default: {
      content: {
        flexDirection: 'row',
        //flexWrap: 'wrap',
        padding: 4,
      },
      item: {
        height: Dimensions.get('window').width / 2,
        width: '100%',
        padding: 4,
      },
    },
  }),  
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  screen: {
    flex: 1,
  },
});