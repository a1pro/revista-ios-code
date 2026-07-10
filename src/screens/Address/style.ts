import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';
import {horizontalScale, verticalScale} from '../../utils/Metrics';

const styles = StyleSheet.create({
  // container: { flex: 1, backgroundColor: COLORS.white },
  inner: { flex: 1, paddingHorizontal: 18, paddingTop: 16 },
  title: { fontSize: 22,  textAlign: 'center',top: verticalScale(8),marginBottom:verticalScale(30) },
  subtitle: { fontSize: 15, marginBottom: 16, color: COLORS.textColor },
  label: { fontSize: 16, marginTop: 10, marginBottom: 3,marginLeft:horizontalScale(20) },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    padding: 16,
    paddingBottom: 50,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  // label: {
  //   fontSize: 14,
  //   marginTop: 12,
  //   marginBottom: 4,
  //   color: COLORS.textColor,
  // },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: COLORS.white,
    marginTop: 4,
  },
  dropdown: {
    height: 45,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  saveBtn: {
    backgroundColor: COLORS.btnbg,
    padding: 14,
    marginTop: 30,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
  // input: {
  //   borderRadius: 8,
  //   paddingHorizontal: 5,
  //   paddingVertical: 5,
  //   fontSize: 15,
  //   marginBottom: 2,
  // },
  //  backButton: {
  //   position: 'absolute',
  //   left: 20,
  //   top: verticalScale(25),
  //   zIndex: 1,
  //   padding: 8,
  // },
  // saveBtn: {
  //   backgroundColor: COLORS.appColor,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   paddingVertical: 20,
  //   marginTop: 40,
  // },
  // saveBtnText: { fontSize: 16 },
  
});
export default styles;
