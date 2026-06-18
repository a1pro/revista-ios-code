

import React from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text
} from 'react-native';

import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import styles from './style';
import COLORS from '../../utils/Colors';
import { CustomText } from '../../components/CustomText';
import VectorIcon from '../../components/VectorIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;


/* ---------------- TERMS DATA ---------------- */

const termsConditions = [
  "The customer is entitled to receive a temporary device or compensation (product price ÷ 400 × number of delayed days) in case of delays in providing spare parts, maintenance, or the presence of a manufacturing defect in the product.",
  "The customer can obtain a replacement product or a refund of the purchase value after deducting the usage fee and any missing accessories if they are eligible, according to the rules and regulations of the Ministry of Commerce and Industry.**",
  "The expected lifespan of each product may vary, and the customer can refer to the product manual or contact the authorized agent for more details.",
  "We adhere to the policy of some service centers that may require you to pay a financial amount for products classified as out of warranty and if you refuse to pay for the repair cost.",
  "The warranty does not cover damages resulting from accidents, misuse, improper use, liquid spills, or other external causes.",
  "It is the customer's responsibility to ensure that the product is packaged in the original box or properly packaged to avoid any damage during shipping. Revista will not be responsible for any breakage or damage to the product in this case, and the warranty-retrieved product will be returned to the customer without maintenance"
];

const deliveryPolicy = [
  "Delivery service requires four to seven business days, and this period will not be counted from the repair duration.",
  "Customers can directly contact the warranty service providers to track the product's status or submit claims to the warranty service provider directly. All necessary information will be provided to the service providers through representatives of the warranty department at Revista.",
  "Receiving and delivery service is not considered part of the product's repair time. ** The usage fee is calculated at a rate of 5% of the product's value at the time of purchase per month, starting from the purchase date, with the value not exceeding 80% of the product's value.",
];

const warrantyProvider = [
  "Product warranty and quality assurance are provided by the authorized service center and are subject to the manufacturer's policies outlined in the product warranty guide or the manufacturer's website. To avail warranty and maintenance services, customers can directly contact the warranty service provider for the required service according to regulations and guidelines.",

  "Warranty and maintenance services provided by the authorized service center are not the responsibility of Revista. This includes spare parts availability, repair time, and service quality. It is the customer's responsibility to directly communicate with the authorized service center in case of any complaints or claims.",

  `To ensure the highest level of service, Revista provides its own warranty on certain products. For warranty details, please visit the product page on the website. This warranty only applies to products purchased within the Kingdom of Saudi Arabia ("the Kingdom"). Products or replacement parts that have been repaired will only be shipped to addresses within the Kingdom, and refunds will only be made to accounts located within the Kingdom. If the customer refuses to accept the product after completing the warranty claim process, the product will be stored in Revista  warehouse for a maximum period of thirty (30) calendar days, and the customer will not be entitled to request a product return after this period. Note: Always keep the original product box to ensure warranty service according to the terms and conditions of some maintenance centers.`,

];

const importantQuestions = [
  {
    q: "Will I be responsible for paying value-added tax (VAT) to the government?",
    a: "Revista handles all registered sellers' responsibility for paying value-added tax (VAT). Revista provides legal tax invoices to customers on behalf of the seller, which can be downloaded through the seller platform. You will also be provided with a tax invoice that includes Revista  fees for all fees and commissions deducted from you. You can use these tax invoices to claim VAT from the government. Revista will pay VAT to the government for all sales made by sellers not registered for VAT."
  },
  {
    q: "Are Revista fees and commissions inclusive of value-added tax (VAT)?",
    a: "No, Revista fees do not include value-added tax (VAT)."
  },
  {
    q: "How are my earnings transferred?",
    a: `Once sales begin on Revista, we will automatically transfer your sales revenue (after deducting fees) to your bank account on a weekly basis. You will receive a statement for each transaction, which you can find under the "Account Statement" icon in your seller dashboard.`
  },
  {
    q: "What are the shipping methods for delivering products to customers?",
    a: "Direct Delivery: The seller prepares the customer's orders, selects the products, prepares and packages them themselves before handing them over to the Revista delivery team"
  },
  {
    q: "How can I manage my seller account on Revista?",
    a: "As a registered and approved seller with Revista, you'll be able to access the seller platform that helps you sell your products and manage your store on Revista. Click Seller Loginon the following link to access your seller dashboard"
  },
  {
    q: `How will I know when I get a sale?`,
    a: `You will be notified via email whenever you receive a new order. All orders awaiting your approval will appear in the "Orders" icon on the seller platform.
  ما هي تكلفة شحن المنتجات التي أبيعها في  revista للعملاء؟
  هنا مراجعه للنسب حقت التطبيق`

  }
];

const inventory = [
  `Register: If you haven't already, sign up as a seller on the REVISTA platform.`,

  `Log in: Use your seller account credentials to log in to the REVISTA platform.`,

  `Navigate to Inventory Management: Once logged in, find the inventory management section or any similar option where you can manage your products.`,

  `Add Products: Look for an option to add new products to your inventory. You will typically need to provide details such as product name, description, images, specifications, and SKU (Stock Keeping Unit) numbers.`,

  `Upload Images: Ensure you have high-quality images of your products ready to upload. These images should showcase your products clearly and attractively.`,

  `Write Clear Descriptions: Craft clear and comprehensive descriptions for each product, highlighting key features, benefits, and specifications.`,

  `Provide Specifications: Include detailed specifications for each product, such as dimensions, materials, colors, and any other relevant information.`,

  `Set Prices: Determine the pricing for each product based on factors such as cost, competition, and market demand.`,

  `Confirm Inventory: Double-check all information and inventory quantities before confirming and saving your product listings.`,

  `Avoid Repackaging: Important note: Third-party sellers should refrain from repackaging pallets or boxes during shipping to maintain product integrity and prevent any mishandling`,
]

const packaging = [
  `Each product must have a Partner SKU, a unique identification number or code with clear transfer instructions if necessary.`,
  `Each product must have an external scannable barcode or QR code along with a user-readable code.`,
  `Each product should be placed in a secure individual package. Loose units should not be allowed.`,
  `Electronic and other high-value products should be vacuum-sealed and wrapped.`,
  `REVISTA boxes/cartons should not be used for packaging products.`,
  `Foam pads, full sheets of paper, and bubble wrap can be used as packing materials.`,
]
const ProductDescription = [
  `If products belong to different brands or types, they must be separated and packaged separately(you can only bundle products together if they are part of a composite display).`,
  `Any product sold as a set / package must be classified as "Sold as a Set".`,
  `All breakable products must have a "Fragile" label on them.`,
  `Improperly sealed packaging, reinforced caps / heat - sealed packaging, or over - packaged items will be rejected.`,
  `All cosmetics and perfumes must have distinguishing numbers.`,
  `All unauthorized products will be rejected.`,
]
const boxLevel = [
  `All products must be securely packed in a carton or box.`,
  `Each carton or box must have a label indicating its number (e.g., Carton 1, Box, etc.).`,
  `The total number of products inside each carton must be mentioned on the carton itself.`,
  `The number of cartons or boxes must be stated on each box and carton.`,
  `Expiry dates of all health, beauty, food, and beverage products must be shared with each batch.`,
  `Each carton must contain products with the same barcode and the quantity inside each carton must be mentioned on the carton containing the mentioned products.`,
]
const ASN = [
  `Total number of boxes`,
  `Total number of cartons`,
  `Total number of products`,
]
const fashionProducts = [
  `Safety labels must be removed, and sewing tags should be visible in the packaging (if there is no sewing tag, fashion products should have a label indicating size availability and product details).`,
  `All irrelevant price tags must be removed before supply.`,
  `Products of each type should have an assortment, such as size or color, with a unique barcode (for example: each set of colors and sizes of a shirt should have a unique barcode).`,
]
const ExpiryPeriods = [
  {
    title: "Product expiry periods, if applicable, should be at least one year.",
  },
  {
    title: "Products' expiry periods should be adhered to according to the following guidelines:",
    sub: [
      "Cosmetics - Remaining shelf life should be at least one year if applicable.",
      "Health and Nutrition - Remaining shelf life should be at least one year if applicable.",
      "Personal Care Products - Remaining shelf life should ideally be at least 8 months.",
      "Food and Beverages - Remaining shelf life should be at least 6 months."
    ]
  }
];
const perfumes = [
`Brand or manufacturer`,
`Fragrance name`,
`Fragrance family(e.g., floral, oriental, woody, citrus)`,
`Notes(top, middle, and base notes)`,
`Fragrance concentration(eau de parfum, eau de toilette, etc.)`,
`Bottle size(e.g., 50ml, 100ml)`,
`Packaging design`,
`Gender(for some fragrances)`,
`Occasion(daytime, evening, casual, formal)`,
`Season(summer, winter, etc.)`,
`Longevity(how long the fragrance lasts)`,
`Special features(travel - friendly, refillable, limited edition)`,
`Expiry date or shelf life`,
];
const makeup = [
`Product type(foundation, concealer, powder, blush, eyeshadow, eyeliner, mascara, lipstick, lip gloss, etc.)`,
`Brand or manufacturer`,
`Shade or color`,
`Skin type(for foundation, concealer, and powder)`,
`Texture or finish(matte, satin, shimmer, etc.)`,
`Key ingredients(e.g., vitamins, minerals)`,
`Usage instructions(how to apply, recommended tools)`,
`Longevity(how long it lasts on the skin)`,
`Special features(SPF protection, waterproof, etc.)`,
`Packaging size(e.g., 30ml foundation bottle, 5g eyeshadow palette)`,
`Expiry date or shelf life`,
];
const haircare = [
`Product type(shampoo, conditioner, hair oil, hair mask, styling product, etc.)`,
`Brand or manufacturer`,
`Hair type(dry, oily, normal, damaged, color - treated, curly, straight, etc.)`,
`Key ingredients(e.g., argan oil, keratin, coconut extract)`,
`Usage instructions(how to apply, frequency)`,
`Benefits or claims(moisturizing, repairing, volumizing, anti - frizz, etc.)`,
`Packaging size(e.g., 250ml, 500ml)`,
`Expiry date or shelf life`,
];
const skincare = [
`Product type(cleanser, moisturizer, serum, sunscreen, etc.)`,
`Brand or manufacturer`,
`Skin type(normal, oily, dry, combination, sensitive)`,
`Key ingredients(e.g., hyaluronic acid, retinol, vitamin C)`,
`Usage instructions(how to apply, frequency)`,
`Benefits or claims(hydrating, anti - aging, brightening, etc.)`,
`Packaging size(e.g., 50ml, 100ml)`,
`Expiry date or shelf life`,
];
const ToolsBrushes = [
`Type of tools(makeup brushes, hair brushes, combs, etc.)`,
`Brand or manufacturer`,
`Material(e.g., synthetic, natural hair)`,
`Purpose(e.g., foundation brush, eyeshadow brush, hair comb)`,
`Size or dimensions`,
`Special features or benefits`,
`Cleaning and maintenance instructions`,
];
const PersonalCare = [
`Product type(shampoo, conditioner, body wash, lotion, etc.)`,
`Brand or manufacturer`,
`Ingredients`,
`Usage instructions or directions`,
`Any special features or benefits`,
`Skin type or hair type suitability`,
`Expiry date or shelf life.`,
];
const HealthNutrition= [
`Product type (supplement, vitamin, protein powder, etc.)`,
`Brand or manufacturer`,
`Ingredients`,
`Nutritional information (calories, fat, protein, carbohydrates, vitamins, minerals, etc.)`,
`Serving size`,
`Usage instructions or dosage`,
`Any special features or benefits`,
`Expiry date or shelf life`,
];     
const Jewelry=[
`Type (necklace, bracelet, ring, earrings, etc.)`,
`Material (gold, silver, platinum, etc.)`,
`Gemstone (if applicable)`,
`Design or style`,
`Size or length`,
`Color`,
`Brand or designer (if any)`
];
const clothes=[
`Size (S, M, L, XL / 8, 10, 12, 14, etc.)`,
`Model`,
`Color`,
`Section`,
`All safety tags must be removed`,
];

const electronics = [
`Mobile Phones: Model Name / Model Number, Internal Memory (64GB, 256GB, etc.)`,
`Laptops and Accessories: Color, Model Name / Model Number, Internal Memory (500GB, 1TB), Storage (RAM / HDD), Screen Size, Processor (Intel / Core), Processor Type (Celeron / Core i5, etc.), Connectivity (Wireless / Bluetooth)`,
`Headphones: Color, Model Number, Connection Type (Wireless / Bluetooth / Wired), Brand Name`,
`Gaming Consoles: Model Number, Version, Size`,
`Televisions: Screen Size, Color, Model Number, Brand`,
`Home Appliances: Model Number, Color`,
`Speakers: Model Number, Color`,
`Cameras: Model Number, Color`,
`Smartwatches and Accessories: Model Number, Color, Brand`,
`Tablets: Model Number, Color, Brand`,
`E-readers and E-book Accessories: Model Number, Color, Brand`,
];


/* ---------------- REUSABLE COMPONENTS ---------------- */

const ListSection = ({ title, data }: any) => (
  <View>
    <CustomText type="heading" fontWeight="bold" style={styles.sectionTitle}>
      {title}
    </CustomText>

    {data.map((item: string, index: number) => (
      <CustomText key={index} style={styles.listText}>
        {index + 1}. {item}
      </CustomText>
    ))}
  </View>
);

const BulletSection = ({ title, data }: any) => (
  <View>
    <CustomText type="heading" fontWeight="bold" style={styles.sectionTitle}>
      {title}
    </CustomText>

    {data.map((item: string, index: number) => (
      <CustomText key={index} style={styles.listText}>
        • {item}
      </CustomText>
    ))}
  </View>
);

const ExpirySection = ({ title, data }: any) => (
  <View>
    <CustomText type="heading" fontWeight="bold" style={styles.sectionTitle}>
      {title}
    </CustomText>

    {data.map((item: any, index: number) => (
      <View key={index} style={{ marginBottom: 6 }}>
        <CustomText style={styles.listText}>• {item.title}</CustomText>

        {item.sub &&
          item.sub.map((subItem: string, subIndex: number) => (
            <CustomText
              key={subIndex}
              style={[styles.listText, { marginLeft: 20 }]}
            >
              • {subItem}
            </CustomText>
          ))}
      </View>
    ))}
  </View>
);


/* ---------------- MAIN SCREEN ---------------- */

const Terms: React.FC<Props> = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.innerContainer}>

        {/* Header */}

        <View style={styles.headerContainer}>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>

            <VectorIcon
              type="AntDesign"
              name="left"
              size={24}
              color={COLORS.textColor}
            />

          </TouchableOpacity>

          <CustomText
            type="heading"
            fontWeight="bold"
            color={COLORS.textColor}
            style={styles.title}>

            Terms & Conditions

          </CustomText>

          <View style={styles.placeholder} />

        </View>


        <ScrollView showsVerticalScrollIndicator={false}>

          <ListSection
            title="Terms and Conditions"
            data={termsConditions}
          />

          <ListSection
            title="Receiving and Delivery Policy for the Device:"
            data={deliveryPolicy}
          />

          <ListSection
            title="Warranty Service Provider"
            data={warrantyProvider}
          />


          {/* Important Questions */}

          <CustomText
            type="heading"
            fontWeight="bold"
            style={styles.sectionTitle}>

            Important Questions

          </CustomText>

          {importantQuestions.map((item, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <CustomText fontWeight="bold" style={styles.question}>
                {item.q}
              </CustomText>

              <CustomText style={styles.answer}>
                {item.a}
              </CustomText>
            </View>
          ))}

          {/* inventory to REVISTA */}
          <ListSection
            title="To add your inventory to REVISTA, follow these steps:"
            data={inventory}
          />
          <Text>By following these steps, you can effectively add your inventory to REVISTA and start selling your products to customers.</Text>

          {/* Packaging Guidelines */}
          <BulletSection
            title="REVISTA Packaging Guidelines: At the individual unit level:"
            data={packaging}
          />

          <CustomText
            type="heading"
            fontWeight="bold"
            style={styles.sectionTitle}>

            Product Name:

          </CustomText>
          <BulletSection
            title="Product Description:"
            data={ProductDescription}
          />
          <BulletSection
            title="At the carton/box level:"
            data={boxLevel}
          />
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: COLORS.appColor }}>

            In the Advance Shipping Notice (ASN) note:

          </Text>
          <BulletSection
            title="Each ASN must clearly indicate:"
            data={ASN}
          />
          <BulletSection
            title="Fashion Products:"
            data={fashionProducts}
          />

          {/* Product Expiry Table */}
          <ExpirySection
            title="Product Expiry Periods:"
            data={ExpiryPeriods}
          />
          <BulletSection
            title="Perfumes"
            data={perfumes}
          />

          <BulletSection
            title="Makeup"
            data={makeup}
          />

          <BulletSection
            title="Electronics and Mobile Devices"
            data={makeup}
          />
          <BulletSection
            title="Electronics and Mobile Devices"
            data={haircare}
          />
          <BulletSection
            title="Electronics and Mobile Devices"
            data={skincare}
          />
          <BulletSection
            title="Electronics and Mobile Devices"
            data={ToolsBrushes}
          />
          <BulletSection
            title="Electronics and Mobile Devices"
            data={PersonalCare}
          />
          <BulletSection
            title="Electronics and Mobile Devices"
            data={HealthNutrition}
          />
          <BulletSection
            title="Electronics and Mobile Devices"
            data={Jewelry}
          />
          <BulletSection
            title="Electronics and Mobile Devices"
            data={clothes}
          />
          <BulletSection
            title="Electronics and Mobile Devices"
            data={electronics}
          />


        </ScrollView>

      </View>

    </SafeAreaView>
  );
};

export default Terms;