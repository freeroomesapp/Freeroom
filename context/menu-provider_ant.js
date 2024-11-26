import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import { useVisible } from '../hooks/visible/use-visible';
import {MenuContext, FavorContext, AuthenticationContext} from './contexts';
import { user } from '../hooks/utils/data';  

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
  console.log(MenuContext === undefined);
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

  const saveFavourites = async (value, uid) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`@favourites-${uid}`, jsonValue);
    } catch (err) {
      //setError('Error saving favourites session');
      console.log('error saving favourites session', err);
    }
  };

  const loadFavourites = async (uid) => {
    try {
      const jsonValue = await AsyncStorage.getItem(`@favourites-${uid}`);
      return jsonValue !== null ? setFavourites(JSON.parse(jsonValue)) : null;
    } catch (err) {
      //setError('Error loading favourites session');
      console.log('error loading favourites session', err);
    }
  };

  const add = (hotel) => {
    setFavourites([...favourites, hotel]);
  };

  const remove = (hotel) => {
    const newFavourites = favourites.filter(
      (x) => x.id !== hotel.id
    );

    setFavourites(newFavourites);
  };

//
  const find = (hotel) => {
    const newFavourite = favourites.find(
      (item) => item.id === hotel.id
    );
    setFavourite(newFavourite);
    return newFavourite!== undefined ? true : false;
  };
  const getItem = (hotel) => {
    const newFavourite = favourites.find(
      (item) => item.id === hotel.id
    );
    setFavourite(newFavourite);
    return newFavourite!== undefined ? hotel.id : 'None';
  };

  useEffect(() => {
    if (user.length>0) {
      loadFavourites(user[0].uid);
    }
  }, []);

  useEffect(() => {
    if (user.length>0) {
      saveFavourites(favourites, user[0].uid);
    }
  }, [favourites]);

  return <FavorContext.Provider 
    value={{ error, favourites, favourite, findFavourite: find, getFavourite: getItem, addToFavourites: add, removeFromFavourites: remove }}>
    {children}  
  </FavorContext.Provider>;
};

FavorContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const AuthenticationContextProvider = ({ children }) => {

  const [status, setStatus] = useState('error');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      await AsyncStorage.setItem(`@register`, jsonValue);
      setIsLoading(false);
    } catch (err) {
      console.log('Error saving user register', err);
      setIsLoading(false);
    }
  };

  const loadUserReg = async () => {
    setIsLoading(true);
    try {
      const jsonSession = await AsyncStorage.getItem(`@register`);
      setIsLoading(false);
      return jsonSession!==null? setUserReg(jsonSession): 
      setUserReg({"name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});      
    } catch (err) {
      console.log('error loading users register', err);
      setIsLoading(false);
    }
  };

 const saveUser = async (value) => {
    setIsLoading(true);
    try {
      const jsonValue = JSON.stringify(value);      
      await AsyncStorage.setItem(`@session`, jsonValue);
      setIsLoading(false);
    } catch (err) {
      console.log('Error saving user session', err);
      setIsLoading(false);
    }
  };

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const jsonSession = await AsyncStorage.getItem(`@session`);
      setIsLoading(false);
      return jsonSession!==null? setUser(jsonSession): 
      setUser({"id": "", "token": "", "name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});      
    } catch (err) {
      console.log('error loading users session', err);
      setIsLoading(false);
    }
  };

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
    saveUser(user);
    setError('User Session.');   
    setStatus('success');
    return "Ok";
  };

  const noSession = () => {
    setUser({"id": "", "token": "", "name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});  
    setError('User logout.');   
    setStatus('success');
  };  

  const addUserReg = (item) => {
    setUserReg(item);
    saveUserReg(userReg);
    setError('User Register.');   
    setStatus('success');
    return "Ok";
  };
  const removeReg = () => {
    setUserReg({"name": "", "username": "", "email": "", "password": "", "gdpr": "false", "userType": "USER"});  
  };

  useEffect(() => { 
    loadUsers();
    loadUser();
    loadUserReg();
  }, []);

  useEffect(() => { 
    saveUsers(users);
    saveUser(user);
    saveUserReg(userReg)
  });
  //Ojo: Quitar users de la lsta 
  return <AuthenticationContext.Provider 
    value={{ user, setSession: addSession, userReg, setUserRegister: addUserReg, noRegister: removeReg, onLogout: noSession, users, status, error, isLoading, 
             onLogin: getItem, onRegister: add, onUpdate: update, onRemove: remove }}>
    {children}  
  </AuthenticationContext.Provider>;
};

AuthenticationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {MenuContext, FavorContext, AuthenticationContext, MenuContextProvider, FavorContextProvider, AuthenticationContextProvider};