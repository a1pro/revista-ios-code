

import { StyleSheet } from 'react-native';
import COLORS from '../../utils/Colors';
import { horizontalScale, verticalScale } from '../../utils/Metrics';

export const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalScale(10),
    paddingBottom: verticalScale(35),
  },
 
  headerText: {
    marginLeft:horizontalScale(20),
    textAlign: 'center',
    paddingVertical: verticalScale(30),
    fontSize: verticalScale(24),
    // borderWidth:1
  },
  profileSection: {
    backgroundColor: COLORS.btnbg,
    height: verticalScale(210),
    borderRadius: 15,
    marginBottom: verticalScale(20),
    padding: horizontalScale(20),
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(9),
  },
  iconImg: {
    height: verticalScale(40),
    width: horizontalScale(40),
    marginRight: horizontalScale(8),
  },
  cardText: {
    marginBottom: verticalScale(20),
    lineHeight: 25,
  },
  upgradeBtn: {
    height: verticalScale(50),
    borderRadius: 7,
  },
  middleCard: {
    backgroundColor: COLORS.backgroundColor,
    elevation: 4,
    borderRadius: 15,
    marginVertical: verticalScale(15),
  },
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(15),
    alignItems: 'center',
  },
  iconName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: horizontalScale(10),
  },
  content: {},
  horizontalBar: {
    backgroundColor: COLORS.placeholder,
    height: 1,
    width: '95%',
    alignSelf: 'center',
  },
  logoutBtn: {
    borderRadius: 8,
    marginVertical: verticalScale(15),
    height: verticalScale(50),
  },
});