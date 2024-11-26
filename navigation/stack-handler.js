import { View, StyleSheet, Platform } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { useEffect, useState } from 'react';
//import { ScreenA } from '../screens/screen-a';
import { ReservaDetail } from '../components/reserva-details';
import { ScreenC } from '../screens/screen-c';
//
import { useContext } from 'react';
import { FavorContext } from '../context/menu-provider';
import { AuthenticationContext } from '../context/menu-provider';
import { Login } from '../components/portal/login';
import { Users } from '../components/users';  
 
const MapHotels = () => {
    //<ScreenA />; 
    if (Platform.OS!=="web") {
      let MapScreen = require("../screens/screen-a").ScreenA;
      return <MapScreen/>; 
    } else return <Users />;
}
const Favoritos = () => <ScreenC />;
const Reservas = () => <ReservaDetail />;
const MakeLogin = () => <Login />; 
const ListHotels = () => <Users /> 

export const DefaultStack = () => {
  
  const { favourites } = useContext(FavorContext);
  const { user, userData, hasReservas, getReservations } = useContext(AuthenticationContext);
  
  const [index, setIndex] = useState(0);
  const [op1] = useState({ key: 'mapa', title: 'Hoteles', focusedIcon: 'bed' });

  const [op2] = useState(
    { key: 'favoritos', title: 'Favoritos', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'});

  const [op3] = useState(
        { key: 'reservas', title: 'Reservas', focusedIcon: 'view-grid-outline'});

  const [op4] = useState(
    { key: 'login', title: 'User', focusedIcon: 'account-circle-outline', unfocusedIcon: 'account-circle' });

  const [op5] = useState(
    { key: 'users', title: 'Hotel', focusedIcon: 'finance', unfocusedIcon: 'finance' });

  const [op15, setOp15]           = useState(Platform.OS!=="web"?op1:op5);
  const [showHotel, setShowHotel] = useState(Platform.OS!=="web"?false:false);

  const [routes, setRoutes] = useState([op4, op5]);
  
  const renderScene = BottomNavigation.SceneMap({
    mapa: MapHotels,
    favoritos: Favoritos,
    reservas: Reservas,
    login: MakeLogin,
    users: ListHotels,
  });

  //Platform.OS ==="web"
  useEffect(() => {
    getReservations();
  }, [user.token]);
  
  useEffect(() => {
    if (userData.userType==="USER") {
      setOp15(op1);
      setShowHotel(false);
    } else if (userData.userType==="HOTEL") {
      setOp15(op5);
      setShowHotel(false);
      //setShowHotel(true);
    }
    else {
      setOp15(op1);
      setShowHotel(false);
    } 
  }, [userData]);

  useEffect(() => {
    //if (user && user.token!=="") getReservations();
    let ind = 0;  if (index>0) setIndex(ind);    
    if (favourites && favourites.length>0) {      
      if (hasReservas===true) {
        if (showHotel) setRoutes([op15, op2, op3, op4, op5]); 
        else setRoutes([op15, op2, op3, op4]);
      } else {
        if (showHotel) setRoutes([op15, op2, op4, op5]); 
        else setRoutes([op15, op2, op4]);
      }
    } else {             
      if (hasReservas===true) {
          if (showHotel) setRoutes([op15, op3, op4, op5]); 
          else setRoutes([op15, op3, op4]);
      } else {
          if (showHotel) setRoutes([op15, op4, op5]); 
          else setRoutes([op15, op4]);
      }
    }    
    setTimeout(() => {   
      setIndex(ind);
    }, 200); 
  }, [favourites, hasReservas, op15]);

  return (
    <View style={styles.screen}>
      
      <BottomNavigation        
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        labelMaxFontSizeMultiplier={2}
        renderScene={renderScene}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    color: "#6c1ca3"
  },
});
