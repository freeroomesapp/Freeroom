import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator} from 'react-native-paper';
import { Styles, Cardstyles } from '../assets/styles';

import { hotels, reserva } from '../hooks/utils/data';

export const ReservaScreen = props => {
    
    const  id  = props.id
    //const id:string = "1"; //props.navigation.getParam('id');

    const { cardError, cardtitle, cardDescription } = Cardstyles();
    
    const [isLoading, setLoading] = useState(false);
    const [mreserva, setReserva] = useState([]);
    const [error, setError] = useState(null);
    
    const filteredData = React.useMemo(
    () =>
    hotels.filter(
      (hotel) => reserva.find((item) => hotel.rooms.find((data) => data.id === item.room.id))
        ),
      []
    );
    
    getReserva = () => {
        fetch('https://old-crabs-drop.loca.lt/free-room/v1/hotels/')
          .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setError('No se pudo accesar al servidor. Se usaran datos temporales.');
              else return response.json();
          })
          .then((json) => setReserva(json.data))
          .catch((error) => { if (error===null) setError(error); setReserva(filteredData[0]); })
          .finally(() => setLoading(false));
    }

    useEffect(() => {
        console.log(id)
        setLoading(true);
        getReserva();
    }, [id]);
    
    return (
        <>
        {error && (<View style={cardError}>
          <Text style={cardtitle}>Warning:</Text>
          <Text style={cardDescription}>{error.toString()}</Text>
        </View>)}
        {isLoading ? <ActivityIndicator animating={true} /> :
        (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {isLoading ? <Text>Loading...</Text> : 
            (
              <View>
                <Text>{mreserva.id}</Text>
                <Text style={{ alignItems: 'center', fontSize: 25 }}>{mreserva.name}</Text>                
                <Text style={{ alignItems: 'center', fontSize: 12 }}>{reserva[0].endDate}-->{reserva[0].startDate}</Text>
              </View>
            )}
        </View>
        )}         
        </>
    );
};

//ReservaScreen.navigationOptions = {
//    title: 'Reservation Details'
//};