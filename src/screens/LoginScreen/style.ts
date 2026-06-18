import {StyleSheet} from 'react-native';
import {horizontalScale, verticalScale} from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(60),
    width: '100%',
    paddingHorizontal: horizontalScale(15),
  },
  inputContainer: {
    gap: verticalScale(10),
    marginVertical: verticalScale(20),
  },
  heartView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
