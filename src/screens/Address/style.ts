import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';
import {horizontalScale, verticalScale} from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  inner: { flex: 1, paddingHorizontal: 18, paddingTop: 16 },
  title: { fontSize: 22,  textAlign: 'center',top: verticalScale(8),marginBottom:verticalScale(30) },
  subtitle: { fontSize: 15, marginBottom: 16, color: COLORS.textColor },
  label: { fontSize: 16, marginTop: 10, marginBottom: 3,marginLeft:horizontalScale(20) },
  input: {
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 15,
    marginBottom: 2,
  },
   backButton: {
    position: 'absolute',
    left: 20,
    top: verticalScale(25),
    zIndex: 1,
    padding: 8,
  },
  saveBtn: {
    backgroundColor: COLORS.appColor,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 40,
  },
  saveBtnText: { fontSize: 16 },
});
export default styles;
