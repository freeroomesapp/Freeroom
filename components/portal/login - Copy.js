import { AuthenticationContext } from '../../context/menu-provider';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { View, ScrollView, StyleSheet, Text, Switch, Image  } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { UserSkeleton } from '../../components/user-skeleton';  

import { dns } from '../../hooks/utils/data';  

import { Button, TextInput } from 'react-native-paper';

import { hotels } from '../../hooks/utils/data';  

export const Login = () => {

  const logo = require("../../assets/favico.png")

  const [isLoading, setLoading] = useState(false);
  const [isLoadingLogin, setLoadingLogin] = useState(false);
  const [isLoadingSignup, setLoadingSignup] = useState(false);
  const [isLogin, setLogin] = useState(false);    
  const [isLogout, setLogout] = useState(false);
  const [isRegister, setRegister] = useState(false);  
  const [isUpdate, setUpdate] = useState(false);  
  //
  const [tokenUser, setTokenUser] = useState('');
  const [idUser, setIdUser] = useState('');
  const [name, setName] = useState(''); 
  const [userName, setUserName] = useState(''); 
  const [email, setEmail] = useState('@gmail.com');
  const [password, setPassword] = useState('1234');
  const [saveGDPR, setSaveGDPR] = useState(true); 
  const [errorUser, setErrorUser] = useState('');

  const { user, setSession, userReg, setUserRegister, noRegister, onLogout, users, error, onLogin, onRegister, onUpdate, onRemove } = useContext(AuthenticationContext);

  //userSignup({"email": email, "name": name, "password": password, "userType": "USER", "username": userName})
  const userSignup = (item) => {
    setErrorUser('');
    //Validar datos mínimos
    if (!item.username) { setErrorUser('Entre un nombre de usuario.');  setLoadingSignup(false); return ''; }
    if (!item.email)    { setErrorUser('Entre su email.');              setLoadingSignup(false); return ''; }
    if (!item.password) { setErrorUser('Entre su password.');           setLoadingSignup(false); return ''; }
    if (!saveGDPR) { setErrorUser('Acepte nuestras políiticas de privacidad - GDPR.'); setLoadingSignup(false); return ''; }
    //
    const params = {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    };    
    fetch(dns + '/free-room/v1/autentication/register', params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) {
                setErrorUser(statuscode + ' No Signup. Problemas de conexión.');
              } else {//Lo pongo aqui porque el json trae un error
                let str = "true"; if (!saveGDPR) str = "false";
                setUserRegister({"name": item.name, "username": item.username, "email": item.email, "password": item.password, "gdpr": str, "userType": item.userType});
                setErrorUser('Signup success!');      
                return response.json();
              }
          }) 
      .then(json => {})
      .catch((error) => { if (errorUser==='') setErrorUser(error.toString());})
      .finally(() => setLoadingSignup(false));
  }

  //userLogin({"usernameOrEmail": userName, "password": password})
  const userLogin = (item) => {
    setErrorUser('');
    //Validar datos mínimos
    if (!item.usernameOrEmail) { 
      setErrorUser('Entry user name.'); setLoadingLogin(false); return ''; 
    }
    if (!item.password) { setErrorUser('Entry password.');  setLoadingLogin(false); return ''; }
    //
    const params = {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    };
    fetch(dns + '/free-room/v1/autentication/login', params)
      .then((response) => {
              const statuscode = response.status;
              if (statuscode!==200) {
                if (statuscode===401) setErrorUser('Credenciales inválidas. Intente nuevamente.');
                else setErrorUser(statuscode + ' Problemas de conexión.');
              } else return response.json();
          }) 
      .then(json => {
        if (json && json.tipoDeToken) {
          setErrorUser('Login exitoso!');
          let str = "true"; if (!saveGDPR) str = "false";
          setTokenUser(json.tipoDeToken); setIdUser(json.userId);
          setSession({"id": json.userId, "name": name, "email": email, 
            "password": password, "gdpr": str, "userType": "USER", "username": userName, "token": json.tipoDeToken});
          noRegister();              
        }
      }) 
      .catch((error) => { if (errorUser==='') setErrorUser('Error de conexión: posible problema con el firewall.');})
      .finally(() => setLoadingLogin(false));
  }

  const [action, setAction] = useState('Register'); 
  const [hotel, setHotel] = useState([]);

  getHotel = () => {
      setHotel(hotels.find((item) => item.id === 1));
  }

  useEffect(() => {
    setLoading(true);
    getSession();
    setTimeout(() => {   
      setLoading(false); 
    }, 100); 
  }, []);

  const getSession = () =>{
    if (user.gdpr=="true" || user.gdpr===true) setSaveGDPR(true); else setSaveGDPR(false);    
    if (user.email==="") {      
      //setIdUser((users.length+1).toString());      
      setIdUser('');
      setTokenUser('')
      setLogin(true);
      setLogout(false);
      setRegister(false);
      setUpdate(false);
      setAction("Register");
    } else {      
      setIdUser(user.id);
      setTokenUser(user.token)
      setName(user.name);
      setUserName(user.username);
      setEmail(user.email);
      setPassword(user.password);
      //
      setLogin(false);
      setLogout(true);
      setRegister(false);
      setUpdate(false);
      setAction("Update");
    }
  }
  useEffect(() => {
    getSession();
  }, [user]);

  const getRegister = () =>{    
    if (user.email==="" && userReg.email!=="") {//Se acaba de registrar=>Mostrar Login
      setIdUser('');
      setTokenUser('');
      if (userReg.gdpr=="true" || userReg.gdpr===true) setSaveGDPR(true); else setSaveGDPR(false);    
      setName(userReg.name);
      setUserName(userReg.username);
      setEmail(userReg.email);
      setPassword(userReg.password);
      //
      setLogin(true);
      setLogout(false);
      setRegister(false);
      setUpdate(false);
      setAction("Update");
      setErrorUser('...register....');
    }
  }

  useEffect(() => {
    getRegister();
  }, [user, userReg]);
  return (        
  <View style={style.containerArea}>       
    {isLoading && (
      <UserSkeleton /> 
    )}
    {!isLoading && (
      <ScrollView style={{marginLeft: 10, height:'100%'}} 
        keyboardShouldPersistTaps="always" 
        scrollEnabled={true}>             
        <View style={style.imageContainer}> 
          <Image source={logo} style={style.image} resizeMode='contain' />       
        </View>  
        <View style={{ marginTop: 6, backgroundcolor: 'rgba(255, 255, 255, 0.5)'}}>
          {(isRegister || isUpdate) && (<TextInput
                label="Name"
                value={name}
                textContentType="name"
                keyboardType="name-phone-pad"
                placeholder="My name"
                placeholderTextColor={"darkgray"}
                autoCapitalize="none"
                onChangeText={(v) => setName(v)}
                style={style.input}
          />)}
          <TextInput
                label="User name"
                value={userName}
                editable={!isLogout}
                textContentType="none"
                keyboardType="default"
                style={style.input}
                placeholderTextColor={"darkgray"}
                placeholder={''}                
                onChangeText={(v) => setUserName(v)}   
          />              
          {(isRegister || isUpdate) && (<TextInput
              label="E-mail"
              value={email}
              editable={!isLogout}
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(userEmail) => setEmail(userEmail)}
              style={style.input}
          />)}
          <View style={{ position: 'top', size: 'large', marginTop: 6}}>
            <TextInput
                label="Password"
                value={password}
                editable={!isLogout}
                textContentType="password"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(userPass) => setPassword(userPass)}
                style={style.input}
            />
          </View>
          {(isRegister || isUpdate) && (<View style={style.row}>
            <Switch
              onValueChange={(value) => {if (!isLogout) setSaveGDPR(value)}}
              value={saveGDPR}
            />
            <Text style={style.text}>Accept GDPR politics</Text>
          </View>)}           
          {errorUser && (<View style={style.error}>          
              <Text>{errorUser}</Text>
            </View>
          )}
        </View>
        <View style={style.rowButtoms}>             
          {isLogin && (
            <View style={{ position: 'top', marginTop: 6}}>
              <Button style={style.button}
                  loading={isLoadingLogin}
                  icon="lock"
                  mode="contained"
                  onPress={() => {
                    setLoadingLogin(true);
                    userLogin({"usernameOrEmail": userName, "password": password});}
                  }
              >Login</Button>
              <Text style={style.registerTextStyle}
                  onPress={() => {setErrorUser('');  setRegister(true);setLogin(false);}}>
                Nuevo por aqui ? Registrese
              </Text>
            </View>            
          )}
          {isLogout && (
            <View style={{ position: 'top', marginTop: 6}}>
              <Button  style={style.button}
                icon="lock-open-variant"
                mode="contained"
                onPress={() => onLogout()}
              >Logout</Button>
              <Text style={style.registerTextStyle}
                  onPress={() => {setErrorUser(''); setUpdate(true);setLogout(false);}}>
               Desea actualizar sus datos?
             </Text>
            </View>
          )}
          {isRegister && (
            <View style={{ flexDirection: 'row', marginLeft: 8 }}>
              <Button  style={style.button}
                loading={isLoadingSignup}
                mode="contained"
                onPress={() => {
                  setLoadingSignup(true); 
                  userSignup({"email": email, "name": name, "password": password, 
                              "userType": "USER", "username": userName});
                }}
              >Signup</Button>
              <Button  style={style.button}
                mode="elevated"
                onPress={() => {setRegister(false);setLogin(true);}}>
              Cancel</Button>
            </View>
          )}
          {isUpdate && (
            <View style={{ flexDirection: 'row', marginLeft: 8 }}>
              <Button style={style.button} 
                mode="contained"
                onPress={() => onUpdate({"name": name, "email": email, "password": password})}
              >Update</Button>
              <Button style={style.button}
                mode="contained"
                onPress={() => onRemove({"email": email})}
              >Delete</Button>
            </View>
          )}
          {isUpdate && (
            <View style={{ flexDirection: 'row', size: 'medium', marginLeft: 8 }}>              
              <Button  style={style.button}
                mode="elevated"
                onPress={() => {setUpdate(false);setLogout(true);}}>
              Cancel</Button>
            </View>
          )}
        </View>
      </ScrollView>
      )}
  </View> 
  );
};
const colors = {
  blurple: '#635BFF',
  blurple_dark: '#5851DF',
  white: '#FFFFFF',
  light_gray: '#F6F9FC',
  dark_gray: '#425466',
  slate: '#0A2540',
};

const style = StyleSheet.create({
  containerArea: {
    height:'100%',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  imageContainer : {
    alignItems : "center",
    alignself: 'center',
  },
  image : {
    height : 120,
    width : 130
  },
  extraContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  rowButtoms: {
    marginTop: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    alignself: 'center',
  },
  button: {
    margin: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    fontSize: 12,
    marginTop: 10,
    height: 50,
    borderBottomColor: colors.slate, 
    borderBottomWidth: 1.5,
  },  
  inputRow: {
    flex: 1,
    fontSize: 12,
    marginLeft: 5,
    height: 50,
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
  registerTextStyle: {
    color: colors.blurple, 
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    alignSelf: 'center',
    padding: 10,
  },
});