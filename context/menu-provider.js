import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import { useVisible } from '../hooks/visible/use-visible';
import {MenuContext, FavorContext, AuthenticationContext} from './contexts';
import { dns, user } from '../hooks/utils/data';  
import AsyncStorage from "@react-native-async-storage/async-storage";

const MenuContextProvider = ({ children }) => {
  const {
    handleHideAll,
    deleteDialogVisible,
    feedbackDialogVisible,
    handleHide,
    handleShow,
    joinPortalDialogVisible,
  } = useVisible();

  const value = useMemo(
    () => ({
      deleteDialogVisible,
      feedbackDialogVisible,
      handleHide,
      handleHideAll,
      handleShow,
      joinPortalDialogVisible,
    }),
    [
      handleHideAll,
      deleteDialogVisible,
      feedbackDialogVisible,
      handleHide,
      handleShow,
      joinPortalDialogVisible,
    ]
  );
  
  return <MenuContext.Provider 
    value={ value }>
    {children}  
  </MenuContext.Provider>;
};

MenuContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const FavorContextProvider = ({ children }) => {

  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState([]);

  const saveFavourites = async (value) => {
    try {
      let jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("favourites", jsonValue);
      if (jsonValue !== null) setFavourites(value); 
      else setFavourites([]);
      console.log('Saving Favourites Hotels', jsonValue.length);
    } catch (err) {
      //setError('Error saving favourites session');
      console.log('error saving favourites session', err);
    }
  };

  const loadFavourites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("favourites");
      if (jsonValue!==null) {
        setFavourites(JSON.parse(jsonValue));
        console.log('Loading Favourites Hotels', JSON.parse(jsonValue).length);
      } else {
        setFavourites([]);
        console.log('Loading Empty Favourites Hotels');
      }
    } catch (err) {
      //setError('Error loading favourites session');
      console.log('error loading favourites session', err);
    }
  };

  const add = (hotel) => {
    if (find(hotel)===true) {
       console.log('Hotel ya está en la lista de favoritos.');
       return '';
    } 
    saveFavourites([...favourites, hotel]);
  };

  const remove = (hotel) => {
    if (find(hotel)===false) {
       console.log('Hotel no encontrado.');
       return '';
    }  
    const newFavourites = favourites.filter(
      (item) => item.id !== hotel.id
    );
    saveFavourites(newFavourites);
  }; 

  const find = (hotel) => {
    if (favourites.length<1) return false;
    const newFavourite = favourites.find(
      (item) => item.id === hotel.id
    );
    return (newFavourite!== undefined && newFavourite!==null) ? true : false;
  };
  const getItem = (hotel) => {
    const newFavourite = favourites.find(
      (item) => item.id === hotel.id
    );
    return newFavourite!== undefined ? hotel.id : 'None';
  };
  
  useEffect(() => {
    loadFavourites();
  }, []);

  //Quien envia la peticion del screen, y quien recibe la solicitud. 
  //P.e:  
  //{"send": "ScreenA", "receive": "JoinTeamPortal"}
  //{"send": "ScreenC", "receive": "JoinTeamPortal"}
  //{"send": "Users",   "receive": "JoinTeamPortal"}
  const [screens, setScreens] = useState({"send": "", "receive": ""}); 

  const saveScreens = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);      
      await AsyncStorage.setItem("screens", jsonValue);
      console.log('Saving screens', jsonValue);
    } catch (err) {
      console.log('Error saving screens', err);
    }
  };

  const loadScreens = async () => {
    try {
      const jsonSession = await AsyncStorage.getItem("screens");
      if (jsonSession!==null && JSON.parse(jsonSession).send!=="") console.log('Loading screens', JSON.parse(jsonSession));
      return jsonSession!==null? setScreens(JSON.parse(jsonSession)): 
      setScreens({"send": "", "receive": ""});      
    } catch (err) {
      console.log('error loading screens', err);
    }
  };

  const addScreens = (item) => {
    setScreens(item);
    saveScreens(item);
  };

  const removeScreens = () => {
    setScreens({"send": "", "receive": ""});  
    saveScreens({"send": "", "receive": ""});  
  };

  useEffect(() => { 
    loadScreens();
  }, []);

  return <FavorContext.Provider 
    value={{ error, favourites, loadFavourites, findFavourite: find, getFavourite: getItem, addToFavourites: add, removeFromFavourites: remove, screens, addScreens, removeScreens }}>
    {children}  
  </FavorContext.Provider>;
};

FavorContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const AuthenticationContextProvider = ({ children }) => {

  const [status, setStatus] = useState('error');
  const [error, setError] = useState('');
  const [errorUser, setErrorUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLogin, setLoadingLogin] = useState(false);
  const [isLoadingSignup, setLoadingSignup] = useState(false);
  const [isLoadingUpdate, setLoadingUpdate] = useState(false);
  const [isLoadingDelete, setLoadingDelete] = useState(false);

  const [users, setUsers] = useState([]);     
  const [userEmpty, setUserEmpty] = useState(
        {"id": "", "token": "", 
         "name": "", "username": "", "email": "", "password": "", "userType": "USER", 
         "comm": "false", "gdpr": "false", "term": "false",  
         "phone": "", "addres": "", "cardnumber": ""});   
  const [user, setUser] = useState(userEmpty);   
  //
  const [regEmpty, setRegEmpty] = useState(
        {"name": "", "username": "", "email": "", "password": "", "userType": "USER", 
         "comm": "false", "gdpr": "false", "term": "false", 
         "phone": "", "addres": "", "cardnumber": ""});   
  const [userReg, setUserReg] = useState(regEmpty);
  const [userData, setUserData] = useState(regEmpty);
  //  
  const [hasReservas, setHasReservas] = useState(false);

  const saveUsers = async (value) => {
    setIsLoading(true);
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`@users-1`, jsonValue);
      setIsLoading(false);
    } catch (err) {
      console.log('Error saving users session', err);
      setIsLoading(false);
      //setError('Error saving users session'); //setError(err.toString());
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const jsonValue = await AsyncStorage.getItem(`@users-1`);
      setIsLoading(false);
      return jsonValue !== null ? setUsers(JSON.parse(jsonValue)) : null;
    } catch (err) {
      console.log('error loading users session', err);
      setIsLoading(false);
      //setError('Error loading users session');
    }
  };

const saveUserReg = async (value) => {
    setIsLoading(true);
    try {
      const jsonValue = JSON.stringify(value);      
      await AsyncStorage.setItem("register", jsonValue);
      console.log('Saving user register');
      setIsLoading(false);
    } catch (err) {
      console.log('Error saving user register', err);
      setIsLoading(false);
    }
  };

  const loadUserReg = async () => {
    setIsLoading(true);
    try {
      const jsonSession = await AsyncStorage.getItem("register");
      setIsLoading(false);
      if (jsonSession!==null && JSON.parse(jsonSession).username!=="") console.log('Loading user register', JSON.parse(jsonSession).username);
      return jsonSession!==null? setUserReg(JSON.parse(jsonSession)): 
      setUserReg(regEmpty);      
    } catch (err) {
      console.log('error loading user register', err);
      setIsLoading(false);
    }
  };
    
  const saveUserData = async (value) => {
    setIsLoading(true);
    try {
      const jsonValue = JSON.stringify(value);      
      await AsyncStorage.setItem("userdata", jsonValue);
      console.log('Saving user data');
      setIsLoading(false);
    } catch (err) {
      console.log('Error saving user data', err);
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const jsonSession = await AsyncStorage.getItem("userdata");
      setIsLoading(false);
      if (jsonSession!==null && JSON.parse(jsonSession).username!=="") console.log('Loading user data', JSON.parse(jsonSession).username);
      return jsonSession!==null? setUserData(JSON.parse(jsonSession)): 
      setUserData(regEmpty);      
    } catch (err) {
      console.log('error loading user data', err);
      setIsLoading(false);
    }
  };
 const saveUser = async (value) => {
    setIsLoading(true);
    try {
      const jsonValue = JSON.stringify(value);      
      await AsyncStorage.setItem("session", jsonValue);
      console.log('Saving user session');
      setIsLoading(false);
    } catch (err) {
      console.log('Error saving user session', err);
      setIsLoading(false);
    }
  };

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const jsonSession = await AsyncStorage.getItem("session");
      setIsLoading(false);
      if (jsonSession!==null && JSON.parse(jsonSession).username!=="") console.log('Loading user session', JSON.parse(jsonSession).username);
      return jsonSession!==null? setUser(JSON.parse(jsonSession)): 
      setUser(userEmpty);      
    } catch (err) {
      console.log('error loading user session', err);
      setIsLoading(false);
    }
  };

  const hasReservations = () => {      
    if (user.id!=="" && user.token!=="") { 
        const params = {
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
        };
        fetch(dns + '/free-room/v1/reservation/' + user.id, params)
          .then((response) => {
            const statuscode = response.status;
            if (statuscode!==200) {
              setHasReservas(false);
              console.log('Error del GET en v1/reservation/: ', statuscode);
            } else return response.json();
          })
          .then((json) => { 
            if (json.data && json.data.length>0 ) setHasReservas(true);  
            else setHasReservas(false);
          })
          .catch((error) => {
            setHasReservas(false);
            console.log('Error del GET en v1/reservation/: ',error);
          });
    } else setHasReservas(false);
  }

//userSignup({"email": email, "name": name, "password": password, "userType": "USER", "username": userName})
  const userSignup = ( item ) => {
    let str = "";     
    setErrorUser('');
    //Validar datos mínimos
    if (!item.username) { setErrorUser('Entre un nombre de usuario o email');  setLoadingSignup(false); return ''; }
    if (!item.email)    { setErrorUser('Entre su email.');              setLoadingSignup(false); return ''; }
    if (!item.password) { setErrorUser('Entre su password.');           setLoadingSignup(false); return ''; }    
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
            //let str = "true"; if (!saveGDPR) str = "false";            
            str = "Ok";
            addUserReg({"name": item.name, "username": item.username, "email": item.email, 
                        "password": item.password, "userType": item.userType, 
                        "comm": item.acceptCommunications, "gdpr": item.acceptPrivacyPolicy, 
                        "term": item.acceptTermsAndConditions});
            setErrorUser('Registro exitoso!');                  
            //return str; //response.json();
        }
      }) 
      .finally(() => setLoadingSignup(false));
    //
    return str;
  }

  const userSigLogin = (item) => {
      let str = userSignup(item);
      setError('str: ' + str); 
      if (str==='Ok') { //if (userReg.username !=='') {
        setError('paso por aqui');         
        userLogin({"usernameOrEmail": item.email, "password": item.password});
      }
      return str;
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
        if (json && json.tokenDeAcceso) {
          setErrorUser('Login exitoso!!!');
          if (userReg.username!=='') {
            addSession({"id": json.userId, "token": json.tokenDeAcceso, 
              "username": userReg.username, "userType": json.usertype,                
              "name": userReg.name, "email": userReg.email, "password": item.password, 
              "comm": userReg.comm, "gdpr": userReg.gdpr, "term": userReg.term, 
              "phone": "", "addres": "", "cardnumber": ""});
            removeReg(); 
          } else {
            addSession({"id": json.userId, "token": json.tokenDeAcceso, 
              "username": item.usernameOrEmail, "userType": json.usertype, 
              "name": "", "email": "",  "password": item.password, 
              "comm": "true", "gdpr": "true", "term": "true", 
              "phone": "", "addres": "", "cardnumber": ""});
          } 
          //hasReservations();           
        }
      }) 
      .catch((error) => { if (errorUser==='') setErrorUser('Error de conexión: posible problema con el firewall.');})
      .finally(() => setLoadingLogin(false));
  }

  const getUser  = () => {
    let str = "";     
    setErrorUser('');    
    if (user.id!=="" && user.token!=="") {           
      const params = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'}
      };    
      fetch(dns + '/free-room/v1/user/' + user.id, params)
        .then((response) => {
          const statuscode = response.status;
          if (statuscode!==200) {
              setErrorUser(statuscode + ' Problemas de conexión.');
              console.log('Error del GET en v1/user/: ', statuscode);
          } else return response.json();
        }) 
        .then(json => {
          if (json) {
            str = "Ok";
            let roles = json.roles; 
            let userType = "USER"; let len = roles.length;
            if (len===1 && roles[0].nombre!=="USER") userType = roles[0].nombre;
            else if (len===2 && roles[1].nombre!=="USER") userType = roles[1].nombre;
            if (userType==="USER") setErrorUser('Usuario exitoso!'); 
            else setErrorUser('Usuario '+userType+' exitoso!');
            addUserData({"username": json.userName, "name": json.surname, "email": json.email, 
            "comm": "true", "gdpr": "true", "term": "true",  "userType": userType,  
            "phone": json.phone, "addres": json.addres, "cardnumber": json.cardNumber});
            console.log('Get User: ', json.userName); 
          }
        }) 
        .catch((error) => { 
          console.log('Error del GET en v1/user/: ', error);
          if (errorUser==='') setErrorUser('Error de conexión: posible problema con firewall.');
        })
        .finally(() => setLoadingLogin(false));
    }
    //
    return str;
  }

  const updateCard  = ( item ) => {
    let str = "";     
    setErrorUser('');
    if (user.id!=="" && user.token!=="") {       
      const params = {
        method: 'PUT',
        headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
        body: JSON.stringify(item)
      };    
      fetch(dns + '/free-room/v1/user/' + user.id, params)
        .then((response) => {
          const statuscode = response.status;
          if (statuscode!==200) {
            console.log('Tarjeta no actualizada. Problemas de conexión.', statuscode);
            setErrorUser(statuscode + ' Tarjeta no actualizada. Problemas de conexión.');
          } else {//Lo pongo aqui porque el json trae un error
            str = "Ok";
            addUserData({...userData, "cardnumber": item.cardnumber});
            setErrorUser('Actualización Tarjeta exitosa!');
          }
        }) 
        .catch((error) => { 
          console.log('Error durante la actualización de los datos del usuario', error);
        })
        .finally(() => setLoadingUpdate(false));
    }
    //
    return str;
  }
  
  const update  = ( item ) => {
    let str = "";     
    setErrorUser('');
    if (user.id!=="" && user.token!=="") {       
      //Validar datos mínimos
      if (!item.userName) { 
        setErrorUser('Entre un nombre de usuario.');  setLoadingUpdate(false); return ''; 
      }
      if (!item.email)    { 
        setErrorUser('Entre su email.');              setLoadingUpdate(false); return ''; 
      }
      //
      const params = {
        method: 'PUT',
        headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'},
        body: JSON.stringify(item)
      };    
      fetch(dns + '/free-room/v1/user/' + user.id, params)
        .then((response) => {
          const statuscode = response.status;
          if (statuscode!==200) {
            console.log('Datos del Usuario no actualizado. Problemas de conexión.', statuscode);
            setErrorUser(statuscode + ' Usuario no actualizado. Problemas de conexión.');
          } else {//Lo pongo aqui porque el json trae un error
            str = "Ok";
            addUserData({...userData, "username": item.username,
              "name": item.surname, "email": item.email, 
              "phone": item.phone, "addres": item.addres});
            setErrorUser('Actualización exitosa!');                  
            //return str; //response.json();
          }
        }) 
        .catch((error) => { 
          console.log('Error durante la actualización de los datos del usuario', error);
        })
        .finally(() => setLoadingUpdate(false));
    }
    //
    return str;
  }
  //Eliminacion del Usuario de la Base de datos.
  const remove  = () => {
    let str = "";     
    setErrorUser('');
    if (user.id!=="" && user.token!=="") {       
      const params = {
        method: 'DELETE',
        headers: {'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json'}
      };    
      fetch(dns + '/free-room/v1/user/' + user.id, params)
        .then((response) => {
          const statuscode = response.status;
          if (statuscode!==200) {
            console.log('Usuario no eliminado. Problemas de conexión.', statuscode);
            setErrorUser(statuscode + ' Usuario no eliminado. Problemas de conexión.');
          } else {
            str = "Ok";            
            noSession();
            setErrorUser('Eliminación exitosa!');                  
          }
        }) 
        .catch((error) => { 
          console.log('Error durante la eliminación del usuario', error);
        })
        .finally(() => setLoadingDelete(false));
    }
    //
    return str;
  }

  const remove_ant = (item) => {
    setStatus('error');
    const newUsers = users.filter(
      (rec) => rec.email !== item.email
    );
    if (newUsers===undefined || newUsers.length<1) {setError('No email exist.'); return '';}
    //
    setUser({"id": "", "token": "", "name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});
    setUsers(newUsers);
    saveUsers(users);  
    setError('User remove correcty'); 
    setStatus('success');
    return "Ok";
  };

  const find = (item) => {
    const newFavourite = users.find(
      (it) => it.email === item.email
    );
    return newFavourite!== undefined ? true : false;
  };

  const add = (item) => {
    setStatus('error');
    if (!item.name)    { setError('Entry name.');    return ''; }
    if (!item.email)    { setError('Entry email.');    return ''; }
    if (!item.password) { setError('Entry password.'); return ''; }
    if (!item.repeatedPassword) { setError('Entry repeated password.'); return ''; }
    if (item.password !== item.repeatedPassword) { 
       setError('Error: Passwords do not match'); 
       return ''; 
    }   
    if (!item.gdpr || item.gdpr==false) { setError('Accept GDPR politics.'); return ''; }
    //
    if (find(item)) { setError('User exist.'); return ''; }
    //
    setIsLoading(true);
    setUser(item);
    setUsers([...users, item]);            
    saveUsers(users);        
    setIsLoading(false); 
    setError('User Signup.');        
    setStatus('success');
    return "Ok";
  };

  const update_ant = (item) => { 
    setStatus('error');
    if (!item.name)    { setError('Entry name.');    return ''; }
    if (!item.email)    { setError('Entry email.');    return ''; }
    if (!item.password) { setError('Entry password.'); return ''; }
    if (users.length<1) {
      setError('No user register.');
      return '';
    }
    setError('');
    let usersUpdate = users;
    const ind = usersUpdate.findIndex(el => el.email === item.email);
    if (ind<0)    { setError('No email exist.'); return '';}
    setIsLoading(true);
    usersUpdate[ind] = {...usersUpdate[ind], "name": item.name, "password": item.password}
    setUsers(usersUpdate);
    saveUsers(users);
    setUser({...user, "name": item.name, "password": item.password});
    setIsLoading(false);
    setError('User updated correcty');
    setStatus('success');
    return "Ok";
  }

  const getItem = (item) => {
    setStatus('error');
    if (!item.email)    { setError('Entry email.');    return ''; }
    if (!item.password) { setError('Entry password.'); return ''; }
    if (users.length<1) {
      setError('No user register.');
      return '';
    }
    setError('');
    const pap = users.filter(
      (rec) => rec.email === item.email
    );

    if (pap===undefined) { setError('No email exist.'); return '';}
    if (pap.length<1)    { setError('No email exist.'); return '';}
    
    const newuser = pap.find(
      (itp) => itp.password === item.password
    );
    
    if (newuser===undefined) { setError('Password invalid.'); return '';}
    if (newuser.length<1)    { setError('Password invalid.'); return '';}    
    setUser(newuser); 
    setError('User Authenticated.');
    setStatus('success');
    return '';
  };

  const addSession = (item) => {
    setUser(item);
    saveUser(item);
    setError('User Session.');   
    setStatus('success');
    console.log('Add session', item.username);
    return "Ok";
  };

  const noSession = () => {
    removeUserData();
    setUser(userEmpty);  
    saveUser(userEmpty); 
    //
    setError('User logout.');   
    setStatus('success');
  };  

  const addUserReg = (item) => {
    setUserReg(item);
    saveUserReg(item);
    setError('User Register.');   
    setStatus('success');
    return "Ok";
  };

  const removeReg = () => {
    setUserReg(regEmpty);  
    saveUserReg(regEmpty);  
  };

  const addUserData = (item) => {
    setUserData(item);
    saveUserData(item);
    setError('User Data.');   
    setStatus('success');
    return "Ok";
  };
  
  const removeUserData = () => {
    setUserData(regEmpty);  
    saveUserData(regEmpty);  
  };

  useEffect(() => { 
    //loadUsers();
    loadUser();
    loadUserReg();
    loadUserData();
  }, []);

  useEffect(() => { 
    //saveUsers(users);
    //saveUser(user);
    //saveUserReg(userReg)
  });
  //Antes: onLogin: getItem, onRegister: add, 
  //console.log('Auth: ');
  //console.log(AuthenticationContext === undefined);
  return <AuthenticationContext.Provider 
    value={{ user, loadUser, setSession: addSession, userReg, setUserRegister: addUserReg, noRegister: removeReg, userData, onLogout: noSession, users, status, 
    error, errorUser, setErrorUser, 
    isLoading, isLoadingLogin, setLoadingLogin, isLoadingSignup, setLoadingSignup,  
    onLogin: userLogin, onRegister: userSignup, onSigLogin: userSigLogin, getUser, onUpdate: update, onRemove: remove, updateCard, hasReservas, getReservations:hasReservations }}>
    {children}  
  </AuthenticationContext.Provider>;
};

AuthenticationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {MenuContext, FavorContext, AuthenticationContext, MenuContextProvider, FavorContextProvider, AuthenticationContextProvider};
