import React from 'react'
import { Text, TouchableOpacity, } from 'react-native'
import { globalStyle, globalTextStyle, textStyle, } from '../styles/global'

/**
 * Why doesn't this component have a Class?
 * See: https://javascriptplayground.com/functional-stateless-components-react/
 * @param text
 * @param onPress
 * @returns {*}
 * @constructor
 */
const Button = ({text, onPress}) => {
  return (
    <TouchableOpacity style={globalStyle.button} onPress={onPress}>
      <Text style={globalTextStyle.button}>{text}</Text>
    </TouchableOpacity>
  )
}
export default Button