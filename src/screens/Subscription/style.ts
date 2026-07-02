import { StyleSheet } from 'react-native';
import COLORS from '../../utils/Colors';
import { horizontalScale, verticalScale, responsiveFontSize } from '../../utils/Metrics';

const styles = StyleSheet.create({
   benefitsGrid: {
    marginBottom: verticalScale(10),
    paddingHorizontal: horizontalScale(5),
  },
  benefitsRow: {
    justifyContent: 'space-between',
    gap: horizontalScale(10), 
  },
  featureGridCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: horizontalScale(12),
    padding: verticalScale(12),
    marginHorizontal: 0,
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: COLORS.bordercolor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: verticalScale(80), 
    maxWidth: '48%',
  },
  featureGridIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(5),
    flexWrap: 'wrap',
  },
  featureGridTitle: {
    fontSize: responsiveFontSize(13),
    marginBottom: verticalScale(3),
    marginLeft: horizontalScale(6),
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'left', 
    lineHeight: verticalScale(18),
    fontWeight: '600',
    color: COLORS.textColor,
  },
  featureGridDescription: {
    fontSize: responsiveFontSize(11),
    textAlign: 'left',
    lineHeight: verticalScale(18),
    color: COLORS.disableText,
    flexWrap: 'wrap',
    paddingRight: horizontalScale(4),
  },
   benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
    paddingHorizontal: horizontalScale(5),
  },
  
  benefitIconContainer: {
    width: horizontalScale(28),
    marginRight: horizontalScale(12),
    marginTop: verticalScale(2),
  },
  
  benefitContent: {
    flex: 1,
  },
  
  featureTitle: {
    fontSize: responsiveFontSize(16),
    marginBottom: verticalScale(4),
    color: COLORS.textColor,
  },
  
  featureDescription: {
    fontSize: responsiveFontSize(13),
    lineHeight: verticalScale(18),
    color: COLORS.disableText,
  },
  
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalScale(10),
    paddingBottom: verticalScale(35),
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(20),
    justifyContent: 'space-between',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.appColor,
  },
  placeholder: {
    width: horizontalScale(40),
  },
  profileSection: {
    backgroundColor: COLORS.btnbg,
    height: verticalScale(210),
    borderRadius: horizontalScale(15),
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
    lineHeight: verticalScale(25),
  },
  upgradeBtn: {
    height: verticalScale(50),
    borderRadius: horizontalScale(7),
    paddingVertical:verticalScale(1)
  },
  sectionTitle: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(12),
  },
  benefitsList: {
    marginBottom: verticalScale(10),
  },
  benefitDot: {
    width: horizontalScale(8),
    height: horizontalScale(8),
    borderRadius: horizontalScale(4),
    backgroundColor: COLORS.btnbg,
    marginRight: horizontalScale(12),
  },
  benefitText: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(20),
  },
  categoryCard: {
    backgroundColor: COLORS.bordercolor1,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    borderRadius: horizontalScale(20),
    marginRight: horizontalScale(10),
    marginBottom: verticalScale(10),
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(25),
  },
  planCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: horizontalScale(12),
    paddingVertical: verticalScale(15),
    alignItems: 'center',
    marginHorizontal: horizontalScale(5),
    borderWidth: 1,
    borderColor: COLORS.bordercolor,
    position: 'relative',
  },
  selectedPlanCard: {
    backgroundColor: COLORS.btnbg,
    borderColor: COLORS.btnbg,
  },
  popularBadge: {
    position: 'absolute',
    top: verticalScale(-10),
    
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: horizontalScale(12),
  },
  planName: {
    marginBottom: verticalScale(8),
    fontSize: responsiveFontSize(14),
  },
  planPrice: {
    fontSize: responsiveFontSize(18),
  },
  startMembershipBtn: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(15),
    height: verticalScale(52),
    borderRadius: horizontalScale(10),
    paddingVertical:verticalScale(1)

  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
  },
  termsText: {
    textAlign: 'center',
    marginBottom: verticalScale(5),
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(10),
  },
   subscriptionInfo: {
      backgroundColor: '#E8F5E9',
      padding: 10,
      borderRadius: 8,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#C8E6C9',
    },
    subscriptionInfoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.success,
      marginBottom: 5,
    },
    subscriptionEndDate: {
      fontSize: 19,
      color: '#388E3C',
      fontWeight: '500',
    },
    
  
});

export default styles;
