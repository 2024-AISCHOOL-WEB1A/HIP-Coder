
import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'flex-start', 
  //   alignItems: 'center', 
  //   padding: 80,
  //   paddingLeft: 40,
  //   paddingRight: 40,
  // },
  // textContainer: {
  //   marginBottom: 20, 
  //   alignItems: 'flex-start', 
  //   marginTop: 50,
  //   width: '100%', 
  // },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6A1B9A',
    textAlign: 'left', 
  },
  subHeader: {
    fontSize: 32,
    color: '#6A1B9A', 
    paddingBottom: 100,
    textAlign: 'left', 
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  // header: {
  //   fontSize: 16,
  //   marginBottom: 12,
  // },
  view1: {
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#7a87c9',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input1: {
    width: '70%',
    // flexDirection: 'row',
    height: 50,
    borderColor: '#7a87c9',
    borderWidth: 1,
    borderRadius: 20,
    // marginBottom: 20,
    paddingHorizontal: 10,
  },
 
  smallButton: {
    width: '25%',
    height: 50,
    borderColor: '#7a87c9',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  fullWidthButton: {
    width: '100%',
    height: 50,
    borderColor: '#7a87c9',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    // paddingHorizontal: 10,
  },

 
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '11%',
    height: 50,
    padding: 5,
    backgroundColor: '#f0f2f9',
    borderColor: '#f0f2f9',
    borderWidth: 1,
    borderRadius: 50,
    // marginBottom: 20,
    // paddingHorizontal: 10,
  },
  activeButton: {
    backgroundColor: '#7a87c9',
  },
  
  link: {
    color: 'blue',
    marginTop: 20,
  },
  button: {
    marginBottom: 10,
    color: 'red',
  },
  record: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,
  },
  url: {
    fontSize: 16,
  },
  status: {
    color: 'gray',
  },
});

export default commonStyles;