import { StyleSheet } from 'react-native';
import COLORS from '../../utils/Colors';
import {
  horizontalScale,
  verticalScale,
} from '../../utils/Metrics';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bckbtn,
  },
header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    backgroundColor: COLORS.white,
  },

  scrollContent: {
    padding: horizontalScale(20),
    paddingBottom: verticalScale(40),
  },

  headerTitle: {
    textAlign: 'center',
    marginBottom: verticalScale(25),
    marginTop: verticalScale(10),
  },

  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: verticalScale(24),

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 4,
    marginBottom: verticalScale(20),
  },

  avatar: {
    width: horizontalScale(95),
    height: horizontalScale(95),
    borderRadius: 100,
    borderWidth: 3,
    borderColor: COLORS.premiumcolor,
    marginBottom: verticalScale(12),
  },

  userName: {
    marginBottom: verticalScale(4),
  },

  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: horizontalScale(18),

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 4,
  },

  infoRow: {
    paddingVertical: verticalScale(18),
  },

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderbottom,
  },

  editButton: {
    marginTop: verticalScale(25),
    height: verticalScale(55),
    borderRadius: 8,
  },
});