import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FlatList, RefreshControl, Text, StyleSheet, Switch  } from 'react-native';
import { Card, List, ActivityIndicator } from 'react-native-paper';
import { Styles } from '../assets/styles';
import { useContext } from 'react';
import { AuthenticationContext } from '../context/menu-provider';
import { dns } from '../hooks/utils/data';

export const ReservaDetail = () => {

    const [isLoading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [noPaid, setNoPaid] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [reservas, setReservas] = useState([]);

    const [idUser, setIdUser] = useState('2');
    const { user, loadUser, hasReservas } = useContext(AuthenticationContext);

    const getReservas = (id) => {
      if (id==='') {
        setReservas([]);
        setLoading(false);
      } else {
        const params = {
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
        };
        fetch(dns + '/free-room/v1/reservation/' + id, params)
          .then((response) => response.json())
          .then((json) => {
            setReservas(json.data);
          })
          .catch((error) => setLoading(false)) //console.error(error)
          .finally(() => {
            getHotels();
            setLoading(false);
          });
      }
    }
    
    const getHotels = () => {
        fetch(dns + '/free-room/v1/hotels')
          .then((response) => response.json())
          .then((json) => setHotels(json.data))
          .catch((error) => console.error(error))
          .finally(() => {});
    }
    
    const findHotel = (idRoom) => {
      const newItem = hotels.find((item) => isRoom(item, idRoom)===true);
      if (newItem!== undefined)  return newItem; else return {"name": ""};
    };

    const isRoom = (data, id) => {
      let sw = false;   
      if (data.rooms && data.rooms.length>0) { 
        let rooms = data.rooms; 
        const newItem = rooms.find((item) => item.id===id);
        if (newItem!== undefined) sw = true; else sw= false;
      }
      return sw;
    }    
    
    useEffect(() => {       
      loadUser();
    }, []);
    
    useEffect(() => {
      if (user.id!=="") getReservas(user.id);
    }, [hasReservas]);

    useEffect(() => {
      onRefreshReserva();
    }, [user.id]);

    const onRefreshReserva = () => {
      setLoading(true);            
      getReservas(user.id); 
    };
    const onRefresh = () => {   
      setRefreshing(true);
      getReservas(user.id); 
      setTimeout(() => {
        setRefreshing(false);
      }, 1000); // Refresh indicator will be visible for at least 1 second
    };

    mrenderItem = ({ item }) => {      
      let mhotel = findHotel(item.room.id);
      let strIcon = "";
      if (item.status==='PAID') strIcon = "thumb-up-outline";
      else strIcon = "thumb-down-outline";
      return (
      <TouchableOpacity onPress={() => { }}>
      <Card rounded style={{marginTop: 10, margin: 1}}>
        <Card.Content>
          <Card.Title 
            title={mhotel.name}
            titleNumberOfLines={4}
            subtitle={mhotel.addres}
            subtitleNumberOfLines={5}
          />
          <List.Item 
            title={'Room Id: '+item.room.id+'\n'+item.room.details}
            titleNumberOfLines={3}            
            left={(props) => <List.Icon {...props} icon="home" />}
            right={(props) => <List.Icon {...props} icon={strIcon} />}
          />
        {item.startDate && ( 
          <List.Item 
            title="Check-In-Out"
            description={item.startDate.slice(0, 16)+'\n'+item.endDate.slice(0, 16)}
            descriptionNumberOfLines={4}
            left={(props) => <List.Icon {...props} icon="calendar-clock" />}
          />
        )}
        </Card.Content>
      </Card>
      
    </TouchableOpacity>);
    };

    return(
      <>
      <View style={{ padding: 25, marginBottom: 2 }}>            
        {!isLoading && reservas.length<1 && (
          <TouchableOpacity onPress={() => onRefreshReserva()}>
            <Card rounded style={{margin: 1}}>
	            <Card.Content>
                <Card.Title 
                  title={user.id + ' ' + user.username  + '\n' + ' aún no tiene reservas.'}
                  titleNumberOfLines={6}
                  subtitle="Toque para buscar de nuevo..."
                  subtitleNumberOfLines={2}
                />
	            </Card.Content>
            </Card>      
          </TouchableOpacity>
        )}
        {isLoading ? 
          <View style={{top:60}}>
            <ActivityIndicator animating={true}  size="large"/>      
          </View> :
        (
        <>
        <FlatList
            data={reservas}   
            keyExtractor={({ id }) => id.toString()}
            renderItem={mrenderItem}                      
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
      </>
    );
};
const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    marginLeft: 4,        
  },
});