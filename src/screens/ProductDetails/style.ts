import { Dimensions, StyleSheet } from 'react-native';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';
const { width, height } = Dimensions.get('window');
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    }, colorWrapper: {
        position: 'relative',
        marginRight: 10,
        marginBottom: 10,
        width: 30,
        height: 30,
        borderRadius: 20,
        overflow: 'hidden',
    },

    sizeWrapper: {
        position: 'relative',
        marginRight: 10,
        marginBottom: 10,
    },

    outOfStockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(7, 7, 7, 0.4)',
        borderWidth:3,
        borderColor:COLORS.red
    },

    sizeOutOfStockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderRadius: 5,
        backgroundColor: COLORS.red,
    },

   

    diagonalLine2: {
        position: 'absolute',
        width: '140%',
        height: 2.5,
        backgroundColor: COLORS.red,
        transform: [{ rotate: '-45deg' }],
        borderRadius: 2,
    },
    placeholderImage: {
        height: '80%',
        width: '60%',
        borderRadius: 40,
        marginBottom: verticalScale(20),
    },
    headerImage: {
        width: '100%',
        height: 320,
        backgroundColor: '#f7f7f7',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 18,
        margin: 16,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    nameandicon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primeiconContainer: {
        height: 20,
        width: 30,
        marginLeft: 20,
        alignItems: 'center',
    },
    primeicon: {
        borderRadius: 100,
        height: 25,
        width: 25,
    },
    productName: {
        fontSize: 20,
        width: "80%",
        fontWeight: 'bold',
        marginBottom: 8,
        color: COLORS.black,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: '10%',
    },
    ratingText: {
        fontSize: 15,
        color: COLORS.reviewcmt,
        marginRight: 6,
    },
    reviewText: {
        fontSize: 14,
        color: COLORS.review,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.appColor,
        marginBottom: 10,
    },
    currency: {
        fontWeight: 'normal',
        fontSize: 16,
        color: COLORS.black,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 4,
        color: COLORS.black,
        marginLeft: verticalScale(20),
    },

    detailsText: {
        fontSize: 15,
        color: COLORS.textColor,
        marginBottom: 12,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    qtyBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    qtyValue: {
        fontSize: 16,
        fontWeight: '600',
        minWidth: 24,
        textAlign: 'center',
        color: COLORS.black,
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    heartBtn: {
        marginRight: 12,
        padding: 8,
    },
    cartBtn: {
        flex: 1,
        backgroundColor: COLORS.revista || COLORS.text2,
        borderRadius: 8,
        alignItems: 'center',
        padding: 12,
        marginRight: 8,
    },
    cartBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    buyBtn: {
        backgroundColor: COLORS.btnbg || '#f7c948',
        borderRadius: 8,
        alignItems: 'center',
        padding: 12,
        minWidth: 90,
    },
    buyBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    bottomBarUnderline: {
        height: 1,
        backgroundColor: '#eee',
        width: '100%',
    },
    similarCard: {
        width: 130,
        marginRight: 12,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        marginLeft: verticalScale(20),
        marginBottom: verticalScale(20),
    },
    similarImage: {
        width: 90,
        height: 90,
        borderRadius: 6,
        marginBottom: 6,
        backgroundColor: '#f1f1f1',
    },
    similarName: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.redblack,
        marginBottom: 2,
        textAlign: 'center',
    },
    similarPrice: {
        fontSize: 13,
        color: COLORS.undline,
        fontWeight: 'bold',
    },
    // Header Styles
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.bckbtn,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: COLORS.bckbtn,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },

    // Image Styles
    mainImage: {
        width: width,
        height: 300,
    },
    lazyImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 38,
    },
    lazyImageLoader: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 10,
    },
    zoomableImageContainer: {
        width: '100%',
        height: width * 0.9,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
    },
    zoomableImage: {
        width: '100%',
        height: '100%',
    },

    // Price Section Styles
    priceContainer: {
        marginTop: 10,
    },
    discountPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    discountPrice: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 20,
    },
    originalPriceContainer: {
        marginHorizontal: 9,
        flexDirection: 'row',
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: 'gray',
        fontSize: 15,
    },
    originalPriceNoDiscount: {
        color: COLORS.appColor,
        fontWeight: 'bold',
        fontSize: 20,
    },
    discountBadge: {
        marginLeft: 16,
        color: '#e63946',
        fontWeight: 'bold',
    },
    subscribeMessage: {
        fontSize: 12,
        color: COLORS.headertext,
        textAlign: 'center',
        marginTop: 4,
    },
    normalPrice: {
        color: COLORS.appColor,
        fontWeight: 'bold',
        fontSize: 20,
    },

    colorSection: {
        marginTop: 10,
    },
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6,
    },
    colorButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    sizeSection: {
        marginTop: 16,
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6,
    },
    sizeButton: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedSizeButton: {
        backgroundColor: COLORS.btnbg,
    },
    sizeButtonText: {
        fontSize: 14,
    },

    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    soldByText: {
        color: COLORS.black,
        fontSize: 16,
    },
    sellerNameText: {
        color: COLORS.text2,
        textDecorationLine: 'underline',
        fontSize: 16,
    },

    starIcon: {
        marginRight: 4,
    },
    reviewLinkText: {
        fontSize: 14,
        textDecorationLine: 'underline',
        color: COLORS.undline,
    },
    reviewButton: {
        marginLeft: 12,
        backgroundColor: COLORS.btnbg,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
    reviewButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },

    noSimilarText: {
        color: COLORS.revista2,
        marginVertical: 8,
        marginLeft: 30,
    },
    similarProductsScroll: {
        marginVertical: 8,
    },

    disabledCartButton: {
        opacity: 0.5,
    },
    outOfStockText: {
        color: COLORS.red,
    },

    imageModalContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    closeModalButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 2,
        padding: 8,
    },
    imageModalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },


    modalBackdrop: {
        flex: 1,
    },
    reviewModalContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: height * 0.55,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    reviewModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    orderText: {
        fontSize: 14,
        color: COLORS.review,
        marginBottom: 16,
    },
    starsRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    starIconModal: {
        marginHorizontal: 2,
    },
    commentInput: {
        width: '100%',
        minHeight: 70,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.halfmodal,
        padding: 10,
        marginBottom: 18,
        textAlignVertical: 'top',
        fontSize: 15,
        backgroundColor: COLORS.halfmodal,
    },
    submitReviewButton: {
        backgroundColor: COLORS.btnbg,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 8,
    },
    submitReviewButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },

    reviewsModalContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: height * 0.55,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    reviewsModalHeader: {
        alignItems: 'center',
        marginBottom: 10,
    },
    modalHandle: {
        width: 40,
        height: 5,
        backgroundColor: COLORS.halfmodal,
        borderRadius: 2.5,
        marginBottom: 10,
    },
    reviewsModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    reviewsScrollView: {
        flex: 1,
    },
    noReviewsText: {
        textAlign: 'center',
        marginTop: 30,
        color: COLORS.review,
    },
    reviewCard: {
        backgroundColor: COLORS.halfmodal,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.halfmodal,
    },
    reviewUserInfo: {
        marginLeft: 12,
    },
    reviewUserName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: COLORS.black,
    },
    reviewStars: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    reviewStarIcon: {
        marginRight: 2,
    },
    reviewCommentText: {
        marginTop: 6,
        fontSize: 15,
        color: COLORS.reviewcmt,
    },
});
export default style;
