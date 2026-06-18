import {StyleSheet} from 'react-native';
import COLORS from '../../utils/Colors';
import {horizontalScale} from '../../utils/Metrics';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft:horizontalScale(30),
    color: COLORS.textColor,
    textAlign:"center"
  },
  inner: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  // backButton: { marginBottom: 10, marginLeft: -4 },
  header: { fontSize: 22, marginBottom: 14, textAlign: 'left' },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    elevation: 1,
    // shadowColor: COLORS.black,
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  orderNumber: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.redblack,
    marginBottom: 2,
  },
  deliveryType: {
    fontSize: 13,
    color: COLORS.disableText,
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDelivered: {
    fontSize: 14,
    color: COLORS.btnbg,
    fontWeight: 'bold',
  },
  itemsCount: {
    fontSize: 13,
    color: COLORS.review,
    marginBottom: 12,
  },
  reviewBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.btnbg,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBtnText: {
    color: COLORS.btnbg,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
export default styles;
