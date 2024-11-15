import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    backgroundColor: '#3182f6',
    flex: 1,
    justifyContent: 'center',
    padding: 0,
  },
  containerWhite: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    padding: 0,
  },
  containerGray: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    padding: 0,
  },
  innerContainer:{
    paddingTop: 30,
    marginTop: 0,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingLeft: 40,
    paddingRight: 40,
  },
  innerContainerGray:{
    width: '100%',
    height: '100%',
    paddingLeft: 40,
    paddingRight: 40,
  },
  innerContainer1:{
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: '#ffffff',
    width: '90%',
    height: '20%',
    borderRadius: 30,
  },
  innerContainer2:{
    paddingTop: 20,
    margin: 0,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingLeft: 30,
    paddingRight: 30,
  },

  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    color: '#ffffff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  termsHeaderTitle:{
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  fixedFooter: {
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#3182f6',
    justifyContent: 'center', // 수직 정렬 추가
    alignItems: 'center', // 수평 정렬 추가

  },
  footerText:{
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    color: '#ffffff',
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
  view4: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  input: {
    fontFamily: 'Pretendard-Regular',
    height: 50,
    borderColor: '#E0E0E0',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input1: {
    fontFamily: 'Pretendard-Regular',
    width: '70%',
    height: 50,
    borderColor: '#E0E0E0',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  smallButton: {
    width: '25%',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  checkBox:{
    width: '25%',
    height: 50,
    borderColor: '#3182f6',
    borderWidth: 1,
  },

  fullWidthButton: {
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
  linkContainer:{
    paddingLeft: 5,
  },
  link: {
    color: '#838383',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  box1: {
    width: '100%',
    height: '14%',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox:{
    justifyContent: 'center',
    paddingTop:'30%',
  },
  logoImage1: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  circleContainer: {
    justifyContent: 'center',
    marginRight: 10, // 텍스트와 이미지 간의 간격
  },
  circleImage: {
    width: 40,
    height: 40,
    overflow: 'hidden',
  },
  reportImage:{
    width: 30,
    height: 30,
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  reportButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textNextToImageTitle: {
    fontFamily: 'Pretendard-Bold',
    textAlign: 'left',
    color: '#1c1c1c',
    fontSize: 16,
  },

  textNextToImage: {
    fontFamily: 'Pretendard-Regular',
    textAlign: 'left',
    color: '#8e8e8e',
    fontSize: 12,
  },

  box2Banner1: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    marginTop: '8%',
  },
  box2Banner2: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    marginTop: '8%',
  },
  boxImageBanner1: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    resizeMode: 'cover',
  },
  boxImageBanner2: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    resizeMode: 'cover',
  },
  reportFullImage : {
    width: '100%',
    height: '80%',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textMarginBottom: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#2c2b2b',
    marginBottom: 10,
  },
  text1: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#2c2b2b',
  },
  text2: {
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    fontSize: 16,
    color: '#3182f6',
    marginBottom: 10,
  },
  text3: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    // color: '#2c2b2b',cd android && ./gradlew clean && cd ..
    color: 'black',
    paddingLeft: 20,
    paddingRight: 20,
  },
  textInputTop:{
    fontFamily: 'Pretendard-Regular',
    color: 'black',
    fontSize: 16,
    paddingLeft: '2%',
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    color: '#fff',
    fontSize: 16,
  },
  textGraySmall:{
    fontFamily: 'Pretendard-Regular',
    color: 'gray',
    fontSize: 12,
  },
  textGrayMedium:{
    fontFamily: 'Pretendard-Regular',
    color: 'gray',
    fontSize: 16,
  },
  textGrayMediumCenter:{
    fontFamily: 'Pretendard-Regular',
    color: 'gray',
    fontSize: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  redAsterisk: {
    color: 'red',
  },
});


export default commonStyles;
