import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useCallback, useState, useContext } from 'react';
import { View, Text, ScrollView, Image, FlatList, StyleSheet, 
         Platform, RefreshControl, TouchableOpacity } from 'react-native';
import { MenuContext} from '../context/menu-provider';
import { Card, IconButton, ActivityIndicator, Portal, Badge } from 'react-native-paper';
import { Styles, Cardstyles } from '../assets/styles';

import { JoinTeamPortal } from './portal/join-team-portal';
import { hour, dns, hotels } from '../hooks/utils/data';
import { FavorContext, AuthenticationContext } from '../context/menu-provider'; 
import { formatCurrency } from "react-native-format-currency";

export const Users = () => {

  const { joinPortalDialogVisible, handleShow, handleHideAll} = useContext(MenuContext);

  const { userData } = useContext(AuthenticationContext);  
  const { findFavourite, addToFavourites, removeFromFavourites, 
          screens, addScreens, removeScreens  } = useContext(FavorContext);   
  
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (joinPortalDialogVisible && screens.send==="Users") {
          handleHideAll();
          removeScreens();
        }
      };
    }, [handleHideAll, joinPortalDialogVisible])
  );
  const [runScreen, setScreen] = useState(false);
  
  useEffect(() => {
    if (joinPortalDialogVisible && screens.send==="Users") setScreen(true);
    else setScreen(false);
  }, [joinPortalDialogVisible, screens]);

  const onButtonPress = useCallback(() => {
    if (screens.send==="" || screens.send==="Users") {
      handleShow({
        dialogType: 'joinPortal',
      });
      addScreens({"send": "Users", "receive": "JoinTeamPortal"});
    }
  }, [handleShow]);

    const { card, cardImage, cardtitle, cardDescription, containerImageIcon, badgeRigth, 
            iconButton, currencyText, currencyTextOffer, currencyTextNot } = Cardstyles();
    
    const [isTesting, setTesting] = useState(Platform.OS==='web'?true:false); 
    const [isLoading, setLoading] = useState(false);
    const [errorTemp, setErrorTemp] = useState('');
    const [errorUser, setErrorUser] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [hotel, setHotel] = useState({});
    const [lhotels, setHotels] = useState([]);
    const [count, setCount] = useState(0);

    const getHotels = async () => {    
      const paramsGet = {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
      };  
      setCount(0);
      //const resul = 
      fetch(dns + '/free-room/v1/hotels', paramsGet)
      //const resul = await fetch(dns + '/free-room/v1/hotels')
      .then((response) => {
              //setErrorTemp(`ERROR ADDRESSES: ${response.status}`);
              const statuscode = response.status;
              if (statuscode!==200) {
                if (statuscode===401) setErrorUser(statuscode + ' Paso el Local Tunnel.'); else setErrorUser(statuscode + ' Problemas de conexión.');
              } else return response.json();
          })
      .then((json) => {        
        if (json && json.data) {
          setCount(json.data.length); 
          setHotels(json.data.filter((data,idx) => idx < 20)); 
        } else setErrorUser('Error en el acceso al link de datos de la App.');})
      .catch((error) => { 
        console.log("Error en v1/hotels: ", error);
        if (errorUser==='') setErrorUser(error.toString()+' Error de conexión: posible problema con el firewall.');  
      })
      .finally(() => setLoading(false));
      //
      //setErrorTemp(resul.status);
    }

    useEffect(() => {
        setLoading(true);
        if (isTesting) {
          setHotels(hotels.filter((data,idx) => idx < 20)); 
          setLoading(false);
        } else getHotels();
    }, [isTesting]);

    const onRefreshHotels = () => {
      setLoading(true);            
      setTimeout(() => {
        if (isTesting) {
          setHotels(hotels.filter((data,idx) => idx < 20)); 
          setLoading(false);
        } else getHotels(); 
      }, 1000); 
    };
      
    const onRefresh = () => {   
      setRefreshing(true);
      if (isTesting) {
          setHotels(hotels.filter((data,idx) => idx < 20)); 
          setLoading(false);
        } else getHotels();
      setTimeout(() => {
        setRefreshing(false);
      }, 1000); // Refresh indicator will be visible for at least 1 second
    };
    
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
          <IconButton                
                style={iconButton}                
                icon={item.availability===0 ? 'lock' : 'lock-open-variant'}
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

  const renderItem = ({ item }) => {
    if (item.rooms.length<1) return '';
    let i = getAvail(item);
    let rooms = item.rooms;
    return (
      <TouchableOpacity key={item.id}
          onPress={() => {
            if (i>0 && userData.userType!=="HOTEL") {
              setHotel(item);
              onButtonPress();
            }
          }}         
      >
      <Card rounded style={Platform.OS==='web'?style.webStyleRender:style.notWebStyleRender}>
        <Card.Content>
          <Card.Title
            title={item.name} titleNumberOfLines={2}
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
              <Text style={{fontSize: 8}}> </Text>
          </View>
	        {i>0 && (
            <View style={{alignItems: "center"}}>
              <ScrollView horizontal={true}  
                style={{ flex: 1, paddingBottom: 12, width:'100%' }}>          
                {item.rooms.map((it, ind) => renderRooms(it,ind))}
              </ScrollView>
            </View>
          )}
        </Card.Content>
      </Card>      
    </TouchableOpacity>);
    };
    
    return(
      <>
      {runScreen && (
        <Portal.Host>
          <JoinTeamPortal id={hotel}/>
        </Portal.Host>
      )}
      {runScreen ? undefined : (
        <View style={Platform.OS==='web'?style.webStyle:style.notWebStyle}>
            {isLoading && (
              <View style={{top:100}}>
                <ActivityIndicator  animating={true}  size="large"/>      
              </View>)}
            {!isLoading && lhotels.length<1 && (
              <TouchableOpacity onPress={() => onRefreshHotels()}>
                <Card rounded style={{margin: 1}}>
	                <Card.Content>
                    <Card.Title 
                      title={'No Hoteles encontrados. '+errorTemp}
                      titleNumberOfLines={4}
                      subtitle={errorUser+"\n\nHaga click aqui para refrescar..."}
                      subtitleNumberOfLines={6}
                    />
	                </Card.Content>
                </Card>      
              </TouchableOpacity>
            )}
            {!isLoading && (
              <>
              {Platform.OS==='web' && lhotels.length>0 && (
                <View style={{alignItems: "center"}}>
                  <TouchableOpacity onPress={() => onRefreshHotels()}>                  
                    <Card rounded style={style.webStyleRender}>
                      <Card.Title 
                        title={'Hoteles. '+lhotels.length+'/'+count}
                        subtitle={errorUser+"\nHaga click aqui para refrescar ..."}
                      />
                    </Card>                
                  </TouchableOpacity>
                </View> 
              )}
              <FlatList
                data={lhotels}
                keyExtractor={({ id }) => id.toString()}
                contentContainerStyle={Platform.OS==='web'?{alignItems: "center"}:''}                
                renderItem={renderItem}
                removeClippedSubviews
                maxToRenderPerBatch={10}
                initialNumToRender={10}
                onEndReachedThreshold={0.5}
                estimatedItemSize={100}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              />                
                </>
            )}
        </View>
      )}
      </>
    );
};
const style = StyleSheet.create({
  webStyle: {
    flex:1, 
    padding: 20
  },
  notWebStyle: {
    padding: 20
  },
  webStyleRender: {
    marginTop: 10, 
    margin: 4, 
    maxWidth:320
  },
  notWebStyleRender: {
    marginTop: 10, 
    margin: 4
  }
});