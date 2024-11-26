import {useFocusEffect} from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useCallback, useContext } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Card, Button, Portal, IconButton, FlatList } from 'react-native-paper';
import { useFlatListHelpers } from '../hooks/lists/use-flat-list-helper';
import { JoinTeamPortal } from '../components/portal/join-team-portal';
import { Styles } from '../assets/styles';
import { FavorContext, MenuContext} from '../context/menu-provider';

import { CardSkeleton } from '../components/card-skeleton'; 
import { MapSkeleton } from '../components/map-skeleton'; 
//import { SkeletonLoadingCard } from '../components/skeleton-card';
import { PhotoGallery } from '../screens/Screen-D';        
import { Cardstyles } from '../assets/styles';  
import { formatCurrency } from "react-native-format-currency";
//import { hotels } from '../hooks/utils/data';
import { dns } from '../hooks/utils/data';

export const ScreenC = () => {

  const { cardError, container, containerMarket, triangle, maps, bubble, button, buttonContain, card, cardBorder, cardImage, textContent, cardtitle, cardDescription, containerImageIcon, iconButton, currencyText, distanceText, currencyRowText, loading, reload, searchbar, containerFlat } = Cardstyles();

  //const {findFavourite, addToFavourites, removeFromFavourites } = useContext(FavorContext);
      
  const { joinPortalDialogVisible, handleShow, handleHideAll} = useContext(MenuContext);
    
  const { keyExtractor } = useFlatListHelpers();

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

  const [isLoading, setLoading] = useState(false);
  const [hotel, setHotel] = useState({});   
  const [indexRoom, setIndexRoom] = useState(0);
  const [roomToReserva, setRoomToReserva] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(-1);
  
  const [nerror, setError] = useState(null);

  const [hotels, setHotels] = useState([]);

  const { error, favourites } = useContext(FavorContext);

  const filteredData = React.useMemo(
    () =>
      hotels.filter((hotel) => favourites.find((item) => item.id === hotel.id)),
    [hotels, favourites]
  );
  
  const getHotels = () => {
        fetch(dns + '/free-room/v1/hotels/')
          .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setError('No se pudo accesar al servidor.');
              else return response.json();
          })
          .then((json) => {
            setHotels(json.data);
          })
          .catch((error) => setError("Server no find."))
          .finally(() => setLoading(false));
  }
    
  useEffect(() => {
      //  setLoading(true);
      //  getHotels();
    }, []);

    const { errorContainer, nestedCard } = Styles();    

  getFormatCurrency = (id) => {
    const [valueFormattedWithSymbol] = formatCurrency({ amount: Number(id), code: 'EUR' });
    return valueFormattedWithSymbol;
  }

  const renderRooms = (item, index) => {     
    if (item.availability===0) return '';     
    return (
    <TouchableOpacity style={[card, index === selectedRoom ? cardBorder: ""]}
        onPress={() => {          
          setSelectedRoom(index);           
          setIndexRoom(index);
          //setUser({...user, "index": index});
          //onButtonPress();
        }}         
        >        
        <Text style={cardtitle}>Room #{item.id}</Text>                
        <View style={containerImageIcon}>
         <Image
                source={{ uri: item.image1 }}
                style={cardImage}
                resizeMode="cover"                           
          />   
          <IconButton                
                style={iconButton}                
                icon={item.availability===0 ? 'lock' : 'lock-open-variant'}
          />      
          <Text style={currencyText}>{getFormatCurrency(item.price)}</Text>  
        </View>
        <Text numberOfLines={1} style={cardDescription}>{item.details}</Text>   
    </TouchableOpacity>
    );
  };

  const getAvail = (data) => {
    let i = 0;   
    if (data.rooms && data.rooms.length>0) { 
      let rooms = data.rooms; rooms.map((end, index) => {if (end.availability===1) i = i + 1; })
    }
    return i;
  }
  //{PhotoGallery(item)} 
  //const [hotel, setHotel] = useState([]);setHotel(hotels.find((item) => item.id === id));
  //setRooms(hotels.find((hotel) => hotel.id===item.id).rooms);    
  const  renderItem =  ({item, index}) => {     
    setHotel(item);
    //if (item.rooms.length<1) return '';
    //getHotel(item.id);
    let i = getAvail(item);
    return (
      <TouchableOpacity
        onPress={() => {
          if (i>0) {
            setHotel({...item, "index": indexRoom}); onButtonPress();}
          }
        } 
      >
      <Card rounded style={nestedCard}>
        <Card.Content>
          <Card.Title
            title={item.name}                                   
          />
          <View>                            
              <Text>{item.description} </Text>              
              <Text style={{fontSize: 10}}>{item.addres}</Text>
              {i<1  && (<Text style={{fontSize: 8}}>No Rooms</Text>)}
              {i===1 && (<Text style={{fontSize: 8}}>Un Room disponible.</Text>)}
              {i>1  && (<Text style={{fontSize: 8}}>{i} rooms disponible.</Text>)}
          </View>          
          {i>0 && (
            <View>
              <ScrollView horizontal={true} style={{ flex: 1, paddingBottom: 12 }}>          
                {item.rooms.map((it, ind) => renderRooms(it,ind))}
              </ScrollView>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
    );
  };
//setUser({...user, "name": indexRoom, "password": item.password});
  return (
    <>
      {joinPortalDialogVisible && (
        <Portal.Host>
          <JoinTeamPortal id={hotel}/>
        </Portal.Host>
      )}
      {joinPortalDialogVisible ? undefined : (
        <>
        {error && (<View style={errorContainer}><Text>{error}</Text></View>)}        
        {nerror && (<View style={errorContainer}><Text>{nerror}</Text></View>)}        
        {favourites.length<1 && ( 
          <CardSkeleton  /> //<CardSkeleton /> 
          )}
        {isLoading ? <Text>Loading...</Text> :
        (
          <FlashList
            data={favourites}
            renderItem={(item, index) => renderItem(item,index)}
            keyExtractor={({ id }) => id.toString()}
            //removeClippedSubviews
            //maxToRenderPerBatch={10}
            //initialNumToRender={10}
            //onEndReachedThreshold={0.5}
            //estimatedItemSize={100}
          /> 
        )}         
        </>
      )}
    </>
  );
};