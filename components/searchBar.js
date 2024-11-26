import React, { FunctionComponent } from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  ViewStyle
} from 'react-native'
type SearchBarProps = {
  value: string,
  onChangeText: (text: string) => void
}
const SearchBar: FunctionComponent<SearchBarProps> = props => {
  const {
    value,
    onChangeText
  } = props

return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        placeholder='Search by address'
        placeholderTextColor='gray'
        value={value}
        onChangeText={onChangeText}
        returnKeyType='search'
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  inputStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#cfcfcf',
    borderRadius: 20,
    color: 'black',
    fontSize: 16
  }
})
export default SearchBar