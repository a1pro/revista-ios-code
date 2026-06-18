import { StyleSheet } from 'react-native';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: COLORS.white,
  },
   imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
     header: {
      fontSize: 24,
      fontWeight: 'bold',
      margin: 16,
      textAlign: 'center',
      color: COLORS.black,
      marginBottom: verticalScale(30),
    },
  addressContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressText: {
    color: '#555',
  },

  cartImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: COLORS.disableText,
  },
  cartTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  cartDescription: {
    fontSize: 12,
    color: COLORS.disableText,
    marginVertical: 4,
  },
  cartPrice: {
    fontWeight: 'bold',
    color: COLORS.black,
    fontSize: 14,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
    marginLeft: 10,
    paddingHorizontal: 5,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  qtyText: {
    marginHorizontal: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  qtySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    // height:25,

  },
  checkoutBtn: {
    backgroundColor: COLORS.revista,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  checkoutText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearCartBtn: {
    backgroundColor: COLORS.revista,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  clearCartText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteIcon: {
    position: 'absolute',
    top: 0,
    right: 8,
    zIndex: 1,
  },
  // NEW STYLE for cart item count
  cartItemCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.reviewcmt,
    marginBottom: 10,
    textAlign: 'left',
  },
  disabledBtn: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  disabledText: {
    color: COLORS.disableText,
  },
  outOfStockItem: {
    opacity: 0.7,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 3,
    borderLeftColor: '#dc3545',
  },

  
   placeholderImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  stockWarning: {
    fontSize: 11,
    color: '#dc3545',
    marginTop: 2,
    fontStyle: 'italic',
  },

  // Stock info text (gray color)
  stockInfo: {
    fontSize: 11,
    color: COLORS.headertext,
    marginTop: 2,
  },

  // Disabled quantity button
  qtyBtnDisabled: {
    opacity: 0.5,
    backgroundColor: '#e9ecef',
  },

  qtyBtnMin: {
    opacity: 0.7,
  },

  qtyValueContainer: {
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  deleteIconDisabled: {
    opacity: 0.5,
  },

  continueShoppingBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: COLORS.appColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  continueShoppingText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },

  cartListContainer: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  summaryContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginHorizontal: 3,
    marginTop: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Summary Label (text on left)
  summaryLabel: {
    fontSize: 14,
    color: COLORS.headertext,
    fontWeight: '500',
  },

  summaryValue: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '600',
  },

  checkoutBtnDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.halfmodal,
  },


  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f7f7f7',
  },


});
