import { Constants } from 'expo'

/**
 * Reusable code
 * Theses styles are used in the whole app
 */
export const globalColors = {
  primary: '#073B4C',
  secondary: '#06D6A0',
  error: '#EF476F',
  warning: '#FFD166',
  caption: '#118AB2',
  white: 'white',
}

export const scores = {
  green: 'green',
  lightgreen: '#85BB2F',
  yellow: '#FFD300',
  orange: 'orange',
  red: 'red',
}

export const HEADER_HEIGHT = 70

export const globalStyle = {
  header: {
    backgroundColor: globalColors.primary,
    width: '100%',
    height: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: globalColors.caption,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdropOpacity: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  statusBar: {
    backgroundColor: globalColors.primary,
    height: Constants.statusBarHeight,
  },
  itemLine: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingVertical: 10,
    paddingLeft: 10,
  },
}

export const globalTextStyle = {
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    color: globalColors.white,
  },
  button: {
    fontWeight: 'normal',
    fontSize: 22,
    color: globalColors.white,
  },
  h1: {
    fontWeight: 'bold',
    fontSize: 32,
    color: globalColors.primary,
    marginBottom: 5,
  },
  h2: {
    fontSize: 26,
    color: globalColors.primary,
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
  subtitle: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 15,
  },
  lightbutton: {
    textAlign: 'center',
    color: globalColors.error,
    marginVertical: 10,
  },
}