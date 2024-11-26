import { View, StyleSheet, Text, Image, Dimensions } from 'react-native'; 

const { height, width } = Dimensions.get("window");

export const CardSkeleton = () => { 
    return ( 
        <View style={styles.container}> 
            {/* Placeholder card content */} 
            <View style={styles.heading} /> 
            <View style={styles.placeholder} /> 
            <View style={styles.placeholder} /> 
            <View style={styles.containerChildren} > 
                <View style={styles.children} /> 
                <View style={styles.children} /> 
                <View style={styles.children} /> 
            </View>         
        </View> 
    ); 
}; 

const styles = StyleSheet.create({ 
    container: { 
        backgroundColor: '#F6F6F6', 
        borderRadius: 13, 
        padding: 16, 
        marginBottom: 16, 
        marginTop: 10, 
        marginLeft: 20,
        marginRight: 20,
        height: height / 3,
    }, 
    heading: { 
        backgroundColor: '#ccc', 
        height: 34, 
        borderRadius: 4, 
        marginBottom: 12, 
    },
    placeholder: { 
        backgroundColor: '#ccc', 
        height: 16, 
        borderRadius: 4, 
        marginBottom: 4, 
    },
    containerChildren: {
        flex: 1,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,          
    },     
    children: {
        borderRadius: 10, 
        height: height / 8,
        width: width / 4,
        backgroundColor: '#ccc', 
    },
}); 