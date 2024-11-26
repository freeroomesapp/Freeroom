import { MenuContext } from '../../context/menu-provider';
import { FavorContext, AuthenticationContext } from '../../context/menu-provider';
import React, { useEffect, useState } from 'react';
import { useCallback, useContext } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Switch, TouchableOpacity, Platform, Modal, FlatList, BackHandler, Linking, Dimensions } from 'react-native';

import {Appbar, Card, Button, TextInput, HelperText, ActivityIndicator, IconButton, List } from 'react-native-paper';

import { BlurView } from 'expo-blur';

import { urlGDPR, hour, dns, hotels} from '../../hooks/utils/data';  
import { Cardstyles } from '../../assets/styles';  
import { formatCurrency } from "react-native-format-currency";

export const JoinTeamPortal = props => {

  let screenWidth = Dimensions.get("window").width;
  let screenW = 10;
  if (Platform.OS==='web') {
      screenW = (screenWidth / 2) - 190; 
  }  
  const item  = props.id
  const id = item.id;
  let rooms = [];   

  let i = 0;
  let dispoStr = '';  
  if (item.rooms && item.rooms.length>0) { 
    rooms = item.rooms;
    rooms.map((end, index) => {if (end.availability===1) i = i + 1; })
    if (i===0) {
      rooms = [];
    } else {
      rooms = rooms.filter((end, index) => (end.availability===1));      
    }
  } else {
    dispoStr = 'No hay habitaciones disponibles en este momento.';
  }
  if (i===0) dispoStr = 'No hay habitaciones disponibles en este momento.'; 
  if (i===1) dispoStr = 'Una habitación.'; 
  if (i>1) dispoStr = rooms.length + ' habitaciones.'; 

  const { removeScreens  } = useContext(FavorContext); 

  const [capacity, setcapacity] = useState(0); 
  const [selectedRoom, setSelectedRoom] = useState(-1);    
  const {card, cardBorder, cardImage, cardtitle, cardDescription, 
        containerImageIcon, iconButton, currencyText, currencyTextNot, 
        currencyTextOffer, nestedReserva, containerFlat2, textHelp, textHelpSw, url} = Cardstyles();
  
  const [nerror, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [reservaId, setReservaId] = useState('');    
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [hotel, setHotel] = useState({});
  //
  const getCancel = () => {
    const params = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
    };
    fetch(dns + '/free-room/v1/cancel/' + paymentIntentId, params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setErrorCard(statuscode + ' No canceled.');
              else return response.json();
          }) 
      .then(json => {
        setErrorCard('Payment canceled.');      
      })      
      .catch((error) => console.log('Error del POST en v1/cancel/ ',  error));
  }

  const getConfirm = (item) => {
    const params = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    };
    fetch(dns + '/free-room/v1/confirm/{id}', params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) setErrorCard(statuscode + ' No confirm.');
              else return response.json();
          }) 
      .then(json => {
        setErrorCard('Confirm payment sucess.');      
      })      
      .catch((error) => console.log('Error del POST en v1/confirm/ ',  error));
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
      })      
      .catch((error) => console.log('Error del POST en v1/paymentIntent/ ',  error));
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
      })
      .catch((error) => console.log('Error del PUT en v1/reservation/update ',  error));
  }
  //
  const setReservation = (item) => {
    const params = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    };
    fetch(dns + '/free-room/v1/reservation', params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) {
                console.log("Error en v1/reservation: ", statuscode);
                setErrorCard(statuscode + ' No reservation.');
              } else return response.json();
          }) 
      .then(json => {
        setReservaId(json.data);
        setErrorCard('Reservation success. Pending Pay.');      
      })      
      .catch((error) => console.log('Error del POST en v1/reservation ',  error));
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
    if (id==="") {
      onDialogDismiss(); //No funciona aun
    } else { 
        console.log(id)
        //setLoading(true);
        //getHotel();
        setHotel(item);
        if (rooms.length>0) { 
            setSelectedRoom(0); 
            setcapacity(rooms[0].capacity);
            getPrice(rooms[0]);
            //setValuePrice(rooms[0].price);
            //setPrice(getFormatCurrency(rooms[0].price));  
            setRoomId(rooms[0].id);
        }
    }
  }, [id]);
    
  const { handleHide } = useContext(MenuContext);
  const { user, userReg, userData, error, errorUser, setErrorUser, 
    onRegister, onLogin, updateCard, getReservations } = useContext(AuthenticationContext);

  const onDialogDismiss = useCallback(() => {
    handleHide({
      dialogType: 'joinPortal',
    });
    removeScreens();
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
    setStartDate(year + '-' + monthStr + '-' + dateStr + 'T12:00:00');
    setEndDate(year + '-' + monthStr + '-' + dateEndStr + 'T12:00:00');
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
  const [showOffer, setShowOffer] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [numberCard, setNumberCard] = useState('');//4242 4242 4242 4242 
  const [expiryCard, setExpiryCard] = useState('');//10/26 
  const [cvcCard, setCvcCard] = useState('');//321     
  const [ultNumberCard, setUltNumberCard] = useState(''); 
  const [errorCard, setErrorCard] = useState(''); 
  const [statusUser, setStatusUser] = useState('error'); 
  //
  const [showUser, setShowUser] = useState(false);
  const [saveCard, setSaveCard] = useState(false);   
  const [saveComm, setSaveComm] = useState(false); 
  const [saveGDPR, setSaveGDPR] = useState(false); 
  const [saveTerm, setSaveTerm] = useState(false);
  const [isPay, setIsPay] = useState(false); //Click boton Pay
  const [isPayConfirmed, setIsPayConfirmed] = useState(false); //Click boton Pay Confirmed
  //
  const [isRegister, setRegister] = useState(false);

  useEffect(() => {
    setTimeout(() => {
        setErrorUser('');
      }, 2000); //El mensaje de error será visible por lo menos 2 segundos.
  }, [errorUser]);

  useEffect(() => {
    setTimeout(() => {
        setErrorCard('');
      }, 2000); //El mensaje de error de Tarjeta será visible por lo menos 2 segundos.
  }, [errorCard]);

  useEffect(() => {
    if (userReg.email!=="") onLogin({"usernameOrEmail": email, "password": password});
  }, [userReg]);

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
  
  useEffect(() => {
    setName(userData.name);
    setEmail(userData.email);
    if (numberCard==='' &&  userData.cardnumber!=='') {
      setNumberCard(userData.cardnumber);
      setSaveCard(true);
    }
  }, [userData]);
  
  const onFocus = (field) => {
    //console.log("focusing", field);
  };

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

  const validate = () => {           
    if (numberCard==="" || numberCard.length<2) { 
        setErrorCard('Entry number card.');    return ''; 
    }
    if (numberCard.length<16) { setErrorCard('Length number card invalid.');  return ''; }
    if (!expiryCard)          { setErrorCard('Entry expiry card.');           return ''; }
    if (!cvcCard)             { setErrorCard('Entry CVC card.');              return ''; }
    // if (ultNumberCard==="")   { setErrorCard('Entry number card'); return ''; }
    setErrorCard(''); 
    return 'Ok';
  }
  const registerUser = () => {           
    if (validate()==='') return '';
    let success = false; 
    if (isRegister && statusUser!=='success') { 
        if (numberCard.length>=16) {
          setUltNumberCard(numberCard.slice(15));
          setPassword(numberCard.slice(15)); 
        }
        //onSigLogin              
        let ok = onRegister({"email": email, "name": name, "password": password, 
                  "userType": "USER", "username": email, "acceptCommunications": saveComm, 
                  "acceptPrivacyPolicy": saveGDPR, "acceptTermsAndConditions": saveTerm});  
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
    return success;
  }

  const onPay = () => {           
    if (validate()==='') return '';
    //let success = registerUser(); 
    //statusUser==="success"
    if (statusUser==='success' && reservaId==='' && idUser!=="" ) {
      //El usuario ya existia o lo acabamos de registrar, 
      //es una nueva reserva  nuevo paymentIntent                 
      let resId = setReservation({"endDate": endDate, "room_id": roomId, "startDate": startDate, "status": "PENDING", "user_id": idUser });
      let description = hotel.name + ' Reserva Id:' + resId;      //resId.id?     
      setIsPay(true);
      getPaymentIntent({ "description": description, "price": valuePrice });
      //Actualizar el numero de la tarjeta
      if (saveCard) updateCard({"cardNumber": numberCard}); 
      else updateCard({"cardNumber": ""}); 
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
      getReservations();
  }
  
  const getFormatCurrency = (id) => {
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
    setcapacity(rooms[index].capacity);
    getPrice(rooms[selectedRoom]);
    //setValuePrice(rooms[selectedRoom].price);
    //setPrice(getFormatCurrency(rooms[selectedRoom].price));  
    setRoomId(rooms[selectedRoom].id);
  };

  const getPrice = (item) =>{
    var hours = new Date().getHours(); //Current Hours
    if (item.onSale===0) {
        setValuePrice(item.price);
        setPrice(getFormatCurrency(item.price));
    } else if (hours < hour) {
        setValuePrice(item.price);
        setPrice(getFormatCurrency(item.price));
    } else {
        setValuePrice(item.offerPrice);
        setPrice(getFormatCurrency(item.offerPrice));
    }
  }

  const renderRooms = ({item, index}) => {
    if ( item.availability===0) return '';    
    //
    var price  = getFormatCurrency(item.price); 
    var priceI = getFormatCurrency(item.price);     
    let showoffer = false;
    var hours = new Date().getHours(); //Current Hours
    if (item.onSale===1 && hours >= hour) {
      showoffer = true;
      priceI = getFormatCurrency(item.offerPrice);
    }
    return (
    <TouchableOpacity style={[card, index === selectedRoom ? cardBorder: ""]} 
        onPress={() => {          
          setSelectedRoom(index); 
          setcapacity(item.capacity);  
          getPrice(item);        
          //setValuePrice(item.price);          
          //setPrice(getFormatCurrency(item.price)); 
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
  
  return (    
    <View style={Platform.OS==='web'?style.containerAreaWeb:style.containerArea }>  
      {isLoading && <ActivityIndicator /> } 
      {nerror && (<View style={style.error}><Text>{nerror}</Text></View>)}      
      {!isLoading && !nerror && (
      <View style={{left: screenW}}>
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
        <ScrollView style={{left: screenW, height:'100%'}}        
          keyboardShouldPersistTaps="always" 
          scrollEnabled={true}>    
          <Card rounded style={nestedReserva}>            
            <Card.Content>                             
              {rooms.length>0 && (<View style={containerFlat2}>
                <FlatList 
                  horizontal={true}
                  data={rooms}
                  renderItem={renderRooms}
                  keyExtractor={({ id }) => id.toString()}
                  showsHorizontalScrollIndicator={true} 
                  onScroll={onScrollRoom}  
                />
              </View>)}
              <Text style={style.text}>{hotel.addres}</Text>              
              <View style={style.textContainer}> 
                <Text style={style.textBlack}>Disponibilidad:</Text>
                <Text style={style.text}>{dispoStr}</Text>
              </View>
              <View style={style.textContainer}> 
                <Text style={style.textBlack}>Id de la Habitación:</Text>
                <Text style={style.text}>{roomId}</Text>
              </View>
              <View style={style.textContainer}> 
                <Text style={style.textBlack}>Capacidad:</Text>
                <Text style={style.text}>{capacity}</Text>
              </View>
              <View style={style.textContainer}> 
                <Text style={style.textBlack}>Check-In:</Text>
                <Text style={style.text}>{startDateStr}</Text>
              </View>
            </Card.Content>
          </Card>            
          <View> 
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
              <HelperText type="error" visible={!numberCard} style={textHelp}>
                Número de la tarjeta es requerido.
              </HelperText>
          </View>
          <View style={style.extraContainer}> 
            <View> 
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
              <HelperText type="error" visible={!expiryCard} style={textHelp}>
                Fecha requerida
              </HelperText>
            </View>
            <View> 
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
              <HelperText type="error" visible={!cvcCard} style={textHelp}>
                CVC requerido
              </HelperText>
            </View>
            <View>              
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
              <HelperText type="info" visible={true}  style={style.textNote}>
                *Pago seguro con Stripe.
              </HelperText>
           </View>
          </View>
          <View style={style.row}>
            <Switch value={saveCard} onValueChange={(v) => setSaveCard(v)}/>
            <Text style={style.text}>Autorizo guardar el número de la Tarjeta para futuros pagos.</Text>
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
            <View>
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
              <HelperText type="error" visible={!email} style={textHelp}>
                E-mail es requerido.
              </HelperText>
            </View>
          )}
          {showUser && isRegister && (
          <View>
            <View>
              <TouchableOpacity onPress={() => Linking.openURL(urlGDPR)}>
                <Text style={url}>Abrir politicas de privacidad, términos y condiciones</Text>
              </TouchableOpacity>
            </View>
            <View style={style.row}>
              <Switch value={saveComm} onValueChange={(v) => setSaveComm(v)}/>
              <Text style={style.text}>Acepto recibir comunicaciones.</Text>
            </View>
            <View style={style.row}>
              <Switch value={saveGDPR} onValueChange={(v) => setSaveGDPR(v)}/>
              <Text style={style.text}>Estoy de acuerdo con la política de uso y tratamiento de mis datos personales.</Text>
            </View>
            {!saveGDPR && (<Text style={textHelpSw}>Es requerido que acepte nuestras políticas de privacidad.</Text>
            )}
            <View style={style.row}>
              <Switch value={saveTerm} onValueChange={(v) => setSaveTerm(v)}/>
              <Text style={style.text}>Estoy de acuerdo con los términos y condiciones.</Text>
            </View>
            {!saveTerm && (<Text style={textHelpSw}>Es requerido que acepte nuestros términos y condiciones.</Text>
            )}            
          </View>)}
          {errorUser && statusUser==="error" && (
            <View style={style.error}>          
              <Text>{errorUser}</Text>
            </View>
          )}
          {error==="XXXXX" && (<View style={style.error}>          
              <Text>{error}</Text>
            </View>
          )} 
          {errorCard && (<View style={style.error}>          
              <Text>{errorCard}</Text>              
            </View>
          )}
          {(reservaId!=='' || paymentIntentId!=='') && (
            <View style={style.error}>          
              <Text>ReservaID: {reservaId} PaymentIntentId: {paymentIntentId}</Text>              
            </View>
          )}    
          <View style={style.buttomContainer}>           
             {showUser && isRegister && saveGDPR && saveTerm && (
               <View style={{ position: 'top', size: 'large'}}>
                  <Button mode="contained" onPress={registerUser}>Registarme</Button>
              </View>
             )}
             {!(showUser && isRegister) && saveGDPR && (
               <View style={{ position: 'top', size: 'large'}}>
                  <Button mode="contained" onPress={onPay}>Pagar</Button>
              </View>
             )}             
             <View style={{ size: 'large', marginLeft: 8}}>             
                  <Button mode="contained" onPress={onDialogDismiss}>Regresar</Button>
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
                    <Button mode="contained" onPress={onPayConfirmed}>Confirmar pago</Button>
                  </View>
                  <View style={{ size: 'large', marginLeft: 8}}>
                    <Button mode="contained" onPress={onCancel}>Cancelar</Button>
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
    marginTop: 0,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  containerAreaWeb: {
    height:'100%',     
    maxWidth: 400,
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
    marginTop:  5,
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
    maxWidth: 100
  },
  cvcInputContainer: {
    flex: 1,
    fontSize: 12,
    marginLeft: 5,
    height: 50,
    maxWidth: 100
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
  textContainer: {
    flexDirection: 'row',
    marginTop: 2,
  }, 
  textBlack: {
    fontSize: 10,
    marginLeft: 4,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 10,
    marginLeft: 4,        
  },
  textNote: {
    fontSize: 8,
    marginLeft: -12,
  },  
  error: { 
    size:'large', 
    alignitems: 'center', 
    alignself: 'center', 
    maxWidth: 150,  
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
  },
});

