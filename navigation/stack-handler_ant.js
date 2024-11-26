//import * as React from 'react';
import { Appbar, BottomNavigation, Text } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { ScreenA } from '../screens/screen-a';
import { ReservaDetail } from '../components/reserva-details';
import { ScreenC } from '../screens/screen-c';
//
import { useContext } from 'react';
import { FavorContext, MenuContext} from '../context/menu-provider';
import { AuthenticationContext } from '../context/menu-provider';
import { Login } from '../components/portal/login';
import { Users } from '../components/users';  

import { View, StyleSheet } from 'react-native';

const ListUsers = () => <Users />; //<UserScreen id={1}  />;
const MusicRoute = () => <Login />; 

const MapRoute = () => <ScreenA />;

const Reservas = () => <ReservaDetail />
//<ReservaScreen id={1}/>; //<ScreenB  />;//<User id={1}  />

const Favoritos = () => <ScreenC />;//<User id={1}  />;

export const DefaultStack = () => {
  
  const { favourites } = useContext(FavorContext);
  const { user } = useContext(AuthenticationContext);
  
  const [showHotel, setShowHotel] = useState(true);

  const [index, setIndex] = useState(0);
  const [op1] = useState({ key: 'mapa', title: 'Hoteles', focusedIcon: 'bed' });

  const [op2] = useState(
    { key: 'favoritos', title: 'Favoritos', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'});

  const [op3] = useState(
        { key: 'reservas', title: 'Reservas', focusedIcon: 'view-grid-outline'});

  const [op4] = useState(
    { key: 'recents', title: 'User', focusedIcon: 'account-circle-outline', unfocusedIcon: 'account-circle' });

  const [op5] = useState(
    { key: 'users', title: 'Hotel', focusedIcon: 'finance', unfocusedIcon: 'finance' });

  const [routes, setRoutes] = useState([
    { key: 'mapa', title: 'Hoteles', focusedIcon: 'bed' }    
  ]);
  
  const renderScene = BottomNavigation.SceneMap({
    mapa: MapRoute,
    favoritos: Favoritos,
    reservas: Reservas,
    recents: MusicRoute,
    users: ListUsers,
  });

  useEffect(() => {
    let ind = 0;     
    if (favourites.length>0) {      
      if (user && user.token!=="") {
        ind = 2;
        if (showHotel) setRoutes([op1, op2, op3, op4, op5]); else setRoutes([op1, op2, op3, op4]);
      } else if (showHotel) setRoutes([op1, op2, op4, op5]); else setRoutes([op1, op2, op4]);
    } else {      
      if (user && user.token!=="") {
        ind = 2;
        if (showHotel) setRoutes([op1, op3, op4, op5]); else  setRoutes([op1, op3, op4]);
      } else if (showHotel) setRoutes([op1, op4, op5]); else setRoutes([op1, op4]);
    }    
    setTimeout(() => {   
      setIndex(ind);
    }, 200); 
  }, [favourites.length, user.token, showHotel]);

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
  favicoFree: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
