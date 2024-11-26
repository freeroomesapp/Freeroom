import { View, StyleSheet, Text, Image, Dimensions } from 'react-native'; 

const { height, width } = Dimensions.get("window");

export const UserSkeleton = () => { 
    return ( 
        <View style={styles.container}> 
            <View style={styles.containerChildren} > 
                <View style={styles.children1} /> 
                <View style={styles.children2} /> 
            </View>         
        </View> 
    ); 
}; 

const styles = StyleSheet.create({ 
    container: { 
        backgroundColor: '#F6F6F6', 
        borderRadius: 13, 
        padding: 16, 
        marginBottom: 20, 
        marginTop: 30, 
        marginLeft: 15,
        marginRight: 15,
        height: height / 4,
    }, 
    containerChildren: {
        flex: 1,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,          
    },     
    children1: {
        width: 90,
        height: 90,
        marginBottom: 6,
        borderRadius: 45,
        backgroundColor: '#ccc', 
    },
    children2: {
        width: width - 170,
        height: 40,
        marginBottom: 6,
        right: 10,
        top: 20,
        backgroundColor: '#ccc', 
    },
});