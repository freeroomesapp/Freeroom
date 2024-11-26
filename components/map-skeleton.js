import { View, ScrollView, StyleSheet, Text, Image, Dimensions } from 'react-native'; 

const { height, width } = Dimensions.get("window");


export const MapSkeleton = props => { 
    const  text1 = props.text1
    const  text2 = props.text2
    // splash_freeroom.png
    return ( 
        <ScrollView style={styles.container}> 
            <View style={styles.containerChildren} >
              <Text style={styles.text1}>{text1}</Text> 
              <Image
                style={styles.children1}
                source={require("../assets/loc-loading.gif")}/>   
              <Text style={styles.text2} >{text2}</Text>  
            </View>         
        </ScrollView> 
    ); 
}; 

const styles = StyleSheet.create({ 
    container: { 
        backgroundColor: '#F6F6F6', 
        borderRadius: 13, 
        padding: 16, 
        marginBottom: 25, 
        marginTop: 17, 
        marginLeft: 15,
        marginRight: 15,
        height: height / 1.5,
    }, 
    containerChildren: {
        flex: 1,
        marginTop: 5,
        marginVertical: 5,          
    },     
    children1: {
        alignSelf: "center",
        width: 150,
        height: 250,
        marginBottom: 6,
        borderRadius: 20,
        backgroundColor: '#ccc', 
    },
    text1: {    
        borderRadius: 10,
        fontSize: 12,
        alignSelf: "center",
        textAlign: 'center',
        width: 150, 
        height: 40,
        marginBottom: 10,
        top: 5,
        backgroundColor: '#ccc', 
    },
    text2: {    
        borderRadius: 10,
        fontSize: 12,
        alignSelf: "center",
        textAlign: 'center',
        width: 150, 
        height: 60,
        marginBottom: 10,
        top: 5,
        backgroundColor: '#ccc', 
    },  
});