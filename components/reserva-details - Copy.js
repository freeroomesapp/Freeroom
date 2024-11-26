import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, List, TouchableRipple, ScrollView, View } from "react-native-paper";
//import { Context as RestaurantContext } from "../contexts/RestaurantContext";
import { Cardstyles } from '../assets/styles';
import { hotels, reserva } from '../hooks/utils/data';
import { LiteCreditCardInput} from "react-native-credit-card-input-plus";

export const ReservaDetail = () => {
//const ReservaDetail= () => {
  //const { state } = useContext(RestaurantContext);
  
  const { cardError, container, containerMarket, triangle, maps, bubble, button, buttonContain, card, cardImage, textContent, cardtitle, cardDescription, containerImageIcon, iconButton, currencyText, distanceText, currencyRowText, loading, reload, searchbar } = Cardstyles();
  const navigation = useNavigation();

  //if (!state || !state.selectedRestaurant) {
  //  return null;
  //}

const [ncard, setCard] = React.useState({})
  //const [formData, setFormData] = useState<CreditCardFormData>(undefined); 

  const onChange = (formData) => {
    console.log(JSON.stringify(formData, null, " "));
  };
  //<View>
  //      <Text>{JSON.stringify(card, null, 2)}</Text>
  //</View>
  const onFocus = (field) => {
    console.log("focusing", field);
  };

  return (
    <>
    <Card style={styles.contentCard} elevation={4}>
      <Card.Title title="Details" />
      <Card.Content>
        {reserva[0].startDate && (
          <List.Item style={cardDescription}
            title={reserva[0].startDate+'\n'+reserva[0].endDate}
            titleNumberOfLines={4}
            left={(props) => <List.Icon {...props} icon="calendar-clock" />}
          />
        )}
        {reserva[0].status==='PENDING' && (
          <List.Item 
            title={reserva[0].room.price}
            left={(props) => <List.Icon {...props} icon="cash" />}
            right={(props) => <List.Icon {...props} icon="thumb-down-outline" />}
          />
        )}
        {reserva[0].status==='PAID' && (
          <List.Item
            title={reserva[0].room.price}
            left={(props) => <List.Icon {...props} icon="cash" />}
            right={(props) => <List.Icon {...props} icon="thumb-up-outline" />}
          />
        )}
        <List.Item
          title={reserva[0].hotel.addres}
          titleNumberOfLines={2}
          left={(props) => <List.Icon {...props} icon="map-marker" />}
        />
        {reserva[0].hotel.phone && (
          <TouchableRipple
            onPress={() =>
              navigation.navigate("Call", {
                phoneNumbers: reserva[0].hotel.phone,
              })
            }
          >
            <List.Item
              title={reserva[0].hotel.phone}
              titleNumberOfLines={1}
              left={(props) => <List.Icon {...props} icon="phone" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </TouchableRipple>
        )}
      </Card.Content>
    </Card>            
    </>
  );
};

const styles = StyleSheet.create({
  contentCard: { marginHorizontal: 8, marginBottom: 8 },
  container: {
    flex:1, 
    width: '100%',
    marginHorizontal: 'auto',
    marginTop: 10,
    marginBottom: 10, 
    backgroundColor: "#F5F5F5",
  },
  input: {
    fontSize: 12,
    color: "black",
  },
});

//export default ReservaDetail;