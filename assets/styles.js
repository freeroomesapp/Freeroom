import { StyleSheet, Dimensions, Platform } from 'react-native';

export const Styles = () => {

  return StyleSheet.create({
    nestedButtonContainer: {
      margin: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    nestedCard: {
      borderRadius: 10,
      flexGrow: 1,
      justifyContent: 'center',
      marginBottom: 10,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
    },
    nestedReserva: {
      borderRadius: 10,
      flexGrow: 1,
      justifyContent: 'center',
      marginBottom: 2,
      marginLeft: 2,
      marginRight: 2,
      marginTop: 5,
    },
    errorContainer: { 
      size: 'large', 
      alignitems: 'center', 
      alignself: 'center',  
      maxwidth: 100, 
      margintop: 2, 
      marginbottom: 2
    },
  });
};
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 2.85;
const CARD_WIDTH = CARD_HEIGHT + 14;

const screenWidth = Dimensions.get("window").width;

export const Cardstyles = () => {
 
  let factor = 1.02; let factorFlat = 1.29; let factorFlat2 = 1.02;     
  if (Platform.OS === "ios") {
    factor = 1.22; factorFlat = 1.30; factorFlat2 = 1.05;
  }

  return StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  maps: {
    ...StyleSheet.absoluteFillObject,
  },
  containerMarket: {
     backgroundColor: "white",
     width: screenWidth * 0.8,
     flexDirection: "row",
     borderWidth: 2,
     borderRadius: 12,
     overflow: "hidden",
  },   
  horizontalLine: {
     left: (screenWidth * 0.8) / 2 - 10,
     width: 0,
     height: 0,
     borderStyle: "solid",
     borderTopWidth: 20,
     borderRightWidth: 10,
     borderBottomWidth: 20,
     borderLeftWidth: 10,
     borderTopColor: "black",
     borderRightColor: "transparent",
     borderBottomColor: "transparent",
     borderLeftColor: "transparent",
     backgroundColor: "#D3D3D3",
  },
  triangle: {
     left: (screenWidth * 0.8) / 2 - 10,
     width: 0,
     height: 0,
     backgroundColor: "transparent",
     borderStyle: "solid",
     borderTopWidth: 20,
     borderRightWidth: 10,
     borderBottomWidth: 0,
     borderLeftWidth: 10,
     borderTopColor: "black",
     borderRightColor: "transparent",
     borderBottomColor: "transparent",
     borderLeftColor: "transparent",
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContain: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: 'transparent',
  },
  cardView: {
    borderRadius: 10, //Efecto rounded
    padding: 16,
    elevation: 4,
    backgroundColor: "#FFF",
    marginHorizontal: 6,
    //shadowColor: "#000",
    //shadowRadius: 5,
    //shadowOpacity: 0.3,
    //shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH*1.25,
    //overflow: "hidden",
  },
  card: {        
    marginBottom: 10,
    borderRadius: 20, //Efecto rounded
    padding: 6, //12
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH*factor,
    overflow: "hidden",
    borderRightWidth: 1,
    borderLeftWidth: 1
  },
  cardBorder: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1
  },
  cardError: {
    borderRadius: 10,
    justifyContent: 'center',
    //marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    //flex: 1,
    fontSize: 10,
    marginTop: 2,
    //fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 10,
    color: "#444",
  },
  containerImageIcon: {
    flex: 3,
    margin: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },    
  flatIconsContain: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#FFF",
  },
  containerIcons: {
    height: CARD_HEIGHT,
    width: CARD_WIDTH/3,
  },
  containerFlat: {
    height: CARD_HEIGHT*factorFlat,//1.05
    marginVertical: -15,
  },
  containerFlat2: {
    height: CARD_HEIGHT*factorFlat2,
    marginTop: 10,
  },
  iconTopLeft: {
    margin: 3,
    position: "absolute",
    top: 0,
    left: 0,
    borderWidth: 2,
    backgroundColor: "#FFF",
  },
  badge: {
    position: 'absolute',
    top: 20,
    left: 16,
    backgroundColor: 'yellowgreen' //'#ff0000'
  },
  badgeRigth: {
    position: 'absolute',
    top: 27,
    right: 13,
    backgroundColor: 'yellowgreen'
  },
  iconButton: {
    margin: 3,
    position: "absolute",
    top: 0,
    right: 0,
    borderWidth: 2,
    backgroundColor: "#FFF",
  },
  iconButtonDown: {
    margin: 3,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    backgroundColor: "#FFF",
  },
  currencyText: {
    borderRadius: 5,
    margin: 3,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 1,
    backgroundColor: "#FFF",
  },
  currencyTextNot: {
    textDecorationLine: 'line-through',
    fontSize: 10,
    borderRadius: 5,
    margin: 3,
    position: "absolute",
    bottom: 0,
    right: 41,
    borderWidth: 1,
    backgroundColor: "#FFF",
  },  
  currencyTextOffer:  {    
    borderRadius: 5,
    margin: 3,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 1,
    color: "#FFFFFF", 
    backgroundColor: "#6C1CA3",
  },
  distanceText: {
    borderRadius: 5,
    margin: 3,
    position: "absolute",
    bottom: 0,
    left: 0,
    //fontSize: 10,    
    backgroundColor: "#FFF",
  },  
  avatar: {
    margin: 8,
  },  
  currencyRowTextOffer: {
    fontSize: 12,
    borderRadius: 5,
    borderWidth: 1,
    color: "#FFFFFF", 
    backgroundColor: "#6C1CA3"
  }, 
  currencyRowText: {
    fontSize: 13,
    borderRadius: 5,
    borderWidth: 1,
    color: "#444", //"#b22222",
    fontWeight: "bold",
    backgroundColor: "#FFF"
  }, 
  currencyText_Ant: {
    alignContent: "flex-start",
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 10,
  },
  reload: {
    position: "absolute",
    right: 0,
    left: 0,
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: 10,
  },
  searchbar: {
    marginHorizontal: 8,
  },
  screen: {
    flex: 1,
    color: "#6c1ca3"
  },
  favico: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textHelp: {
    fontSize: 10,
    marginLeft: 1,  
    color: "#6C1CA3"      
  },
  textHelpSw: {
    fontSize: 10,
    marginLeft: 50,  
    color: "#6C1CA3"      
  },
  url: {
    fontSize: 10,
    marginLeft: 50,        
    textDecorationLine: 'Underline',
  },
});
};
