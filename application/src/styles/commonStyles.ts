import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    backgroundColor: '#9C59B5',
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
  headerContainer: {
    width: '100%',
    // alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  // header: {
  //   fontSize: 24,
  // },
  headerTitle:{
    fontSize: 20,
    // color: "#6A1B9A",
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'left',
    // textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 0,
    paddingLeft: 50,
    paddingVertical: 13,
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
    borderColor: '#9C59B5',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input1: {
    width: '70%',
    height: 50,
    borderColor: '#9C59B5',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  smallButton: {
    width: '25%',
    height: 50,
    borderColor: '#9C59B5',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  checkBox:{
    width: '25%',
    height: 50,
    borderColor: '#9C59B5',
    borderWidth: 1,
  },

  fullWidthButton: {
    width: '100%',
    height: 50,
    borderColor: '#9C59B5',
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
    backgroundColor: '#9C59B5',
  },
  modalView: {
    borderColor: '#9C59B5',
  },
  linkContainer:{
    paddingLeft: 5,
  },
  link: {
    color: '#838383',
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
    color: '#ffffff',
    paddingLeft: 20,
    paddingRight: 20,
  },
  // circleContainer: {
  //   width: 80,
  //   height: 80,
  //   borderRadius: 40,
  //   backgroundColor: '#fff2e4', // 배경색 추가
  //   // borderWidth: 3,
  //   // borderColor:'#ffc484',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // circleContainer1: {
  //   width: 80,
  //   height: 80,
  //   borderRadius: 40,
  //   backgroundColor: '#ffc484', // 배경색 추가
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // circleImage: {
  //   width: 50,
  //   height: 50,
  //   // borderRadius: 50,
  //   overflow: 'hidden',
  // },
  box1: {
    width: '100%',
    height: '10%',
    backgroundColor: '#9C59B5',
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
    marginBottom: 20,
  },
  box2: {
    width: '100%',
    height: '40%',
    backgroundColor: '#9C59B5',
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
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  circleContainer: {
    flexDirection: 'column',  // 변경: column으로 수정하여 이미지 아래 텍스트 배치
    alignItems: 'center',    // 텍스트를 가운데 정렬
    justifyContent: 'center',
    width: 80,
    height: 120,             // 충분한 공간을 주어 텍스트와 이미지 간의 여유를 추가
    backgroundColor: '#fff2e4',
    borderRadius: 40,
    marginBottom: 10,        // 텍스트와 이미지 사이의 여유 공간 추가
  },

  circleContainer1: {
    flexDirection: 'column',  // 변경: column으로 수정하여 이미지 아래 텍스트 배치
    alignItems: 'center',     // 텍스트를 가운데 정렬
    justifyContent: 'center',
    width: 80,
    height: 120,              // 충분한 공간을 주어 텍스트와 이미지 간의 여유를 추가
    backgroundColor: '#ffc484',
    marginBottom: 10,         // 텍스트와 이미지 사이의 여유 공간 추가
  },

  circleImage: {
    width: 50,
    height: 50,
    overflow: 'hidden',
  },

  circleText: {
    marginTop: 10,            // 이미지와 텍스트 사이의 간격을 조정
    textAlign: 'center',      // 텍스트를 가운데 정렬
    fontSize: 14,
    fontWeight: '600',
    color: '#2c2b2b',
  },
});

export default commonStyles;
