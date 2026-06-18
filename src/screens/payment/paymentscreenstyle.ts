import { StyleSheet } from "react-native";
import COLORS from "../../utils/Colors";


const PaymentScreenstyle = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.disableText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.btnbg,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.reviewcmt,
  },
  amountContainer: {
    backgroundColor: COLORS.btnbg,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amount: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subscriptionSection: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.btnbg,
  },
  subscriptionBadge: {
    backgroundColor: COLORS.btnbg,
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.reviewcmt,
    marginBottom: 15,
  },
  planDuration: {
    fontSize: 14,
    color: COLORS.disableText,
    marginTop: 5,
  },
  orderId: {
    fontSize: 14,
    color: COLORS.disableText,
    marginTop: 5,
  },
  methodButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  methodButtonActive: {
    borderColor:COLORS.btnbg ,
    backgroundColor: '#f0f8ff',
  },
  methodText: {
    fontSize: 16,
    color: COLORS.reviewcmt,
  },
  methodTextActive: {
    color: COLORS.btnbg,
    fontWeight: '600',
  },
  methodIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIconText: {
    fontSize: 20,
  },
  noMethods: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  typeButtonActive: {
    borderColor: COLORS.btnbg,
    backgroundColor: '#f0f8ff',
  },
  typeText: {
    fontSize: 14,
    color: COLORS.disableText,
    fontWeight: '500',
  },
  typeTextActive: {
    color: COLORS.btnbg,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    color: COLORS.reviewcmt,
    fontWeight: '500',
  },
  cartItemQuantity: {
    fontSize: 12,
    color: COLORS.disableText,
    marginTop: 2,
  },
  cartItemPrice: {
    fontSize: 14,
    color: COLORS.reviewcmt,
    fontWeight: '600',
  },
  moreItemsText: {
    fontSize: 12,
    color: COLORS.disableText,
    textAlign: 'center',
    paddingVertical: 8,
    fontStyle: 'italic',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalItem: {
    borderBottomWidth: 0,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.disableText,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.reviewcmt,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.reviewcmt,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.btnbg,
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  payButton: {
    backgroundColor: COLORS.btnbg,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: COLORS.halfmodal,
    opacity: 0.7,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default PaymentScreenstyle