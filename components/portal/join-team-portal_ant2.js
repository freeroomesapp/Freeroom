import { MenuContext } from '../../context/menu-provider';
import { AuthenticationContext } from '../../context/menu-provider';
import React, { useEffect, useState } from 'react';
import { useCallback, useContext } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Switch, TouchableOpacity, Platform, Modal, Dimensions, FlatList, BackHandler} from 'react-native';
import { LiteCreditCardInput, CreditCardInput} from "react-native-credit-card-input-plus";

import {Appbar, Card, Button, TextInput, ActivityIndicator, IconButton, List } from 'react-native-paper';

import { BlurView } from 'expo-blur';
//import { FlashList } from '@shopify/flash-list';

import { dns, hotels} from '../../hooks/utils/data';  
import { Cardstyles } from '../../assets/styles';  
import { formatCurrency } from "react-native-format-currency";

const { height, width } = Dimensions.get('window');

export const JoinTeamPortal = props => {

  const item  = props.id
  const id = item.id;
  let rooms = [];   

  let i = 0;
  let dispoStr = '';  
  if (item.rooms && item.rooms.length>0) { 
    rooms = item.rooms;
    rooms.map((end, index) => {if (end.availability===1) i = i + 1; })
  } else {
    dispoStr = 'No Rooms.';
  }
  if (i===0) dispoStr = 'No Rooms.'; 
  if (i===1) dispoStr = 'Un room disponible.'; 
  if (i>1) dispoStr = item.rooms.length + ' rooms disponibles.'; 

  const [selectedRoom, setSelectedRoom] = useState(-1);    
  const { card, cardBorder, cardImage, cardtitle, cardDescription, containerImageIcon, iconButton, currencyText, nestedReserva, nestedCard, containerFlat} = Cardstyles();
  
  const [nerror, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [reservaId, setReservaId] = useState('');    
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [reserva, setReserva] = useState([]);
   //const [rooms, setRooms] = useState([]);
   //const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState({});
  //
  const getCancel = () => {
    const params = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
    };
    // + paymentIntentId
    fetch(dns + '/free-room/v1/cancel/' + paymentIntentId, params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setErrorCard(statuscode + ' No canceled.');
              else return response.json();
          }) 
      .then(json => {
        setErrorCard('Payment canceled.');      
      });
  }

  const getConfirm = (item) => {
    const params = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    };
    // + paymentIntentId
    fetch(dns + '/free-room/v1/confirm/{id}', params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setErrorCard(statuscode + ' No confirm.');
              else return response.json();
          }) 
      .then(json => {
        setErrorCard('Confirm payment sucess.');      
      });
  }

  const getPaymentIntent = (item) => {
    const params = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    };
    fetch(dns + '/free-room/v1/paymentIntent/', params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) {
                setErrorCard(statuscode + ' No paymentIntent.');
                setIsPay(false);  
              } else return response.json();
          }) 
      .then(json => {
        setPaymentIntentId(json.id);
        setErrorCard('Payment Intend sucess.');      
      });
  }
  const setConfirmReservation = (item) => {
    const params = { 
      method: 'PUT',
      headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    };
    let msg1 = 'No paid.'; let msg2 = 'Reservation success. Paid.';
    if (item.status==="CANCEL") {
      msg1 = 'No canceled.';
      msg2 = 'Reservation Canceled.';
    }
    fetch(dns + '/free-room/v1/reservation/update?id=' + reservaId, params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setErrorCard(statuscode + msg1);
              else return response.json();
          }) 
      .then(json => {
        setErrorCard(msg2);
      });
  }
  //
  const setReservation = (item) => {
    const params = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    };
    fetch(dns + '/free-room/v1/reservation/', params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setErrorCard(statuscode + ' No reservation.');
              else return response.json();
          }) 
      .then(json => {
        setReservaId(json.data);
        setErrorCard('Reservation success. Pending Pay.');      
      });
      return reservaId;
  }

  const getHotel = () => {
        fetch(dns + '/free-room/v1/hotels/' + id)
          .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setError('Data no find in Server.');
              else return response.json();
          })
          .then((json) => {
              setHotel(json.data);
          })
          .catch((error) => setError("Server no find."))
          .finally(() => setLoading(false));
  }

  useEffect(() => {
        console.log(id)
        //setLoading(true);
        //getHotel();
        setHotel(item);
        if (rooms.length>0) { 
            setSelectedRoom(0); 
            setValuePrice(rooms[0].price);
            setPrice(getFormatCurrency(rooms[0].price));  
            setRoomId(rooms[0].id);
        }
  }, [id]);
    
  const { handleHide, joinPortalDialogVisible } = useContext(MenuContext);
  const { user, userReg, users, status, error, errorUser, setErrorUser, 
    isLoadingLogin, setLoadingLogin, isLoadingSignup, setLoadingSignup, 
    onSigLogin} = useContext(AuthenticationContext);

  const onDialogDismiss = useCallback(() => {
    handleHide({
      dialogType: 'joinPortal',
    });
  }, [handleHide]);

  //Hace el dismiss pero me saca de la app.
  useEffect(() => {
	  if (Platform.OS === 'android') {    
        const backHandler = BackHandler.addEventListener(
        'hardwareBackPress', () => { onDialogDismiss; return true;},
      );
      return () => backHandler.remove();
    }
  }, []);

  const [startDate, setStartDate] = useState('');  
  const [endDate, setEndDate] = useState('');    
  const [startDateStr, setStartDateStr] = useState('');  
  const [endDatestr, setEndDateStr] = useState('');    
  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    
    var dateStr = '' + date; 
    if (date<10) dateStr = '0'+date;

    var dateEnd = new Date().getDate()+1; //Current Date

    var dateEndStr = '' + dateEnd; 
    if (dateEnd<10) dateEndStr = '0'+dateEnd;

    var month = new Date().getMonth() + 1; //Current Month
    
    var monthStr = '' + month; 
    if (month<10) monthStr = '0'+month;
    
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds    
    setStartDate(year + '-' + monthStr + '-' + dateStr + 'T10:00:00');
    setEndDate(year + '-' + monthStr + '-' + dateEndStr + 'T10:00:00');
    //
    setStartDateStr(year + '-' + monthStr + '-' + dateStr + ' 12:00');
    setEndDateStr(year + '-' + monthStr + '-' + dateEndStr + ' 12:00');
  }, []);
  const [idUser, setIdUser] = useState('');
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('4242');
  const [price, setPrice] = useState('0');  
  const [valuePrice, setValuePrice] = useState(0);
  const [roomId, setRoomId] = useState('');
  const [numberCard, setNumberCard] = useState('4242 4242 4242 4242'); 
  const [expiryCard, setExpiryCard] = useState('10/26'); 
  const [cvcCard, setCvcCard] = useState('321');     
  const [ultNumberCard, setUltNumberCard] = useState(''); 
  const [errorCard, setErrorCard] = useState(''); 
  const [statusUser, setStatusUser] = useState('error'); 
  //
  const [showUser, setShowUser] = useState(false);
  const [saveCard, setSaveCard] = useState(false);   
  const [saveGDPR, setSaveGDPR] = useState(false);    
  const [isPay, setIsPay] = useState(false); //Click boton Pay
  const [isPayConfirmed, setIsPayConfirmed] = useState(false); //Click boton Pay Confirmed
  //
  //const [card, setCard] = React.useState({})
  //const [formData, setFormData] = useState<CreditCardFormData>(undefined); 

  const [isRegister, setRegister] = useState(false);

  useEffect(() => {
    setIdUser(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    if (user.gdpr=="true" || user.gdpr===true) setSaveGDPR(true); else setSaveGDPR(false);
    if (user.token==="") {     
      setShowUser(true);      
      setStatusUser('error');
      setRegister(true);
      setPassword('4242');       
    } else {
      setShowUser(false);
      setRegister(false);
      setStatusUser('success');
    }
  }, [user]);
  
  const onFocus = (field) => {
    console.log("focusing", field);
  };

  const {confirmPayment, loading} = useState(true);
  
  //When card issuer cant be detected, use these default (3 digit CVC, 
  //16 digit card number with spaces every 4 digit)
  //
  //Start Validator Card.
  const cvcMaxLength = 3;  
  const gaps = [4, 8, 12];

  const removeNonNumber = (string = '') => string.replace(/[^\d]/g, '');
  const limitLength = (string = '',maxLength) => string.slice(0, maxLength); 
  
  const addGaps = (string = '') => {
    const offsets = [0].concat(gaps).concat([string.length]);

    return offsets
      .map((end, index) => {
        if (index === 0) return '';
        const start = offsets[index - 1] || 0;
        return string.slice(start, end);
      })
      .filter((part) => part !== '')
      .join(' ');
  };

  const formatNumberCard = (number: string) => {
    const numberSanitized = removeNonNumber(number);
    const lengthSanitized = limitLength(numberSanitized, 16);
    const formatted = addGaps(lengthSanitized);
    setNumberCard(formatted);    
    if (isRegister && formatted.length>=16) setUltNumberCard(formatted.slice(15));
  }
  
  const formatCardExpiry = (expiry: string) => {
    const sanitized = limitLength(removeNonNumber(expiry), 4);
    if (sanitized.match(/^[2-9]$/)) {
      return `0${sanitized}`;
    }
    if (sanitized.length > 2) {
      return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`;
    }     
    if (parseInt(sanitized) > 12) {
       return `12`;      
    }
    return sanitized; 
  };

  const formatCardCVC = (cvc: string) => {
    setCvcCard(limitLength(removeNonNumber(cvc), cvcMaxLength));    

  };
  //F. Validator Card
  //onDialogDismiss
  const onCancel = () => {
    getCancel(); //Anulamos el PaymentId
    setPaymentIntentId('');
    setConfirmReservation({"status": "CANCEL"});
    setReservaId(''); //Nueva reserva
    //onDialogDismiss();
    //Clear info de la Tarjeta
    setNumberCard(''); 
    setExpiryCard('');
    setCvcCard('');
    //
    setErrorCard('Pay cancelled. Intent newly.');
    setIsPay(false); 
    return 'ok';
  }
  
  const onPay = () => {           
      if (numberCard==="" || numberCard.length<2) { setErrorCard('Entry number card.');    return ''; }
      if (numberCard.length<16) { setErrorCard('Length number card invalid.');    return ''; }
      if (!expiryCard)          { setErrorCard('Entry expiry card.');    return ''; }
      if (!cvcCard)             { setErrorCard('Entry CVC card.');       return ''; }
     // if (ultNumberCard==="")   { setErrorCard('Entry number card'); return ''; }
      setErrorCard(''); 
      let success = statusUser; 
      if (isRegister && statusUser!=='success') { 
        if (numberCard.length>=16) {
          setUltNumberCard(numberCard.slice(15));
          setPassword(numberCard.slice(15)); 
        }
        var id = 1; var idStr = '';
        if (users && users.length>0) id = users.length + 1;        
        idStr = id.toString();              
        let ok = onSigLogin({"email": email, "name": name, "password": password, 
                            "userType": "USER", "username": email});  
        if (ok==="Ok") {          
          setStatusUser('success');
          setShowUser(false);
          setRegister(false);
          success = true;
          //onLogin({"usernameOrEmail": email, "password": password});
          setIdUser( user.id );  
          //Antes:setIdUser(idStr);
        }
      }   
      //statusUser==="success"
      if (success && reservaId==='' && idUser!=="" ) {
        //El usuario ya existia o lo acabamos de registrar, es una nueva reserva  nuevo paymentIntent                 
        let resId = setReservation({"endDate": endDate, "room_id": roomId, "startDate": startDate, "status": "PENDING", "user_id": idUser });
        let description = hotel.name + ' Reserva Id:' + resId;           
        setIsPay(true);
        getPaymentIntent({ "description": description, "price": valuePrice });
      }
      return 'ok';
  }
  
  const onPayConfirmed = () => {
      setIsPay(false);
      setIsPayConfirmed(true);
      let description = '' + startDate + ' '  + endDate;
      getConfirm({"description": description, "email": email,
        "nameHotel": hotel.name, "paymentId": paymentIntentId, "reservationId": reservaId});
      setConfirmReservation({"status": "PAID"});

  }
  
  getFormatCurrency = (id) => {
    const [valueFormattedWithSymbol] = formatCurrency({ amount: Number(id), code: 'EUR' });
    return valueFormattedWithSymbol;
  }
  
  const onScrollRoom = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!hotel) return;
    //
    const slideSize = event.nativeEvent.layoutMeasurement.height;
    const _index = event.nativeEvent.contentOffset.x / slideSize;
    let index = Math.round(_index);        
    if (index<0) return ''; 
    if (index>=rooms.length) index=rooms.length-1;
    setSelectedRoom(index);
    setValuePrice(rooms[selectedRoom].price);
    setPrice(getFormatCurrency(rooms[selectedRoom].price));  
    setRoomId(rooms[selectedRoom].id);
  };

  const renderRooms = ({item, index}) => {
    if ( item.availability===0) return '';    
    return (
    <TouchableOpacity style={[card, index === selectedRoom ? cardBorder: ""]} 
        onPress={() => {          
          setSelectedRoom(index); 
          setValuePrice(item.price);          
          setPrice(getFormatCurrency(item.price)); 
          setRoomId(item.id);
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
  
  return (    
    <View style={style.containerArea}>     
      {isLoading && <ActivityIndicator /> } 
      {nerror && (<View style={style.error}><Text>{nerror}</Text></View>)}      
      {!isLoading && !nerror && (
      <View>
        <Appbar.Header>
	        <IconButton icon={'keyboard-backspace'}	size={22} onPress={onDialogDismiss} />
          <Appbar.Content title={hotel.name}/>
	        {statusUser==="success" && (<Appbar.Action icon={'account-circle'} size={24} 
              onPress={() => {showUser?setShowUser(false):setShowUser(true);
          }} />)}
        </Appbar.Header>
      </View>      
      )}
      {!isLoading && !nerror && (  
        <ScrollView style={{marginLeft: 10, height:'100%'}}        
          keyboardShouldPersistTaps="always" 
          scrollEnabled={true}>    
          <Card rounded style={nestedReserva}>            
            <Card.Content>
              <Text style={{fontSize: 10}}>{hotel.addres}</Text>
              <Text style={cardDescription}>{dispoStr}</Text> 
              {rooms.length>0 && i>0 && (<View style={containerFlat}>
                <FlatList 
                  horizontal={true}
                  data={rooms}
                  renderItem={renderRooms}
                  keyExtractor={({ id }) => id.toString()}
                  showsHorizontalScrollIndicator={false} 
                  onScroll={onScrollRoom}  
                />
              </View>)}
              <List.Item title="Check-In-Out"
                description={startDateStr + '\n' + endDatestr}
                titleNumberOfLines={2}
                left={(props) => <List.Icon {...props} icon="calendar-clock" />}
              />
          </Card.Content>
          </Card>            
          <TextInput
                label="Number"
                value={numberCard}
                textContentType="creditCardNumber"
                keyboardType="numeric"
                style={style.input}
                placeholderTextColor={"darkgray"}
                placeholder={'1234 5678 1234 5678'}                
                onChangeText={(v) => formatNumberCard(v)}
                onFocus={onFocus}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
          />
          <View style={style.extraContainer}> 
              <TextInput
                label="Expiry"
                value={expiryCard}
                textContentType="creditCardExpiration"
                keyboardType="numeric"
                style={style.expiryInputContainer}
                placeholderTextColor={"darkgray"}
                placeholder={'mm/yy'}                
                onChangeText={(v) => setExpiryCard(formatCardExpiry(v))}   
                onFocus={onFocus}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
              />
              <TextInput
                label="CVC"
                value={cvcCard}
                textContentType="none"
                keyboardType="numeric"
                style={style.cvcInputContainer}
                placeholderTextColor={"darkgray"}
                placeholder={'123'}                
                onChangeText={(v) => formatCardCVC(v)}                   
                onFocus={onFocus}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
              />
              <TextInput
                label="Value"
                value={price}
                editable={false}
                textContentType="none"
                keyboardType="numeric"
                style={style.valueContainer}
                placeholderTextColor={"darkgray"}
                placeholder={'123'}                
                onChangeText={(v) => setPrice(v)}                   
                onFocus={onFocus}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
              />
          </View>
          <View style={style.row}>
            <Switch
              onValueChange={(value) => setSaveCard(value)}
              value={saveCard}
            />
            <Text style={style.text}>Save card during payment.</Text>
          </View>
          {showUser && (<TextInput
                label="Name"
                value={name}
                editable={isRegister}
                textContentType="name"
                keyboardType="name-phone-pad"
                placeholder="My name"
                placeholderTextColor={"darkgray"}
                autoCapitalize="none"
                onChangeText={(userName) => setName(userName)}
                style={style.input}
          />
          )}                    
          {showUser && (
          <TextInput
                label="E-mail"
                value={email}
                editable={isRegister}
                textContentType="emailAddress"
                keyboardType="email-address"
                placeholder="E-mail"
                placeholderTextColor={"darkgray"}
                autoCapitalize="none"
                onChangeText={(userEmail) => setEmail(userEmail)}
                style={style.input}
          />            
          )}
          {showUser && (<View style={style.row}>
            <Switch
              onValueChange={(value) => {if (isRegister) setSaveGDPR(value)}}
              value={saveGDPR}
            />
            <Text style={style.text}>Accept GDPR politics</Text>
          </View> 
          )}
          {errorUser && statusUser==="error" && (<View style={style.error}>          
              <Text>{errorUser}</Text>
            </View>
          )}
          {error && (<View style={style.error}>          
              <Text>{error}</Text>
            </View>
          )} 
          {errorCard && (<View style={style.error}>          
              <Text>{errorCard}</Text>              
            </View>
          )}
          {(reservaId!=='' || paymentIntentId!=='') && (<View style={style.error}>          
              <Text>ReservaID: {reservaId} PaymentIntentId: {paymentIntentId}</Text>              
            </View>
          )}    
          <View style={style.buttomContainer}>           
             <View style={{ position: 'top', size: 'large'}}>
                      <Button mode="contained" onPress={onPay}>Pay</Button>
             </View>             
             <View style={{ size: 'large', marginLeft: 8}}>             
                      <Button mode="contained" onPress={onDialogDismiss}>Return</Button>                      
              </View>
          </View>
        </ScrollView>          
        )} 
        {isPay && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}>
            <BlurView style={style.blur} tint="light" intensity={20}>
              <View
                style={{
                  justifyContent: 'center',
                  width: Platform.OS == 'web' ? '100' : '90%',
                  backgroundColor: COLORS.dark_gray, 
                }}>
                <Text style={{ color: COLORS.white, ...FONTS.body5 }}>
                 PaymentIntentId: {paymentIntentId}
                </Text>
                <Text style={{ color: COLORS.white, ...FONTS.body5 }}>
                  Hotel: {hotel.name} ReservaID {reservaId} 
                </Text>                
		            <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                  Card: {numberCard} 
                </Text>                
                <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                  Exp: {expiryCard} CVC: {cvcCard} 
                </Text>
                <Text style={[{ color: COLORS.white, ...FONTS.body2 }, {currencyText}]}> {price}</Text>
                <View style={style.buttomContainer}>           
                  <View style={{ position: 'top', size: 'large'}}>
                      <Button mode="contained" onPress={onPayConfirmed}>Confirm pay</Button>
                  </View>             
                  <View style={{ size: 'large', marginLeft: 8}}>             
                      <Button mode="contained" onPress={onCancel}>Cancel
                      </Button>                      
                  </View>
                </View>
	            </View>            
	          </BlurView>
          </Modal>
        )}
        {isPayConfirmed && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={true}>
            <BlurView style={style.blur} tint="light" intensity={20}>
              <TouchableOpacity
                style={style.absolute}
                onPress={onDialogDismiss}>
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  width: Platform.OS == 'web' ? '100' : '85%',
                  backgroundColor: COLORS.dark_gray, 
                }}>
		            <Text style={{alignItems: 'center', color: COLORS.white, ...FONTS.h2 }}>
                  Thanks by Pay
                </Text>
                <Text style={{alignItems: 'center', color: COLORS.white, ...FONTS.body3 }}>
                  Disfruit your reservation!
                </Text>                
                <View style={style.buttomContainer}>           
                  <View style={{ size: 'large', marginLeft: 8}}>             
                      <Button mode="contained" onPress={onDialogDismiss}>Exit
                      </Button>                      
                  </View>
                </View>
	            </View>            
	          </BlurView>
          </Modal>
        )}       
    </View>
  );
};
const COLORS: colors = {
  blurple: '#635BFF',
  blurple_dark: '#5851DF',
  white: '#FFFFFF',
  light_gray: '#F6F9FC',
  dark_gray: '#425466',
  slate: '#0A2540',
  bgColor: '#D09040',
};

const SIZES: Sizes = {
    //globalls
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  //fontSizes
  navTitle: 25,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  h5: 12,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,
  body6: 10,

};

const FONTS: Fonts = {  
  navTitle: { fontSize: SIZES.navTitle, fontWeight: '700' },
  largeTitleBold: { fontSize: SIZES.h2 },
  mediumTitleBold: { fontSize: SIZES.h3 },
  smallTitleBold: { fontSize: SIZES.h5 },
  h1: { fontSize: SIZES.h1, lineHeight: 36, fontWeight: '800' },
  h2: { fontSize: SIZES.h2, lineHeight: 30, fontWeight: '700' },
  h3: { fontSize: SIZES.h3, lineHeight: 22, fontWeight: '600' },
  h4: { fontSize: SIZES.h4, lineHeight: 22, fontWeight: '500' },
  h5: { fontSize: SIZES.h5, lineHeight: 22, fontWeight: '400' },
  body1: { fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontSize: SIZES.body4, lineHeight: 22 },
  body5: { fontSize: SIZES.body5, lineHeight: 22 },
  body6: { fontSize: SIZES.body6, lineHeight: 22 },
};

const style = StyleSheet.create({
  containerArea: {
    height:'100%',
    //maxHeight: 400,
    marginTop: 0,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  input: {
    fontSize: 12,
    marginTop: 10,
    height: 50,
    borderBottomColor: COLORS.slate, 
    borderBottomWidth: 1.5,
  },
  extraContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  buttomContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', alignItems: 'center',    
    marginTop: 10,
    paddingHorizontal: 10,
//    marginLeft: 10,
  },
  expiryInputContainer: {
    flex: 1,
    fontSize: 12,
    marginRight: 5,
    height: 50,
  },
  cvcInputContainer: {
    flex: 1,
    fontSize: 12,
    marginLeft: 5,
    height: 50,
  },
  valueContainer: {
    flex: 1,
    fontSize: 14,    
    fontWeight: 'bold',
    marginLeft: 5,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    marginLeft: 4,        
  },
  error: { 
    size:'large', 
    alignitems: 'center', 
    alignself: 'center', 
    maxwidth: 100, 
    margintop:10, 
    marginbottom:2
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  blur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

