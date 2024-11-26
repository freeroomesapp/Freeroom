import { useFocusEffect } from '@react-navigation/native'; 
import React, { useEffect, useState, useRef } from 'react';
import { useCallback, useContext } from 'react';
import { Text, View, ScrollView, Image, Platform, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Appbar, TextInput, Portal, Icon, IconButton, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useFlatListHelpers } from '../hooks/lists/use-flat-list-helper';
import { JoinTeamPortal } from '../components/portal/join-team-portal';
import { Styles, Cardstyles } from '../assets/styles';

import { RenderListItem } from '../components/render/render-list-item';
import { MenuContext } from '../context/menu-provider';
import { FavorContext } from '../context/menu-provider';

import { MapSkeleton } from '../components/map-skeleton';  

import { getDistance } from "geolib";
import * as Location from "expo-location";

import { StyleSheet,  } from 'react-native';
import { hotels, districts } from '../hooks/utils/data';

//Esto es para evitar el error que provoca react-native-maps en version web
let MapViewMob, MarkerMob, CalloutMob;

if (Platform.OS === "android" || Platform.OS === "ios") {
  MapViewMob = require("react-native-maps").default;
  MarkerMob = require("react-native-maps").Marker;
  CalloutMob  = require("react-native-maps").Callout;
}

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 3.25;
const CARD_WIDTH = CARD_HEIGHT - 20;
import {
  formatCurrency,
  getSupportedCurrencies,
} from "react-native-format-currency";


export const ScreenA = () => {
    
  const [region, setRegion] = useState({
        latitude: 41.41,
        longitude: 2.161,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
  });
  
  //Gestion de la expansion de Flatlist
  const [expand, setExpand] = useState('horizon');  
  changeExpand = () => {
    if (expand==='horizon') setExpand('vertical');
    else if (expand==='vertical') setExpand('down');
    else if (expand==='down') setExpand('horizon');
  }
  getIconExpand = () =>{
    if (expand==='horizon') return 'arrow-expand-horizontal';
    else if (expand==='vertical') return 'arrow-expand-vertical';
    else if (expand==='down') return 'arrow-expand-up';
  }

  //Gestion zoom
  const MIN_ZOOM_LEVEL = 6;
  const MAX_ZOOM_LEVEL = 17;
  const [zoom, setZoom] = useState(12);

  const getLatLongDelta = (zoom: number, latitude: number): number[] => {
    const LONGITUDE_DELTA = Math.exp(Math.log(360) - zoom * Math.LN2);
    const ONE_LATITUDE_DEGREE_IN_METERS = 111.32 * 1000;
    const accurateRegion =
      LONGITUDE_DELTA *
      (ONE_LATITUDE_DEGREE_IN_METERS * Math.cos(latitude * (Math.PI / 180)));
    const LATITUDE_DELTA = accurateRegion / ONE_LATITUDE_DEGREE_IN_METERS;

    return [LONGITUDE_DELTA, LATITUDE_DELTA];
  };
  const handleZoom = (isZoomIn = false) => {
        let currentZoomLevel = zoom;
        // if zoomlevel set to max value and user click on minus icon, first decrement the level before checking threshold value
        if (!isZoomIn && currentZoomLevel === MAX_ZOOM_LEVEL) {
          currentZoomLevel -= 1;
        } 
        // if zoomlevel set to min value and user click on plus icon, first increment the level before checking threshold value
        else if (isZoomIn && currentZoomLevel === MIN_ZOOM_LEVEL) {
          currentZoomLevel += 1;
        }
        if (
          currentZoomLevel >= MAX_ZOOM_LEVEL ||
          currentZoomLevel <= MIN_ZOOM_LEVEL
        ) {
          return;
        }
        if (users.length<1) return;

        currentZoomLevel = isZoomIn ? currentZoomLevel + 1 : currentZoomLevel - 1;        
        let zoomedInRegion = null;
        if (isSearching) {
            zoomedInRegion = {
              latitude:       location.latitude, 
              longitude:      location.longitude,
              latitudeDelta:  getLatLongDelta( currentZoomLevel, location.latitude  )[1],
              longitudeDelta: getLatLongDelta( currentZoomLevel, location.longitude )[0]
            };
        } else {
            zoomedInRegion = {
              latitude: parseFloat(users[indexCurrent].latitude), 
              longitude: parseFloat(users[indexCurrent].longitude),
              latitudeDelta:  getLatLongDelta( currentZoomLevel, parseFloat(users[indexCurrent].latitude) )[1],
              longitudeDelta: getLatLongDelta( currentZoomLevel, parseFloat(users[indexCurrent].longitude) )[0]
            };
        }
        setRegion(zoomedInRegion);
        setZoom(currentZoomLevel);
        mapRef.animateToRegion(zoomedInRegion, 2000);
        if (isSearching) {
            markerSearchRef.showCallout();
        } else {
            markerRef[indexCurrent].showCallout();
        }
  };
  //
  const [locationing, setLocationing] = useState(true);
  const [location, setLocation] = useState(null);
  const [countLocation, setCountLocation] = useState(0);
  const [locationAddress, setLocationAddress] = useState(
    'Active you service of geo-location...'
  );

  const [imageDefault, setImageHotel] = useState("https://www.cataloniahotels.com/es/blog/wp-content/uploads/2024/01/tipos-habitaciones-hotel.jpg");
  const [priceDefault, setPrice] = useState(111);  

  let mapRef = useRef();
  let markerSearchRef = useRef(null);
  const markerRef = useRef([]);
  const flatListRef = useRef(null);
  
  const [error, setError] = useState(null);
  const [msg2, setMsg2] = useState('');
  
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  getDistanceCurrent = (item) => {
    if (location===null) return -1;
    return getDistance(
                  {latitude: item.latitude,   longitude: item.longitude},
                  {latitude: location.latitude, longitude: location.longitude});
  }
   
  getUsers = () => {
        fetch('https://old-crabs-drop.loca.lt/free-room/v1/hotels/')
          .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setError('No se pudo accesar al servidor.');
              else return response.json();
          })
          .then((json) => setUsers(json.data))
          .catch((error) => { if (error===null) setError('Se usaran datos temporales.'); 
          setUsers(hotels.sort((a, b) => (getDistanceCurrent(a)>getDistanceCurrent(b))?1 : -1).filter((data,idx) => idx < 7));
          setMsg2('Se usaran datos de prueba.');
          })
          .finally(() => setLoading(false));
  }
  
  useEffect(() => {
    if (!locationing) return;
    //setLocationing(false);
    //
    setLoading(true);        
    if (Platform.OS === "android" || Platform.OS === "ios"){      
      //Buscamos location
      if (location===null) {
          getLocationGPS();
      }
      setAddress(); //Obtener la direccion del location. 
      //
      //setTimeout(() => { getUsers(); }, 3000);      
      getUsers();
      let zoomedInRegion = null;
      if (isSearching && location) { 
            zoomedInRegion = {
              latitude:       location.latitude, 
              longitude:      location.longitude,
              latitudeDelta:  getLatLongDelta( zoom, location.latitude  )[1],
              longitudeDelta: getLatLongDelta( zoom, location.longitude )[0]
            };
            setIndexCurrent(-1);
      } else {
        if (users.length > 0) {  
            setIndexCurrent(0);
            zoomedInRegion = {
              latitude: parseFloat(users[0].latitude), 
              longitude: parseFloat(users[0].longitude),
              latitudeDelta:  getLatLongDelta( zoom, parseFloat(users[0].latitude) )[1],
              longitudeDelta: getLatLongDelta( zoom, parseFloat(users[0].longitude) )[0]
            };
        } else {
          setIndexCurrent(-1);
          zoomedInRegion = region;
          setError('Espere un momento, por favor...');
          setMsg2('Estamos buscando hoteles con disponibilidad.');
        }
      }
      setRegion(zoomedInRegion);       
    } else { 
        setError('Aclaración...');
        setMsg2('Esta opcion sólo está disponible para Android & iOS');
    }
    setLocationing(false);
  }, [locationing]);
  
  const getLocationGPS = () =>{
    let locationInit = null;
    let sw = true;
    (async () => {
        locationInit = await Location.getCurrentPositionAsync({});        
        if (locationInit===null) sw = false;
        //if (sw && location!==null) sw = false;
        if (sw && location && getDistanceCurrent(locationInit.coords)<0.1) sw = false;  
        if (sw) {
          setLocation({
                latitude:       locationInit.coords.latitude,
                longitude:      locationInit.coords.longitude,
                latitudeDelta:  getLatLongDelta( zoom, locationInit.coords.latitude )[1],
                longitudeDelta: getLatLongDelta( zoom, locationInit.coords.longitude)[0]
          });   
        }
    })();   
    //if (locationInit===null) {
    if (!sw) {
        setLocation(region); //La region anterior (que podria ser la region por defecto).
    }
  }
  
  //addres = 'Avinguda Meridiana, 151, 08026 Barcelona';
  const searchLocationAddres = (addres) => { 
    if (addres==="") return;
    //
    setisViewSearch(false);
    //
    let locationInit = null;
    let sw = true;
    //
    (async () => {
        locationInit = await Location.geocodeAsync(addres);         
        if (locationInit===null || locationInit.length<1) sw = false;
        if (sw && location && getDistanceCurrent(locationInit[0])<0.1) sw = false;  
        if (sw) {            
            setSearching(true);
            setLocation({
                latitude:       locationInit[0].latitude,
                longitude:      locationInit[0].longitude,
                latitudeDelta:  getLatLongDelta( zoom, locationInit[0].latitude )[1],
                longitudeDelta: getLatLongDelta( zoom, locationInit[0].longitude)[0]
            });   
            //
            let response = await Location.reverseGeocodeAsync({
                latitude:       locationInit[0].latitude,
                longitude:      locationInit[0].longitude,
            });
          
            for (let item of response) {
              let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
              setSearchQuery(address);
              setSearchShowOptions(false); 
              //setSearchResult([{
              //  "codigo": item.postalCode,
              //  "name": `${item.name}, ${item.street}`,
              //  "city": item.city, 
              //  "type": "marker",
              //}, ...searchResult]);
            }
            setLocationing(true);
        } else searchAnimated();
    })();      
  }
  const searchLocation = () => {
    let locationInit = null;
    let sw = true;
    (async () => {
        locationInit = await Location.getCurrentPositionAsync({});        
        if (locationInit===null) {
            locationInit = await Location.getLastKnownPositionAsync({});
            if (locationInit===null) sw = false;
        }
        //if (sw && location!==null) sw = false;
        if (sw && location && getDistanceCurrent(locationInit.coords)<0.1) sw = false;  
        if (sw) {            
            setSearching(true);
            setLocation({
                latitude:       locationInit.coords.latitude,
                longitude:      locationInit.coords.longitude,
                latitudeDelta:  getLatLongDelta( zoom, locationInit.coords.latitude )[1],
                longitudeDelta: getLatLongDelta( zoom, locationInit.coords.longitude)[0]
            });  
            setLocationing(true); 
        } else searchAnimated();
    })();      
  }
  const findResult = (data) => {
    const newItem = searchResult.find(
      (item) => `${item.name}, ${item.codigo}, ${item.city}` === data
    );
    return newItem!== undefined ? true : false;
  };

  const filterResult = (text) => {
    setSearchQuery(text);
    if (searchQuery.length<2) {
      setFilteredResult(searchResult.sort((a, b) => (a.codigo > b.codigo ? 1 : -1)));
      return;
    }
    setFilteredResult({}); 
    const textLowerCase = text.toLowerCase();
    //item.city.toLowerCase()===textLowerCase
    setFilteredResult(
      searchResult.sort((a, b) => (a.name > b.name ? 1 : -1)).filter((item) => {
	      return (
	        item.name.toLowerCase().indexOf(textLowerCase) > -1 ||
	        item.codigo.indexOf(text) > -1  ||
	        item.city.toLowerCase().indexOf(textLowerCase) > -1
	      );
      })
    );
    if (filteredResult.length<1) {
      setFilteredResult(searchResult.sort((a, b) => (a.codigo > b.codigo ? 1 : -1)));
    }
  };

  const setAddress = () =>{
      (async () => {
          let latitude = location.latitude;
          let longitude = location.longitude;
          let response = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
          });
          if (response.length<1) {
	            setSearchResult([{
                "codigo": "080",
                "name": "Init",
                "city": "barcelona", 
                "type": ""}, ...searchResult]);
          }

          for (let item of response) {
              let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
              setLocationAddress(address);
              if (!findResult(address)) {
                setCountLocation(countLocation+1);
                setSearchResult([{
                  "codigo": item.postalCode,
                  "name": `${item.name}, ${item.street}`,
                  "city": item.city, 
                  "type": "marker"}, ...searchResult]);
              }
          }
          
      })();
  }
  //
  const { joinPortalDialogVisible, handleShow, handleHideAll } = useContext(MenuContext);

  const {findFavourite, addToFavourites, removeFromFavourites } = useContext(FavorContext);

  const { keyExtractor } = useFlatListHelpers();
  const { nestedCard, buttonContainer, nestedButtonContainer } = Styles();
  const { favico, screen, cardError, container, containerFlat, containerMarket, triangle, maps, bubble, button, buttonContain, card, cardImage, textContent, cardtitle, cardDescription, containerImageIcon, flatIconsContain, containerIcons, iconButton, iconButtonDown,currencyText, distanceText, currencyRowText, loading, reload, searchbar } = Cardstyles();

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
    handleShow(
      {dialogType: 'joinPortal'}
    )
  }, [handleShow]);
  const [isViewSearch, setisViewSearch] = useState(false);               
    
  getFormatCurrency = (id) => {
    const [valueFormattedWithSymbol] = formatCurrency({ amount: Number(id), code: 'EUR' });
    return valueFormattedWithSymbol;
  }
  
  getDistanceCurrentText = (item) => {
    const dis  = getDistanceCurrent(item);
    if (dis===-1) return '';
    const dis2 = Math.fround(getDistanceCurrent(item)/1000).toFixed(2);
    if (dis<1000) return dis+'M';
    return dis2+'Km';    
  }
  const [indexCurrent, setIndexCurrent] = useState(-1);
  const [isSearching, setSearching] = useState(false);  

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let slideSize = event.nativeEvent.layoutMeasurement.height;    
    let _index = event.nativeEvent.contentOffset.x / slideSize;
    if (expand!=='horizon') {
       slideSize = event.nativeEvent.layoutMeasurement.width;    
       _index = event.nativeEvent.contentOffset.y / slideSize;
    }
    const index = Math.round(_index);    
    if (index>=users.length) return ;
    if (index!==indexCurrent) { onScrollAnimated(index);}
  };
  const onScrollAnimated = (index) => {
      setSearching(false);
      setIndexCurrent(index);
      const newregion = {
            latitude: parseFloat(users[index].latitude), 
            longitude: parseFloat(users[index].longitude),
            latitudeDelta:  getLatLongDelta( zoom, parseFloat(users[index].latitude) )[1],
            longitudeDelta: getLatLongDelta( zoom, parseFloat(users[index].longitude) )[0]
      };
      mapRef.animateToRegion(newregion, 2000);
      markerRef[index].showCallout()
  }

  
  const searchAnimated = () => {
      if (mapRef===null) return;
      if (markerSearchRef===null) return;
      if (location===null) return;
      const newregion = {
            latitude: location.latitude, 
            longitude: location.longitude,
            latitudeDelta:  getLatLongDelta( zoom, location.latitude  )[1],
            longitudeDelta: getLatLongDelta( zoom, location.longitude )[0]
      };
      mapRef.animateToRegion(newregion, 2000);
      markerSearchRef.showCallout();
      setSearching(true);
  }
  //Simulamos dos secciones.
  const renderItemResult = (item, type)  => {           
    if (type===item.type || type==="" ) 
    return (
      <TouchableOpacity style={styles.itemContainer}
                      onPress={() => { 
                        setSearchQuery(item.type==='marker'?`${item.name}, ${item.codigo}, ${item.city}`:`${item.codigo}, ${item.city}`); 
                        setSearchShowOptions(false);}
                      }>
                      <View style={styles.icon}>
                        <IconButton icon={item.type==='marker'?'map-marker-radius':'map-marker-multiple-outline'} large size={20}/>
                      </View>
                      <View style={styles.contentContainer}>
                        <View style={styles.content}>
                          <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                          <Text numberOfLines={1} style={styles.subTitle}>{item.codigo}, {item.city}</Text>
                        </View>
                      </View>
                  </TouchableOpacity>
    );
  };
  
  const renderItem = ({ item, index }) => {         
    return (
    <TouchableOpacity style={card}
        onPress={() => {         
          setSearching(false); 
          setIndexCurrent(index);
          const newregion = {
            latitude: parseFloat(users[index].latitude), 
            longitude: parseFloat(users[index].longitude),
            latitudeDelta:  getLatLongDelta( zoom, parseFloat(users[index].latitude) )[1],
            longitudeDelta: getLatLongDelta( zoom, parseFloat(users[index].longitude) )[0]
          };
          mapRef.animateToRegion(newregion, 2000);
          markerRef[index].showCallout()
        }}         
        >        
        <Text style={cardtitle}>{item.name}</Text>                
        <View style={containerImageIcon}>
          {item.rooms.length > 0 && <Image
                source={{ uri: item.rooms[0].image1 }}
                style={cardImage}
                resizeMode="cover"                           
          />}
          {item.rooms.length < 1 && item.image && <Image
                source={{ uri: item.image }}
                style={cardImage}
                resizeMode="cover"                           
          />} 
          {item.rooms.length < 1 && !item.image && <Image
                source={{ uri: imageDefault }}
                style={cardImage}
                resizeMode="cover"                           
          />}
          <IconButton                
                style={iconButton}
                icon={findFavourite(item) ? 'heart' : 'heart-outline'}                
                onPress={() => {
                  !findFavourite(item)
                    ? addToFavourites(item)
                    : removeFromFavourites(item)
                  }}                 
          />
          {item.rooms.length > 0 && 
          <Text style={currencyText}>{getFormatCurrency(item.rooms[0].price)}</Text>}
          {item.rooms.length < 1 && 
          <Text style={currencyText}>{getFormatCurrency(priceDefault)}</Text>}
          <Text style={distanceText}>{getDistanceCurrentText(item)}</Text>
        </View>
        <Text numberOfLines={1} style={cardDescription}>{item.description}</Text>        
    </TouchableOpacity>
    );
  };

  //const [searchQueries, setSearchQuery] = useState({ searchBarMode: '' });
  
  const [searchQuery, setSearchQuery] = React.useState(''); 
  const [searchShowOptions, setSearchShowOptions] = useState(false);
  //type: district, street, marker
  //{"codigo": "08000", "name": "", "city": "Barcelona", "type": "district"}
  const [searchResult, setSearchResult] = React.useState(districts);  
  const [filteredResult, setFilteredResult] = React.useState(districts.sort((a, b) => (a.codigo > b.codigo ? 1 : -1)));

  //useEffect(() => {
  //  const timer = setTimeout(() => {
  //    if (searchQuery.length > 3) {
  //      searchLocationAddres(searchQuery);
  //    } 
  //  }, 2000);
  //
  //  return () => clearTimeout(timer);
  //}, [searchQuery]);

  return (
  <>
  {joinPortalDialogVisible && (
        <Portal.Host>
          <JoinTeamPortal />
        </Portal.Host>
  )}
  {joinPortalDialogVisible ? undefined : (
    <>
    {isLoading && Platform.OS ==="web" && (<MapSkeleton text1={error} text2={msg2} />)}    
    {isLoading && Platform.OS !=="web" && (<ActivityIndicator />)}    
    {!isLoading && (Platform.OS === "android" || Platform.OS === "ios") && (              
      <View style={styles.container}>            
        <View>
        <Appbar.Header>
          <Image
            source={require('../assets/favico.png')}
            style={{width: 40, height: 40}}
          />
          <Appbar.Content title="FREEROOM" titleStyle={favico}/>
        </Appbar.Header>
        </View>
        <MapViewMob
                ref={ref => { mapRef = ref; }}
                style={styles.map}
                mapType={"standard"}
                region={region}
                //showsUserLocation
                //showsMyLocationButton={true}
                //followsUserLocation={true}
                zoomEnabled={true}
                scrollEnabled={true}
                showsScale={true}
                toolbarEnabled={false}
                loadingEnabled={true}
                onRegionChangeComplete={() =>{
                  if (indexCurrent===-1 && users.length>0) {//Only first ocurrs o drag icon-Search
                    setSearching(false);
                    setIndexCurrent(0);
                    const newregion = {
                      latitude: parseFloat(users[0].latitude), 
                      longitude: parseFloat(users[0].longitude), 
                      latitudeDelta:  getLatLongDelta( zoom, parseFloat(users[0].latitude) )[1],
                      longitudeDelta: getLatLongDelta( zoom, parseFloat(users[0].longitude) )[0]
                    };                    
                    mapRef.animateToRegion(newregion, 2000);
                    markerRef[0].showCallout();   
                    if (flatListRef) flatListRef.current.scrollToIndex({ index: 0, animated: true })
                  }
                }}
        >    
        {location!==null &&
          <MarkerMob
	          //key={5000}
            title={`Drag for Search`}
            draggable            
            coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
            }} 
            //tracksViewChanges={true}
            onDragEnd={e => {              
              setSearching(true);
              const newCoordinate = e.nativeEvent.coordinate;
              setLocation({
                latitude:       newCoordinate.latitude,
                longitude:      newCoordinate.longitude,
                latitudeDelta:  getLatLongDelta( zoom, newCoordinate.latitude )[1],
                longitudeDelta: getLatLongDelta( zoom, newCoordinate.longitude)[0]
              });            
              setLocationing(true);               
            }}
            ref={ref => { markerSearchRef = ref; }} 
            >
              <IconButton icon='map-marker-radius' large size={40}/>
              <CalloutMob tooltip>
                  <View>
                    <View style={containerMarket}>
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8, flex: 1 }}>
                      <Text style={{fontWeight: "bold", fontSize: 12 }} >Drag for search nearby Hotels</Text>  
                      <Text style={{ fontSize: 8 }}>{locationAddress}</Text>                     
                    </View>
                  </View>
                  <View style={triangle}></View>
                  </View>
              </CalloutMob> 
          </MarkerMob>
        }                  
        {users.map((data, index) => (
            <MarkerMob
                  key={index}
                  coordinate={{
                    latitude: parseFloat(data.latitude),
                    longitude: parseFloat(data.longitude),
                  }} 
                  //image={data.imageUrl}
                  title={`Hotel ${index + 1}`}
                  description={`Info: ${data.description}`}
                  ref={ref => { markerRef[index] = ref; }} 
                  //onPress={() => console.log('pressed')}
                onPress={() => flatListRef.current.scrollToIndex({ index: index, animated: true })}
            >    
            {data.rooms.length > 0 && <Text style={currencyRowText}>{getFormatCurrency(data.rooms[0].price)}</Text>}
            {data.rooms.length < 1 && <Text style={currencyRowText}>{getFormatCurrency(priceDefault)}</Text>}
              <CalloutMob tooltip>
                  <View>
                    <View style={containerMarket}>
                      <Text>
                      <Image
                        source={{
                          uri: '' //data.image
                        }}
                        resizeMode="cover"
                        //style={{ width: 100, height: "100%" }}
                        style={cardImage}
                      ></Image>
                      </Text>
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8, flex: 1 }}>
                      <Text style={{fontWeight: "bold", fontSize: 13 }} >{data.name}</Text>
                      <Text style={{ fontSize: 8 }}>{data.addres}</Text>                      
                    </View>
                  </View>
                  <View style={triangle}></View>
                  </View>
              </CalloutMob>                
            </MarkerMob>
        ))}              
        </MapViewMob>  
        {isViewSearch && (
          <View style={{ position: 'absolute', top:8, left: 3, rigth:50, width: '85%' }}>
            <TextInput style={{margin: 8}}
              mode="outlined"
              theme={{roundness: 20,}}
              contentStyle={styles.searchText}
              label="Search"
              textContentType={"streetAddressLine1","streetAddressLine2"}
              //keyboardType="email-address"
              placeholder="Name, street, postalCode, city"
              placeholderTextColor='gray'
              left={
                <TextInput.Icon
                  icon={() => (
                    <Image source={require('../assets/favico.png')} style={{width: 40, height: 40}} />)}
                   onPress={() => searchShowOptions?setSearchShowOptions(false):setSearchShowOptions(true)}
                /> 
              }
              right={
                <TextInput.Icon
                  icon="magnify"
                  style={styles.icon}
                  onPress={() => {
                    if (searchQuery.length > 2) { searchLocationAddres(searchQuery); }
                  }}
                /> 
              }             
              onFocus={() => {filterResult(searchQuery);setSearchShowOptions(true)}}
              //onBlur={() => setSearchShowOptions(false)}
              onChangeText={(text) => filterResult(text)}
              value={searchQuery}               
            />
            {searchShowOptions && filteredResult.length > 0 && (
              <ScrollView style={[styles.list, filteredResult.length<3?styles.setHeight1:'']}>
                {countLocation>0 && (<Text style={styles.section}>Marcadores de busquedas</Text>)}
                {filteredResult.map((item, index) => ( renderItemResult(item,"marker")))}               
                <Text style={styles.section}>Distritos/Codigos postales</Text>   
                {filteredResult.map((item, index) => ( renderItemResult(item,"")))}               
              </ScrollView>
            )}
          </View>
        )}        
        <View style={styles.menuContainer}>                                        
            <TouchableOpacity style={[styles.bubble, styles.button]} 
              onPress={() => isViewSearch?setisViewSearch(false):setisViewSearch(true)}>            
              <IconButton icon='text-search' />   
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bubble, styles.button]} 
              onPress={() => searchAnimated()}>              
              <IconButton icon='map-search' />   
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bubble, styles.button]} 
              onPress={() => searchLocation()}>            
              <IconButton icon='crosshairs-gps' />   
            </TouchableOpacity>  
            <TouchableOpacity  style={[styles.bubble, styles.button]} 
              onPress={() => handleZoom(true)} disabled={zoom === MAX_ZOOM_LEVEL}>              
              <Text style={{ fontSize: 18 }}>+</Text>     
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.bubble, styles.button]} 
              onPress={() => handleZoom()} disabled={zoom === MIN_ZOOM_LEVEL}>              
              <Text style={{ fontSize: 22 }}>-</Text>     
            </TouchableOpacity>          
          </View>     
        {/* style={buttonContainer}* */}      
        <View style={styles.buttonContainer}>                        
          <View style={[expand==='down'?styles.setHeight:'', expand==='vertical'?containerFlat:'', { flex: 1, paddingBottom: 10}]}>
              <FlatList 
                ref={flatListRef}
                horizontal={expand==='horizon'?true:false}
                data={users}
                keyExtractor={({ id }) => id.toString()}
                renderItem={renderItem}                     
                showsHorizontalScrollIndicator={false}                    
                onScroll={onScroll}
              />            
          </View>
          <View>               
            <TouchableOpacity style={[styles.bubble, styles.button]} 
              onPress={changeExpand}>
              <IconButton icon={getIconExpand()} />
            </TouchableOpacity> 
          </View>
        </View>
      </View>
    )}   
    </>
  )}
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,1.1)',//0.7
    //paddingHorizontal: 14,
    //paddingVertical: 8,
    borderRadius: 20,
  },
  button: {
    width: 50,
    //paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    //width: '100%', 
    //flexWrap: 'wrap-reverse',
    position: 'absolute',
     top:20, left: 250, 
    backgroundColor: 'transparent',
  },
  setHeight: {
    height: CARD_HEIGHT*0.60,
  },
  setHeight1: {
    height: CARD_HEIGHT*0.60,
  },
  searchText: {
    margin: 6,
    color: '#000',
    backgroundColor: '#FFF',
    height: 40,
        //paddingHorizontal: 7,
    fontSize: 10,
  },
  searchText_ant: {
        borderRadius: 10,
        margin: 5,
        color: '#000',
        borderColor: '#666',
        backgroundColor: '#FFF',
        borderWidth: 1,
        height: 55,
        paddingHorizontal: 7,
        fontSize: 10,
  },
  section: {
    paddingHorizontal: 16, paddingVertical: 8, fontSize: 10,
  },
  list: {
    //...StyleSheet.absoluteFill,
    //width: 400, 
    left: 10, 
    height:CARD_HEIGHT*0.70,
    width: '90%',
    borderRightWidth: 1, borderRadius: 10,   
    backgroundColor: '#FFF',
    //zIndex: 9,
  },
  itemContainer: {
    paddingLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ebebeb",
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  content: {
    borderBottomColor: "#ebebeb",
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  title: { flex: 1, fontSize: 10, lineHeight: 18 },
  subTitle: { flex: 1, fontSize: 8, color: "gray", lineHeight: 14 },
});