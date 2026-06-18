import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';
import {verticalScale} from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor || COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 logoImg: {
  height: 100,
  width: 200,
  alignSelf: 'center',
},
  loader: {
    marginTop: verticalScale(30),
  },
});

export default styles;
