import {useFocusEffect} from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { useCallback, useContext } from 'react';
import { Text, View, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import { Card, Button, Portal, IconButton, Badge } from 'react-native-paper';
import { JoinTeamPortal } from '../components/portal/join-team-portal';
import { Styles } from '../assets/styles';
import { FavorContext, AuthenticationContext, MenuContext} from '../context/menu-provider';

import { CardSkeleton } from '../components/card-skeleton';  
import { Cardstyles } from '../assets/styles';  
import { formatCurrency } from "react-native-format-currency";

import { hour, dns } from '../hooks/utils/data';

export const ScreenC = () => {

  const { card, cardBorder, cardImage, cardtitle, cardDescription, containerImageIcon, iconButton, badgeRigth, currencyText, currencyTextOffer, currencyTextNot } = Cardstyles();
      
  const { joinPortalDialogVisible, handleShow, handleHideAll} = useContext(MenuContext);
  const { userData } = useContext(AuthenticationContext); 
  const { error, favourites, findFavourite, addToFavourites, removeFromFavourites,           
          screens, addScreens, removeScreens  } = useContext(FavorContext);    

  useFocusEffect(
      useCallback(() => {
        return () => {
          if (joinPortalDialogVisible && screens.send==="ScreenC") {
            handleHideAll();
            removeScreens();
          }
        };
      }, [handleHideAll, joinPortalDialogVisible])
  );
  const [runScreen, setScreen] = useState(false);
  
  useEffect(() => {
    if (joinPortalDialogVisible && screens.send==="ScreenC") setScreen(true);
    else setScreen(false);
  }, [joinPortalDialogVisible, screens]);

  const onButtonPress = useCallback(() => {
    if (screens.send==="") {
      handleShow({
        dialogType: 'joinPortal',
      });
      addScreens({"send": "ScreenC", "receive": "JoinTeamPortal"});
    }
  }, [handleShow]);

  const [isLoading, setLoading] = useState(false);
  const [hotel, setHotel] = useState({});   
  const [indexRoom, setIndexRoom] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(-1);
  const [nerror, setError] = useState(null);
  const [hotels, setHotels] = useState([]);


  const filteredData = React.useMemo(
    () =>
      hotels.filter((hotel) => favourites.find((item) => item.id === hotel.id)),
    [hotels, favourites]
  );
  
  const getHotels = () => {
        fetch(dns + '/free-room/v1/hotels')
          .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setError('No se pudo accesar al servidor.');
              else return response.json();
          })
          .then((json) => {
            if (json && json.data) setHotels(json.data); 
            else setErrorUser('Error en el acceso al link de datos de la App.');
          })
          .catch((error) => { 
            if (errorUser==='') setErrorUser(error.toString()+' Error de conexión.');  
          })
          .finally(() => setLoading(false));
  }
    
  useEffect(() => {
    setLoading(true);
    getHotels();
    //Verificar si el hotel fue elimindo de la B.D. pero tenia favoritos en este device.
    if (favourites.length>0 && hotels.length>0) {         
      const newFavourites = hotels.filter((hotel) => 
                            favourites.find((item) => item.id === hotel.id));
      if (newFavourites===undefined || newFavourites===null || newFavourites.length<1) {           
          removeFromFavourites(favourites[0]);
      }
    }
  }, [favourites]);

  const { errorContainer, nestedCard } = Styles();    

  const getFormatCurrency = (id) => {
    const [valueFormattedWithSymbol] = formatCurrency({ amount: Number(id), code: 'EUR' });
    return valueFormattedWithSymbol;
  }

  const renderRooms = (item, index) => {     
    if (item.availability===0) return '';     
    var price  = getFormatCurrency(item.price); 
    var priceI = getFormatCurrency(item.price);     
    let showoffer = false;
    var hours = new Date().getHours(); //Current Hours
    if (item.onSale===1 && hours >= hour) {
      showoffer = true;
      priceI = getFormatCurrency(item.offerPrice);
    }
    return (
    <TouchableOpacity key={index} style={card}>        
        <Text style={cardtitle}>Room #{item.id}</Text>                
        <View style={containerImageIcon}>
         <Image
                source={{ uri: item.image1 }}
                style={cardImage}
                resizeMode="cover"                           
          />        
          {showoffer && (
            <View>              
              <Text style={showoffer?currencyTextOffer:currencyText}> {priceI} </Text>
              <Text style={currencyTextNot}> {price} </Text>
            </View>
          )}
          {!showoffer && (<Text style={currencyText}> {price} </Text>)}
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
  // 
  const  renderItem =  ({item}) => {         
    if (item.rooms.length<1) return '';
    let i = getAvail(item);
    return (
      <TouchableOpacity key={item.id} 
        onPress={() => {if (i>0 && userData.userType!=="HOTEL") {setHotel(item); onButtonPress();}}} 
      >
      <Card rounded style={{marginTop: 10, margin: 1}}>
        <Card.Content>
          <Card.Title
            title={item.name}                                   
          />          
          <IconButton                
                style={iconButton}
                icon={findFavourite(item)===true ? 'heart' : 'heart-outline'}                
                onPress={() => {
                  findFavourite(item)===false
                    ? addToFavourites(item)
                    : removeFromFavourites(item)
                  }}                 
          />
          {i>0 && (<Badge visible={true} style={badgeRigth} size={12}>{i}</Badge>)} 
          <View>                            
              <Text>{item.description} </Text>              
              <Text style={{fontSize: 10}}>{item.addres}</Text>
              <Text></Text>
          </View>          
          {i>0 && (
            <View style={{alignItems: "center"}}>
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
  return (
    <>
      {runScreen && (
        <Portal.Host>
          <JoinTeamPortal id={hotel}/>
        </Portal.Host>
      )}
      {runScreen ? undefined : (
        <View style={{ padding: 20 }}>
        {error && (<View style={errorContainer}><Text>{error}</Text></View>)}        
        {nerror && (<View style={errorContainer}><Text>{nerror}</Text></View>)}        
        {favourites.length<1 && ( 
          <CardSkeleton  /> 
          )}
        {isLoading ? <Text>Loading...</Text> :
        (          
          <FlatList 
            data={filteredData} // || favourites
            renderItem={renderItem}
            keyExtractor={({ id }) => id.toString()}
            removeClippedSubviews
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            onEndReachedThreshold={0.5}
            estimatedItemSize={100}
          />           
        )}         
        </View>
      )}
    </>
  );
};