import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale } from '../../utils/Metrics';
import COLORS from '../../utils/Colors';

export default  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#e53935',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  rightBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  arabicHome: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#4d574d', // dark green/black
    marginRight: 6,
  },
  logoImg: {
    width: 34,
    height: 34,
    marginHorizontal: 2,
    borderRadius:20
  },
  revistaText: {
    fontSize: 20,
    color: COLORS.revista, // gold
    fontWeight: 'bold',
    marginRight: horizontalScale(30),
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: horizontalScale(10),
    marginTop: verticalScale(5),
    marginBottom: verticalScale(10),
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
   title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
