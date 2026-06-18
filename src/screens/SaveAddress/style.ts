import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';
import {horizontalScale, verticalScale} from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white},
  innerContainer: {flex: 1, padding: 20},
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bckbtn,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {fontSize: 22, textAlign: 'center', flex: 1},
  placeholder: {
    width: 40, // Same width as back button to center the title
  },
  addressBox: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  label: {fontWeight: 'bold', fontSize: 15, marginTop: 10},
  value: {fontSize: 15, marginTop: 2, marginBottom: 4, color: COLORS.textColor},
});
export default styles;
