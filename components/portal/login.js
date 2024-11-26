import { AuthenticationContext } from '../../context/menu-provider';
import { useEffect, useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Text, Switch, Image, Linking, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { UserSkeleton } from '../../components/user-skeleton';
import { urlGDPR } from '../../hooks/utils/data'; 
import { Cardstyles } from '../../assets/styles';    
import { Button, TextInput } from 'react-native-paper';

export const Login = () => {

  let screenWidth = Dimensions.get("window").width;
  let screenW = 5;
  if (Platform.OS==='web') {
      screenW = (screenWidth / 2) - 190; 
  }
  const { textHelp, textHelpSw, url } = Cardstyles();

  const [show, setShow] = useState(false); //Esto es eventual.
  //
  const logo = require("../../assets/favico.png")
  const [isLoading, setLoading] = useState(false);  
  const [isLogin, setLogin] = useState(false);    
  const [isLogout, setLogout] = useState(false);
  const [isRegister, setRegister] = useState(false);  
  const [isUpdate, setUpdate] = useState(false);  
  //
  const [name, setName] = useState(''); 
  const [addres, setAddres] = useState(''); 
  const [phone, setPhone] = useState(''); 
  const [userName, setUserName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveComm, setSaveComm] = useState(false); 
  const [saveGDPR, setSaveGDPR] = useState(false); 
  const [saveTerm, setSaveTerm] = useState(false); 

  const { user, userReg, onLogout, errorUser, setErrorUser, isLoadingLogin, 
          setLoadingLogin, isLoadingSignup, setLoadingSignup, onLogin, 
          onRegister, userData, getUser, onUpdate, onRemove } = useContext(AuthenticationContext);

  useEffect(() => {
    setLoading(true);
    getSession();
    setTimeout(() => {   
      setLoading(false); 
    }, 100); 
  }, []);

  const getSession = () =>{
    if (user.comm=="true" || user.comm===true) setSaveComm(true); else setSaveComm(false);
    if (user.gdpr=="true" || user.gdpr===true) setSaveGDPR(true); else setSaveGDPR(false);
    if (user.term=="true" || user.term===true) setSaveTerm(true); else setSaveTerm(false);
    if (user.token==="") {  
      setLogin(true);
      setLogout(false);
      setRegister(false);
      setUpdate(false);
    } else {       
      setUserName(user.username);
      setPassword(user.password);
      //setName(user.name);
      //setEmail(user.email);
      //setAddres(user.addres);
      //setPhone(user.phone);
      //
      setLogin(false);
      setLogout(true);
      setRegister(false);
      setUpdate(false);
    }
  }
  useEffect(() => {
    getSession();
  }, [user]);

  useEffect(() => {
    if (isLogout) { 
      getUser(); 
    }
      setName(userData.name);
      setEmail(userData.email);
      setAddres(userData.addres);
      setPhone(userData.phone);
  }, [isLogout]);

  const getRegister = () =>{    
    if (user.token==="" && userReg.username!=="") {//Se acaba de registrar=>Mostrar Login
      if (userReg.comm=="true" || userReg.comm===true) setSaveComm(true); else setSaveComm(false);
      if (userReg.gdpr=="true" || userReg.gdpr===true) setSaveGDPR(true); else setSaveGDPR(false); 
      if (userReg.term=="true" || userReg.term===true) setSaveTerm(true); else setSaveTerm(false);   
      setName(userReg.name);
      setUserName(userReg.username);
      setEmail(userReg.email);
      setPassword(userReg.password);
      //
      setLogin(true);
      setLogout(false);
      setRegister(false);
      setUpdate(false);
    }
  }

  useEffect(() => {
    getRegister();
  }, [user, userReg]);
  
  useEffect(() => {
    setTimeout(() => {
        setErrorUser('');
      }, 2000); //El mensaje de error será visible por lo menos 2 segundos.
  }, [errorUser]);

  return (        
  <View style={[style.containerArea, Platform.OS==='web'?{maxWidth: 400}:'']}>       
    {isLoading && (
      <UserSkeleton /> 
    )}
    {!isLoading && (
      <ScrollView style={{left: screenW, height:'100%'}} 
        keyboardShouldPersistTaps="always" 
        scrollEnabled={true}>             
        {!(isRegister || isUpdate) && (<View style={style.imageContainer}> 
            <Image source={logo} style={style.image} resizeMode='contain' />       
          </View> 
        )} 
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
          {(isUpdate) && (<TextInput
                label="Addres"
                value={addres}
                textContentType="addres"
                keyboardType="default"
                placeholder="My addres"
                placeholderTextColor={"darkgray"}
                autoCapitalize="none"
                onChangeText={(v) => setAddres(v)}
                style={style.input}
          />)}
          {(isUpdate) && (<TextInput
                label="Phone"
                value={phone}
                textContentType="phone"
                keyboardType="number-pad"
                placeholder="My addres"
                placeholderTextColor={"darkgray"}
                autoCapitalize="none"
                onChangeText={(v) => setPhone(v)}
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
          {!userName && (
            <Text style={textHelp}>Un nombre de usuario es requerido</Text>
          )}
          {(isRegister || isUpdate) && (
            <View>
              <TextInput
                label="E-mail"
                value={email}
                editable={!isLogout}
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(userEmail) => setEmail(userEmail)}
                style={style.input}
              />
              {!email && (<Text style={textHelp}>Email es requerido</Text>)}
            </View>
          )}
          <View style={{ position: 'top', size: 'large', marginTop: isRegister?0:6}}>
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
            {!password && (
            <Text style={textHelp}>Un password es requerido</Text>
          )}
          </View>
          {isRegister && !isLogout && (
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
                    onLogin({"usernameOrEmail": userName, "password": password});                    
                  }}
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
                  onPress={() => {
                    setErrorUser(''); setUpdate(true);setLogout(false);
                  }}>
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
                  if (!saveGDPR) { 
                    setErrorUser('Acepte nuestras políticas de privacidad.'); 
                    setLoadingSignup(false); 
                  } else if (!saveTerm) { 
                    setErrorUser('Acepte nuestros términos y condiciones.'); 
                    setLoadingSignup(false); 
                  } else 
                    onRegister({"email": email, "name": name, "password": password, "userType": "USER", 
                        "username": userName, "acceptCommunications": saveComm, 
                        "acceptPrivacyPolicy": saveGDPR, "acceptTermsAndConditions": saveTerm});
                }}
              >Registrarme</Button>
              <Button  style={style.button}
                mode="contained-tonal"
                onPress={() => {setRegister(false);setLogin(true);}}>
              Regresar</Button>
            </View>
          )}
          {isUpdate && (
            <View style={{ flexDirection: 'row', marginLeft: 8 }}>
              <Button style={style.button} 
                mode="contained"
                onPress={() => {
                  let str = onUpdate({"surname": name, "userName": userName, "email": email, 
                     "addres": addres, "phone": phone});
                  if (str==="Ok") {
                      setUpdate(false);setLogout(true);
                  }
                }}
              >Update</Button>
              <Button style={style.button}
                mode="contained"
                onPress={() => onRemove()}
                >Delete</Button>
            </View>
          )}
          {isUpdate && (
            <View style={{ flexDirection: 'row', size: 'medium', marginLeft: 8 }}>              
              <Button  style={style.button}
                mode="contained-tonal"
                onPress={() => {setUpdate(false);setLogout(true);}}>
              Cancel</Button>
            </View>
          )}
        </View>
        <View><Text> </Text></View>
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
    marginTop: 30,
    marginBottom: 30,
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
    marginBottom: 0, 
  },
  input: {
    fontSize: 12,
    marginTop: 5,
    height: 50,
    borderBottomColor: colors.slate, 
    borderBottomWidth: 1.5,
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