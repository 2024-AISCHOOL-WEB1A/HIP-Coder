
import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    fontSize: 16,
    marginBottom: 12,
  },
  view1: {
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
    flexDirection: 'row',
    height: 50,
    borderColor: '#7a87c9',
    borderWidth: 1,
    borderRadius: 20,
    // marginBottom: 20,
    paddingHorizontal: 10,
  },
  input2: {
    width: '25%',
    flexDirection: 'row',
    backgroundColor: '#7a87c9',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'red',


    height: 50,
    borderColor: '#7a87c9',
    borderWidth: 1,
    borderRadius: 20,
    // marginBottom: 20,
    paddingHorizontal: 10,
  },
  radioButton: {
    backgroundColor: '#f0f2f9',
    marginRight: 15,
    padding: 10,
    height: 50,
    borderColor: '#f0f2f9',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,


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