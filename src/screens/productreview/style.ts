// import { StyleSheet } from 'react-native';
// import COLORS from '../../utils/Colors';

// const styles = StyleSheet.create({
//  container: {
//     flex: 1,
//     backgroundColor: COLORS.backgroundColor,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.backgroundColor,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: COLORS.reviewcmt,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: COLORS.white,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.borderbottom,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.black,
//   },
//   headerPlaceholder: {
//     width: 40,
//   },
//   summaryContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: COLORS.white,
//     marginHorizontal: 16,
//     marginVertical: 10,
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   summaryText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.black,
//   },
//   submitAllButton: {
//     backgroundColor: COLORS.appColor,
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   submitAllButtonText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   orderSection: {
//     backgroundColor: COLORS.white,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     borderRadius: 10,
//     elevation: 2,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     overflow: 'hidden',
//   },
//   orderHeader: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.borderbottom,
//     backgroundColor: COLORS.backgroundColor,
//   },
//   orderNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.black,
//     marginBottom: 4,
//   },
//   deliveryStatus: {
//     fontSize: 14,
//     color: COLORS.headertext,
//   },
//   orderItemsContainer: {
//     padding: 16,
//   },
//   productCard: {
//     marginBottom: 20,
//     padding: 16,
//     backgroundColor: COLORS.white,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.revista3,
//   },
//   productHeader: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   productImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     backgroundColor:COLORS.backgroundColor ,
//   },
//   productInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.black,
//     marginBottom: 4,
//   },
//   orderInfo: {
//     fontSize: 14,
//     color: COLORS.headertext,
//     marginBottom: 2,
//   },
//   deliveryDate: {
//     fontSize: 14,
//     color: COLORS.headertext,
//     marginBottom: 2,
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.appColor,
//   },
//   ratingSection: {
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.black,
//     marginBottom: 8,
//   },
//   starsContainer: {
//     flexDirection: 'row',
//   },
//   starIcon: {
//     marginRight: 8,
//   },
//   commentSection: {
//     marginBottom: 16,
//   },
//   commentInput: {
//     minHeight: 100,
//     borderWidth: 1,
//     borderColor: COLORS.revista3,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 14,
//     textAlignVertical: 'top',
//     backgroundColor: COLORS.backgroundColor,
//   },
//   submitButton: {
//     backgroundColor: COLORS.btnbg,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonDisabled: {
//     backgroundColor: COLORS.placeholder,
//   },
//   submitButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: COLORS.headertext,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   emptyMessage: {
//     fontSize: 16,
//     color: COLORS.review,
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 30,
//   },
//   browseButton: {
//     backgroundColor: COLORS.btnbg,
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   browseButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
// export default styles;
import { StyleSheet } from 'react-native';
import COLORS from '../../utils/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundColor,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.reviewcmt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderbottom,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  headerPlaceholder: {
    width: 40,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  submitAllButton: {
    backgroundColor: COLORS.btnbg,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  submitAllButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  orderHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderbottom,
    backgroundColor: COLORS.backgroundColor,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  deliveryStatus: {
    fontSize: 14,
    color: COLORS.headertext,
  },
  orderItemsContainer: {
    padding: 16,
  },
  productCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.revista3,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundColor,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  orderInfo: {
    fontSize: 14,
    color: COLORS.headertext,
    marginBottom: 2,
  },
  deliveryDate: {
    fontSize: 14,
    color: COLORS.headertext,
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.btnbg,
  },
  ratingSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 8,
  },
  commentSection: {
    marginBottom: 16,
  },
  commentInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.revista3,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    backgroundColor: COLORS.backgroundColor,
  },
  submitButton: {
    backgroundColor: COLORS.btnbg,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.headertext,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: COLORS.review,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: COLORS.btnbg,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },

  // ============ SELLER RELATED STYLES ============
  sellerName: {
    fontSize: 13,
    color: COLORS.headertext,
    marginTop: 2,
    fontWeight: '500',
  },
  productStatus: {
    fontSize: 12,
    color: COLORS.reviewcmt,
    marginTop: 2,
  },

  // ============ MODAL STYLES ============

modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderbottom,
    paddingBottom: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalSellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: 10,
  },
  modalBody: {
    flex: 1,
  },
  modalRatingSection: {
    marginBottom: 16,
  },
  modalStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalStarButton: {
    paddingHorizontal: 8,
  },
  modalCommentSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.revista3,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
    backgroundColor: COLORS.backgroundColor,
  },
  modalSubmitButton: {
    backgroundColor: COLORS.btnbg,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalSubmitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },


  

  // ============ SELLER REVIEW BUTTON ============
  rateSellerButton: {
    backgroundColor: COLORS.btnbg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  rateSellerButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },

  // ============ SELLER REVIEW DISPLAY ============
  sellerReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellerReviewStars: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  sellerReviewMessage: {
    fontSize: 14,
    color: COLORS.headertext,
    marginTop: 4,
    lineHeight: 20,
  },
  sellerReviewCompleted: {
    fontSize: 14,
    color: COLORS.btnbg,
    fontWeight: '500',
    paddingVertical: 8,
  },

  // ============ DIVIDER ============
  divider: {
    height: 1,
    backgroundColor: COLORS.borderbottom,
    marginVertical: 16,
  },

  // ============ SELLER GROUP STYLES ============
  sellerGroup: {
    marginBottom: 16,
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 8,
    padding: 8,
  },
  sellerGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
    backgroundColor: COLORS.white,
    borderRadius: 6,
    padding: 10,
  },
  sellerGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: 8,
    flex: 1,
  },
  sellerGroupCount: {
    fontSize: 12,
    color: COLORS.headertext,
    backgroundColor: COLORS.backgroundColor,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // ============ SELLER REVIEW CONTAINER ============
  sellerReviewContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderbottom,
  },
  sellerReviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  sellerReviewSubtitle: {
    fontSize: 12,
    color: COLORS.reviewcmt,
    marginBottom: 12,
    fontStyle: 'italic',
  },

  // ============ SELLER SUBMIT BUTTON ============
  sellerSubmitButton: {
    backgroundColor: COLORS.btnbg,
  },

  // ============ ORDER HEADER ENHANCEMENTS ============
  orderHeaderLeft: {
    flex: 1,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.reviewcmt,
    marginTop: 2,
  },
  orderStatusBadge: {
    backgroundColor: COLORS.btnbg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  orderStatusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },

  // ============ PRODUCTS CONTAINER ============
  productsContainer: {
    marginTop: 4,
  },

  // ============ ADDITIONAL UTILITY STYLES ============
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  sellerIcon: {
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.reviewcmt,
    marginLeft: 4,
  },
  submittedBadge: {
    backgroundColor: COLORS.btnbg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  submittedBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },

  // ============ LOADING MORE STYLES ============
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.reviewcmt,
    marginTop: 8,
  },

  // ============ TOAST CUSTOMIZATION ============
  toastSuccess: {
    backgroundColor: COLORS.btnbg,
  },
  toastError: {
    backgroundColor: COLORS.headertext,
  },
  
});

export default styles;