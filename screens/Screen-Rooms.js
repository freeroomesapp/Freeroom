import { 
  View, Image, ScrollView, Platform, Dimensions, StyleSheet
} from 'react-native';
import { Cardstyles } from '../assets/styles';
import { hotels } from '../hooks/utils/data';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 3.25;
const CARD_WIDTH = CARD_HEIGHT - 20;

export const Romms = props => {    
  const  id  = props.id //Id Hotel
  //LLamar así: <Rooms id={1}  />;

  const [nhotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  setRooms(nhotels[id].rooms);

  return (
    <ScrollView>
      
    </ScrollView>    
  );
};
