import {useFocusEffect} from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { useCallback, useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Card, Button, Portal, ActivityIndicator, IconButton } from 'react-native-paper';
import { useFlatListHelpers } from '../hooks/lists/use-flat-list-helper';
import { JoinTeamPortal } from '../components/portal/join-team-portal';
import { Styles, Cardstyles } from '../assets/styles';

import { MenuContext } from '../context/menu-provider';
import { hotels, reserva } from '../hooks/utils/data';
import { dns } from '../hooks/utils/data';

import { PhotoGallery } from '../screens/Screen-D';

export const ScreenB = () => {
  
  const { joinPortalDialogVisible, handleShow, handleHideAll} = useContext(MenuContext);
  const { keyExtractor } = useFlatListHelpers();
  const { errorContainer, buttonContainer, nestedButtonContainer } = Styles();
  const { cardError, cardtitle, cardDescription } = Cardstyles();

  useFocusEffect(
      useCallback(() => {
        return () => {
          if (joinPortalDialogVisible) {
            handleHideAll();
          }
        };
      }, [handleHideAll, joinPortalDialogVisible])
  );

  const onButtonPress = useCallback(() => {
    handleShow({
      dialogType: 'joinPortal',
    });
  }, [handleShow]);

  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [users, setData] = useState([]);

  const filteredData = React.useMemo(
    () =>
      hotels.filter((hotel) => reserva.find((item) => item.hotel_id === hotel.id)),
    []
  );

  const Ant_filteredData = React.useMemo(
    () =>
      hotels.filter((hotel) => reserva.find((item) => item.hotel_id === hotel.id)),
    []
  );
  
    getUsers = () => {
        fetch(dns + '/free-room/v1/hotels')
          .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setError('No se pudo accesar al servidor. Se usaran datos temporales.');
              else return response.json();
          })
          .then((json) => setData(json.data))
          .catch((error) => { 
            if (error===null) setError(error); 
            //setData(filteredData); 
            setData(hotels); 
          })
          .finally(() => setLoading(false));
    }

    useEffect(() => {
        setLoading(true);
        getUsers();
        //setFavor(favorites);
        //setLoading(false);
    }, []);

    const { nestedCard } = Styles();
    
    renderItem = ({item}) => 
      <TouchableOpacity
          onPress={() => {setUser(item.id); onButtonPress();}} 
      >
      <Card rounded style={nestedCard}>
        <Card.Content>
          <Card.Title
            title={item.name}                                   
          />
          <View>                            
              <Text>{item.description} </Text>              
              <Text>{item.addres} </Text> 
              <Text>{item.startDate}</Text>              
          </View> 
          {PhotoGallery(item)}
        </Card.Content>
      </Card>
    </TouchableOpacity>

  return (
    <>
      {joinPortalDialogVisible && (
        <Portal.Host>
          <JoinTeamPortal id={user}/>
        </Portal.Host>
      )}
      {joinPortalDialogVisible ? undefined : (
        <>
        {error && (<View style={cardError}>
          <Text style={cardtitle}>Warning:</Text>
          <Text style={cardDescription}>{error.toString()}</Text>
        </View>)}
        {isLoading ? <ActivityIndicator animating={true} /> :
        (
          <FlashList
            data={users} //{favors.length > 0 ? filteredData : hotels}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            removeClippedSubviews
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            onEndReachedThreshold={0.5}
            estimatedItemSize={100}
          /> 
        )}         
        </>
      )}
    </>
  );
};
