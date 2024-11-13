import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    backgroundColor: '#3182f6',
    flex: 1,
    justifyContent: 'center',
    padding: 0,
    // paddingLeft: 40,
    // paddingRight: 40,
  },
  containerWhite: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    padding: 0,
    // paddingLeft: 40,
    // paddingRight: 40,
  },
  innerContainer:{
    // flex: 1,
    // justifyContent: 'center',
    paddingTop: 30,
    margin: 0,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    // borderRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingLeft: 40,
    paddingRight: 40,
  },
  innerContainer1:{
    // flex: 1,
    // justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    // marginBottom: 30,
    backgroundColor: '#ffffff',
    width: '90%',
    height: '20%',
    borderRadius: 30,
  },
  innerContainer2:{
    // flex: 1,
    // justifyContent: 'center',
    paddingTop: 30,
    margin: 0,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    // borderRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  // innerContainer2:{
  //   backgroundColor: '#ffffff',
  //   paddingLeft: 40,
  //   paddingRight: 40,
  //   width: '100%',
  //   height: '80%',
  //   paddingTop: 20,
  //   // borderRadius: 30,
  // },
  headerContainer: {
    width: '100%',
    // alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    color: '#ffffff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  // header: {
  //   fontSize: 24,
  // },
  // headerTitle:{
  //   fontSize: 20,
  //   color: '#ffffff',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  termsHeaderTitle:{
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fixedFooter: {
    height: '8%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#3182f6',
    // borderTopWidth: 1,
    // borderColor: '#ddd',
  },
  footerText:{
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  view1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  view2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  view3: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input1: {
    width: '70%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  smallButton: {
    width: '25%',
    height: 50,
    borderColor: '#3182f6',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  checkBox:{
    width: '25%',
    height: 50,
    borderColor: '#3182f6',
    borderWidth: 1,
  },

  fullWidthButton: {
    width: '100%',
    height: 50,
    borderColor: '#3182f6',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '11%',
    height: 50,
    padding: 5,
    backgroundColor: '#e9daef',
    borderColor: '#e9daef',
    borderWidth: 1,
    borderRadius: 50,
  },
  activeButton: {
    backgroundColor: '#3182f6',
  },
  modalView: {
    borderColor: '#3182f6',
  },
  linkContainer:{
    paddingLeft: 5,
  },
  link: {
    color: '#838383',
  },
  wheel1: {
    width: '100%',
    height: '22%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignItems: 'center',
    // backgroundColor: 'rgba(255, 0, 0, 0.2)',
    // marginRight: 20,
    // justifyContent: 'space-between',
    marginBottom: '5%',
  },
  box1: {
    width: '30%',
    height: '90%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  //   box0: {
  //   width: '30%',
  //   height: '100%',
  //   backgroundColor: '#fff',
  //   justifyContent: 'center',   // **이미지 중앙 정렬 추가**
  //   alignItems: 'center',       // **이미지 중앙 정렬 추가**
  //   marginRight: '5%',
  //   marginTop: 0,
  // },
  // box1: {
  //   width: '100%',
  //   height: '90%',
  //   // backgroundColor: '#ffffff',
  //   backgroundColor: 'green',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 25,
  //   borderWidth: 3,
  //   borderColor: '#FFF',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 6,
  //   elevation: 10,
  //   marginTop: 20,
  // },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textCenter: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text1: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2c2b2b',
    marginBottom: 10,
  },
  text2: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#bd90ce',
    marginBottom: 10,
  },
  text3: {
    fontSize: 12,
    fontWeight: '400',
    // color: '#2c2b2b',
    color: 'black',
    paddingLeft: 20,
    paddingRight: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default commonStyles;
