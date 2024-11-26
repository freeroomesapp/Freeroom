import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext } from 'react';

import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MenuContext} from '../context/menu-provider';
import UserScreen from './user';
import { Card, ActivityIndicator, Portal } from 'react-native-paper';
import { Styles } from '../assets/styles';

import { JoinTeamPortal } from '../components/portal/join-team-portal';
import { dns } from '../hooks/utils/data';
//import { useCallback, useContext } from 'react';
//import { RenderListItemUser } from '../components/render/render-list-item-user';

export const Users = () => {
    
  const { joinPortalDialogVisible, handleShow, handleHideAll} = useContext(MenuContext);
  
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
    const [errorTemp, setErrorTemp] = useState('');
    const [errorUser, setErrorUser] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [hotel, setHotel] = useState({});
    const [hotels, setHotels] = useState([]);

    const getHotels = async () => {    
      const paramsGet = {
        mode:'no-cors',
        //method: 'GET',
        //headers: {'Bypass-Tunnel-Reminder': 'true'},
        //'Access-Control-Allow-Origin': '*',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
      };  
      const resul = fetch(dns + '/free-room/v1/hotels', paramsGet)
      //const resul = await fetch(dns + '/free-room/v1/hotels')
      .then((response) => {
              //setErrorTemp(`ERROR ADDRESSES: ${response.status}`);
              const statuscode = response.status;
              if (statuscode!==200) {
                if (statuscode===401) setErrorUser(statuscode + ' Paso el Local Tunnel.'); else setErrorUser(statuscode + ' Problemas de conexión.');
              } else return response.json();
          })
      .then((json) => {        
        if (json && json.data) setHotels(json.data); 
        else setErrorUser('Error en el acceso al link de datos de la App.');})
      .catch((error) => { if (errorUser==='') setErrorUser(error.toString()+' Error de conexión: posible problema con el firewall.');  })
      .finally(() => setLoading(false));
      //
      setErrorTemp(resul.status);
    }

    useEffect(() => {
        setLoading(true);
        getHotels();
    }, []);

    const onRefreshHotels = () => {
      setLoading(true);            
      setTimeout(() => {
        getHotels(); 
      }, 1000); 
    };

    // const renderItem = RenderListItemUser();
    const { nestedCard } = Styles();
    const onLogin = ( id ) => {
        <UserScreen id={id}  />
        //navigation.navigate('User', { id: id })
    }
      
    const onRefresh = () => {   
      setRefreshing(true);
      getHotels();
      setTimeout(() => {
        setRefreshing(false);
      }, 1000); // Refresh indicator will be visible for at least 1 second
    };

    renderItem = ({ item }) => {
      if (item.rooms.length<1) return '';
      return (<TouchableOpacity
          onPress={() => {
            if (item.rooms.length>0) {
              setHotel(item);
              onButtonPress();
            }
          }}         
      >
      <Card rounded style={nestedCard}>
        <Card.Content>
          <Card.Title
            title={item.name}
          />
          <View>                            
              <Text>{item.description} </Text>              
              <Text>{item.addres}</Text>
              {item.rooms.length<1 && (<Text>No Rooms</Text>)}
              {item.rooms.length>0 && (<Text>{item.rooms.length} rooms disponible.</Text>)}
          </View>
        </Card.Content>
      </Card>
      
    </TouchableOpacity>);
    };
    return(
      <>
      {joinPortalDialogVisible && (
        <Portal.Host>
          <JoinTeamPortal id={hotel}/>
        </Portal.Host>
      )}
      {joinPortalDialogVisible ? undefined : (
        <View style={{ padding: 20 }}>
            {isLoading && (
              <View style={{top:100}}>
                <ActivityIndicator  animating={true}  size="large"/>      
              </View>)}
            {!isLoading && hotels.length<1 && (
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
                {errorTemp && (<View style={style.error}>          
                    <Text>{errorTemp}</Text>
                  </View>
                )}
                <FlatList
                    data={hotels}
                    keyExtractor={({ id }) => id.toString()}
                    renderItem={renderItem} //{({ item }) => <Text>{item.name}  </Text>}//                     
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
  error: { 
    size:'large', 
    alignitems: 'center', 
    alignself: 'center', 
    maxwidth: 100, 
    margintop:10, 
    marginbottom:2
  },
});