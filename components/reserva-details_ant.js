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

  return (
    <>
    <Card style={styles.contentCard} elevation={4}>      
      <Card.Content>
        <Card.Title title="Details" />         
        {reserva[0].startDate && (
          <List.Item style={cardDescription}
            title="Check-In-Out"
            description={reserva[0].startDate+'\n'+reserva[0].endDate}
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
});
