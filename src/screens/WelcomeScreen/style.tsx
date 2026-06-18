import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';
import {verticalScale} from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    justifyContent: 'center',
  },
  logoImg: {
    height: '28%',
    alignSelf: 'center',
    marginTop: verticalScale(20),
  },
});

export default styles;
