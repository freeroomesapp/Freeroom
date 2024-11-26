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
  //console.log(MenuContext === undefined);
  return <MenuContext.Provider 
    value={value}>
    {children}  
  </MenuContext.Provider>;
};

MenuContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const FavorContextProvider = ({ children }) => {

  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [favourite, setFavourite] = useState([]);

  const saveFavourites = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("favourites", jsonValue);
      console.log('Saving Favourites Hotels');
    } catch (err) {
      //setError('Error saving favourites session');
      console.log('error saving favourites session', err);
    }
  };

  const loadFavourites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("favourites");
      if (jsonValue!==null) console.log('Loading Favourites Hotels', JSON.parse(jsonValue).length);
      return jsonValue !== null ? setFavourites(JSON.parse(jsonValue)) : null;
    } catch (err) {
      //setError('Error loading favourites session');
      console.log('error loading favourites session', err);
    }
  };

  const add = (hotel) => {
    setFavourites([...favourites, hotel]);
    saveFavourites(favourites);
  };

  const remove = (hotel) => {
    const newFavourites = favourites.filter(
      (x) => x.id !== hotel.id
    );

    setFavourites(newFavourites);
    saveFavourites(favourites);
  };

//
  const find = (hotel) => {
    const newFavourite = favourites.find(
      (item) => item.id === hotel.id
    );
    //setFavourite(newFavourite);
    return newFavourite!== undefined ? true : false;
  };
  const getItem = (hotel) => {
    const newFavourite = favourites.find(
      (item) => item.id === hotel.id
    );
    //setFavourite(newFavourite);
    return newFavourite!== undefined ? hotel.id : 'None';
  };

  useEffect(() => {
    //if (user.length>0) {
    //  loadFavourites(user[0].uid);
    //}
    loadFavourites();
  }, []);

  //useEffect(() => {
  //  if (user.length>0) {
  //    saveFavourites(favourites, user[0].uid);
  //  }
  //}, [favourites]);

  return <FavorContext.Provider 
    value={{ error, favourites, loadFavourites, favourite, findFavourite: find, getFavourite: getItem, addToFavourites: add, removeFromFavourites: remove }}>
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

  const [users, setUsers] = useState([]);     
  const [user, setUser] = useState(
        {"id": "", "token": "", "name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});   
  const [userReg, setUserReg] = useState(
        {"name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});   
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
      setUserReg({"name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});      
    } catch (err) {
      console.log('error loading user register', err);
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
      setUser({"id": "", "token": "", "name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});      
    } catch (err) {
      console.log('error loading user session', err);
      setIsLoading(false);
    }
  };

//userSignup({"email": email, "name": name, "password": password, "userType": "USER", "username": userName})
  const userSignup = ( item ) => {
    let str = "";     
    setErrorUser('');
    //Validar datos mínimos
    if (!item.username) { setErrorUser('Entre un nombre de usuario.');  setLoadingSignup(false); return ''; }
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
            addUserReg({"name": item.name, "username": item.username, "email": item.email, "password": item.password, "gdpr": "true", "userType": item.userType});
            setErrorUser('Registro exitoso!');      
            str = "Ok";
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
      if (userReg.username !=='') {
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
              "name": userReg.name, "email": userReg.email, "password": item.password, "gdpr": "true"});
          } else {
            addSession({"id": json.userId, "token": json.tokenDeAcceso, 
              "username": item.usernameOrEmail, "userType": json.usertype, 
              "name": "", "email": "",  "password": item.password, "gdpr": "true"});
          } 
          removeReg(); //Antes: noRegister();              
        }
      }) 
      .catch((error) => { if (errorUser==='') setErrorUser('Error de conexión: posible problema con el firewall.');})
      .finally(() => setLoadingLogin(false));
  }

  const remove = (item) => {
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

  const update = (item) => { 
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
    setUser ({"id": "", "token": "", "name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});  
    saveUser({"id": "", "token": "", "name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});
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
    setUserReg({"name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});  
    saveUserReg({"name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});  
  };

  useEffect(() => { 
    //loadUsers();
    loadUser();
    loadUserReg();
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
    value={{ user, loadUser, setSession: addSession, userReg, setUserRegister: addUserReg, noRegister: removeReg, onLogout: noSession, users, status, 
    error, errorUser, setErrorUser, 
    isLoading, isLoadingLogin, setLoadingLogin, isLoadingSignup, setLoadingSignup,  
    onLogin: userLogin, onRegister: userSignup, onSigLogin: userSigLogin, onUpdate: update, onRemove: remove }}>
    {children}  
  </AuthenticationContext.Provider>;
};

AuthenticationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {MenuContext, FavorContext, AuthenticationContext, MenuContextProvider, FavorContextProvider, AuthenticationContextProvider};