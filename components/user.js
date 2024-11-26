import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

export const UserScreen = props => {
    
    const  id  = props.id
    //const id:string = "1"; //props.navigation.getParam('id');
    //
    //const baseUrl = Platform.OS === 'android' ? 'http://127.0.0.1:8090' : 'http://localhost:8090';
    //192.168.50.78
    //localhost
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [hotel, setHotel] = useState([]);

    getUser = () => {
        fetch('https://green-seals-walk.loca.lt/free-room/v1/hotels/' + id)
          .then((response) => response.json())
          .then((json) => {
              setHotel(json.data);
          })
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
    }
    useEffect(() => {
        console.log(id)
        setLoading(true);
        getUser();
    }, [id]);
    return (        
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {isLoading ? <Text>Loading...</Text> : 
            (
                <View>
                    <Text style={{ alignItems: 'center', fontSize: 25 }}>{hotel.name}</Text>
                    <Text>{hotel.latitude}</Text>
                </View>
            )}
            {error && (<View style={style.error}>          
              <Text>{error}</Text>
            </View>
          )}
        </View>
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
  }
});
UserScreen.navigationOptions = {
    title: 'User Details'
};
//export default UserScreen;