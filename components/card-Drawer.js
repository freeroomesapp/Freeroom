import React, {useRef, useEffect} from 'react';
import { Animated, PanResponder, View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from 'react-native'; 
import { Divider } from '@rneui/themed';

const { width, height } = Dimensions.get("window");

const DrawerState = { 
  Open: height - 180,
  Peek: 220,
  Closed: 0,
};

const animateMove = (
  y: Animated.Value,
  toValue: number | Animated.Value,
  callback?: any,
) => {
  Animated.spring(y, {
    toValue: -toValue,
    tension: 20,
    useNativeDriver: true,
  }).start((finished) => {
/* Optional: But the purpose is to call this after the the animation has finished. Eg. Fire an event that will be listened to by the parent component */
    finished && callback;// && callback();
  });
};

const getNextState = (
  currentState: DrawerState,
  val: number,
  margin: number,
): DrawerState => {
  switch (currentState) {
    case DrawerState.Peek:
      return val >= currentState + margin
        ? DrawerState.Open
        : val <= DrawerState.Peek - margin
        ? DrawerState.Closed
        : DrawerState.Peek;
    case DrawerState.Open:
      return val >= currentState
        ? DrawerState.Open
        : val <= DrawerState.Peek
        ? DrawerState.Closed
        : DrawerState.Peek;
    case DrawerState.Closed:
      return val >= currentState + margin
        ? val <= DrawerState.Peek + margin
          ? DrawerState.Peek
          : DrawerState.Open
        : DrawerState.Closed;
    default:
      return currentState;
  }
};
interface BottomDrawerProps {
  children?: React.ReactNode;
  //onDrawerStateChange: (nextState: DrawerState) => void;
}

export const CardDrawerGesture: React.FunctionComponent<BottomDrawerProps> = ({children }) => { 
    
  const y = React.useRef(new Animated.Value(DrawerState.Closed)).current;
  const state = React.useRef(new Animated.Value(DrawerState.Closed)).current;
  const margin = 0.05 * height;
  const movementValue = (moveY: number) => height - moveY;

  const onPanResponderMove = (
    _: GestureResponderEvent,
    { moveY }: PanResponderGestureState,
  ) => {
    const val = movementValue(moveY);
    animateMove(y, val);
  };
  
  const onPanResponderRelease = (
    _: GestureResponderEvent,
    { moveY }: PanResponderGestureState,
  ) => {
    const valueToMove = movementValue(moveY);
    const nextState = getNextState(state._value, valueToMove, margin);
    state.setValue(nextState);
    animateMove(y, nextState, DrawerState.Peek); //onDrawerStateChange(nextState)
  };

  const onMoveShouldSetPanResponder = (
    _: GestureResponderEvent,
    { dy }: PanResponderGestureState,
  ) => Math.abs(dy) >= 10;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: onMoveShouldSetPanResponder,
      onPanResponderMove,
      onPanResponderRelease,
    }),
  ).current;

  return (
    <Animated.View
      style={[styles.container, {transform: [{ translateY: y }]}]} 
      {...panResponder.panHandlers}>
      <Text style={{ fontSize: 6 }}></Text> 
      <Divider inset={true} insetType="middle" width={3} />    
      <Text style={{ fontSize: 6 }}></Text>
      <View style={{height: '70%' }}>
        {children}  
      </View>
    </Animated.View>
  ); 
};

//Este esta incompleto.
export const CardDrawer: React.FunctionComponent<BottomDrawerProps> = ({children }) => { 

  const [expand, setExpand] = React.useState('vertical');//'horizon'

  const changeExpand = () => {
    if (expand==='vertical') setExpand('down');
    else if (expand==='down') setExpand('vertical');
  }

  return (
    
    <View style={[styles.container, expand==='down'?styles.setBottom:'']} > 
      <TouchableOpacity onPress={changeExpand}>
        <Text style={{ fontSize: 6 }}></Text>
        <Divider inset={true} insetType="middle" width={3} />    
        <Text style={{ fontSize: 6 }}></Text>
      </TouchableOpacity>       
      <View style={{height: '70%' }}>
        {children}  
      </View> 
    </View>
  ); 
};
//Este solo mueve la vista pero inhabilita el touch del children
export const CardDrawerSimple: React.FunctionComponent<BottomDrawerProps> = ({children }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [hidden, setHidden] = React.useState(true);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }]),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <View style={styles.containerS}>
      <Animated.View
          style={{
            transform: [{ translateY: pan.y }],
            //position: 'absolute',
            bottom: 0,
          }}
        {...panResponder.panHandlers}>          
        <View style={styles.box}>
          {children} 
        </View>
      </Animated.View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height,
    backgroundColor: '#fff',
    borderRadius: 25,
    position: 'absolute',
    bottom: -height + 30
  },
  containerS: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setBottom: {
    bottom: -height + 240
  },
  box: {
    minHeight: height * 0.7,
    width,
    backgroundColor: 'blue',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
