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
    // alignItems: 'center',  // 가로로 가운데 정렬
    justifyContent: 'center',  // 세로로 가운데 정렬
    marginBottom: 30,  // 70인데 30으로 바꿈 / Header와 container 사이에 간격 추가
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
});

export default commonStyles;
