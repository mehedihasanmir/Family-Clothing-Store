// ============================================================================
//  পণ্যের তালিকা — PRODUCT LIST
//
//  ★ নতুন পণ্য যোগ করতে: নিচের যেকোনো একটা পণ্য কপি করে শেষে পেস্ট করুন,
//    তারপর তথ্যগুলো বদলে দিন।
//  ★ পণ্য আপডেট করতে: শুধু সেই পণ্যের তথ্য বদলান (slug একই রাখুন)।
//  ★ পণ্য মুছতে: পুরো ব্লকটা ডিলিট করুন।
//
//  বদলানোর পর টার্মিনালে লিখুন:  npm run db:seed
//  (অর্ডারের কোনো ক্ষতি হবে না — শুধু পণ্যের তালিকা আপডেট হবে)
//
//  প্রতিটি ফিল্ডের মানে:
//  ----------------------------------------------------------------
//  slug        : পণ্যের লিংক (ইংরেজিতে, ছোট হাতের, স্পেসের বদলে -)
//                ★ প্রতিটি পণ্যের slug আলাদা হতে হবে, পরে বদলাবেন না
//  nameEn      : পণ্যের নাম (ইংরেজি)
//  nameBn      : পণ্যের নাম (বাংলা)
//  descriptionEn / descriptionBn : বিবরণ (ইংরেজি / বাংলা)
//  price       : বিক্রয় মূল্য (টাকা, শুধু সংখ্যা)
//  comparePrice: আগের দাম — ডিসকাউন্ট দেখাতে (না চাইলে null)
//  category    : "men" | "women" | "kids"
//  productType : পোশাকের ধরন — src/lib/catalog.ts ফাইলের PRODUCT_TYPES
//                তালিকা থেকে id (যেমন: "panjabi", "saree", "shirt")
//  occasions   : উপলক্ষ — কমা দিয়ে একাধিক (যেমন: "eid,pohela-boishakh")
//                তালিকা: eid, pohela-boishakh, wedding, puja, winter,
//                        summer, casual, formal
//  ageGroup    : শুধু শিশুদের পণ্যে বয়স (যেমন "3-5"), বড়দের পণ্যে ""
//  sizes       : সাইজ — কমা দিয়ে (যেমন "M,L,XL")
//  colors      : রঙ — কমা দিয়ে (যেমন "Red,Blue")
//  image       : ছবির ফাইল — ছবিটা public/products/ ফোল্ডারে রাখুন
//  featured    : true হলে হোমপেজের "জনপ্রিয় পণ্য" অংশে দেখাবে
//  ----------------------------------------------------------------
// ============================================================================

export const products = [
  // ========================= পুরুষ (MEN) =========================
  {
    slug: "mens-panjabi",
    nameEn: "Men's Premium Panjabi",
    nameBn: "পুরুষদের প্রিমিয়াম পাঞ্জাবি",
    descriptionEn:
      "Elegant cotton panjabi with embroidered collar and placket. Perfect for Eid, Jummah and special occasions. Comfortable regular fit, breathable fabric.",
    descriptionBn:
      "কলার ও প্লাকেটে এমব্রয়ডারি সহ মার্জিত কটন পাঞ্জাবি। ঈদ, জুম্মা ও বিশেষ অনুষ্ঠানের জন্য উপযুক্ত। আরামদায়ক রেগুলার ফিট, বাতাস চলাচলকারী কাপড়।",
    price: 1850,
    comparePrice: 2200,
    category: "men",
    productType: "panjabi",
    occasions: "eid,pohela-boishakh,wedding",
    ageGroup: "",
    sizes: "M,L,XL,XXL",
    colors: "White,Cream,Sage Green",
    image: "/products/panjabi.jpg",
    featured: true,
  },
  {
    slug: "mens-polo-shirt",
    nameEn: "Men's Polo Shirt",
    nameBn: "পুরুষদের পোলো শার্ট",
    descriptionEn:
      "Classic pique cotton polo shirt. Smart-casual look for office or outings. Holds its shape after repeated washing.",
    descriptionBn:
      "ক্লাসিক পিকে কটন পোলো শার্ট। অফিস বা ঘোরাঘুরির জন্য স্মার্ট-ক্যাজুয়াল লুক। বারবার ধোয়ার পরেও ফিটিং নষ্ট হয় না।",
    price: 750,
    comparePrice: 900,
    category: "men",
    productType: "polo",
    occasions: "casual",
    ageGroup: "",
    sizes: "M,L,XL,XXL",
    colors: "Navy,Black,Maroon",
    image: "/products/polo.jpg",
    featured: true,
  },
  {
    slug: "mens-formal-shirt",
    nameEn: "Men's Formal Shirt",
    nameBn: "পুরুষদের ফরমাল শার্ট",
    descriptionEn:
      "Wrinkle-resistant formal shirt in premium cotton blend. Ideal for office wear and formal programs. Slim fit with full sleeves.",
    descriptionBn:
      "প্রিমিয়াম কটন ব্লেন্ডের ভাঁজ-প্রতিরোধী ফরমাল শার্ট। অফিস ও ফরমাল অনুষ্ঠানের জন্য আদর্শ। ফুল স্লিভ স্লিম ফিট।",
    price: 1150,
    comparePrice: null,
    category: "men",
    productType: "shirt",
    occasions: "formal",
    ageGroup: "",
    sizes: "M,L,XL,XXL",
    colors: "Light Blue,White,Grey",
    image: "/products/shirt.jpg",
    featured: false,
  },
  {
    slug: "mens-denim-jeans",
    nameEn: "Men's Denim Jeans",
    nameBn: "পুরুষদের ডেনিম জিন্স",
    descriptionEn:
      "Durable stretch denim jeans with a comfortable regular fit. Deep pockets and strong stitching for everyday wear.",
    descriptionBn:
      "আরামদায়ক রেগুলার ফিটের টেকসই স্ট্রেচ ডেনিম জিন্স। প্রতিদিনের ব্যবহারের জন্য গভীর পকেট ও মজবুত সেলাই।",
    price: 1450,
    comparePrice: 1700,
    category: "men",
    productType: "pant",
    occasions: "casual",
    ageGroup: "",
    sizes: "30,32,34,36",
    colors: "Dark Blue,Black",
    image: "/products/pants.jpg",
    featured: false,
  },

  // ========================= নারী (WOMEN) =========================
  {
    slug: "womens-silk-saree",
    nameEn: "Women's Silk Saree",
    nameBn: "নারীদের সিল্ক শাড়ি",
    descriptionEn:
      "Luxurious red silk saree with golden zari border. Perfect for weddings, Eid and festive occasions. Comes with matching blouse piece.",
    descriptionBn:
      "সোনালি জরি পাড়ের বিলাসবহুল লাল সিল্ক শাড়ি। বিয়ে, ঈদ ও উৎসবের জন্য উপযুক্ত। ম্যাচিং ব্লাউজ পিস সহ।",
    price: 2450,
    comparePrice: 2950,
    category: "women",
    productType: "saree",
    occasions: "wedding,eid,pohela-boishakh,puja",
    ageGroup: "",
    sizes: "Free Size",
    colors: "Red,Green,Purple",
    image: "/products/saree.jpg",
    featured: true,
  },
  {
    slug: "womens-three-piece",
    nameEn: "Women's Cotton Three-Piece",
    nameBn: "নারীদের কটন থ্রি-পিস",
    descriptionEn:
      "Unstitched printed cotton three-piece set — kameez, salwar and orna. Soft, comfortable fabric for all-day wear.",
    descriptionBn:
      "আনস্টিচড প্রিন্টেড কটন থ্রি-পিস সেট — কামিজ, সালোয়ার ও ওড়না। সারাদিন পরার জন্য নরম, আরামদায়ক কাপড়।",
    price: 1950,
    comparePrice: 2300,
    category: "women",
    productType: "three-piece",
    occasions: "eid,casual",
    ageGroup: "",
    sizes: "Unstitched",
    colors: "Sky Blue,Peach,Lavender",
    image: "/products/threepiece.jpg",
    featured: true,
  },
  {
    slug: "womens-kurti",
    nameEn: "Women's Embroidered Kurti",
    nameBn: "নারীদের এমব্রয়ডারি কুর্তি",
    descriptionEn:
      "Stylish cotton kurti with delicate embroidery. Pairs beautifully with leggings or palazzo. Great for daily and office wear.",
    descriptionBn:
      "সূক্ষ্ম এমব্রয়ডারি সহ স্টাইলিশ কটন কুর্তি। লেগিংস বা পালাজোর সাথে দারুণ মানায়। প্রতিদিন ও অফিসের জন্য চমৎকার।",
    price: 950,
    comparePrice: 1150,
    category: "women",
    productType: "kurti",
    occasions: "casual,pohela-boishakh,formal",
    ageGroup: "",
    sizes: "S,M,L,XL",
    colors: "Teal,Maroon,Mustard",
    image: "/products/kurti.jpg",
    featured: true,
  },

  // ========================= শিশু (KIDS) =========================
  {
    slug: "kids-cotton-tshirt",
    nameEn: "Kids Cotton T-Shirt",
    nameBn: "শিশুদের কটন টি-শার্ট",
    descriptionEn:
      "Soft 100% cotton t-shirt, perfect for everyday wear. Breathable fabric keeps your child comfortable in warm weather.",
    descriptionBn:
      "নরম ১০০% কটন টি-শার্ট, প্রতিদিনের ব্যবহারের জন্য উপযুক্ত। বাতাস চলাচলকারী কাপড় গরমে শিশুকে আরামে রাখে।",
    price: 450,
    comparePrice: 550,
    category: "kids",
    productType: "tshirt",
    occasions: "casual,summer",
    ageGroup: "3-5",
    sizes: "S,M,L",
    colors: "Blue,Red,Green",
    image: "/products/tshirt.jpg",
    featured: true,
  },
  {
    slug: "girls-party-frock",
    nameEn: "Girls Party Frock",
    nameBn: "মেয়েদের পার্টি ফ্রক",
    descriptionEn:
      "Beautiful party frock with net overlay and satin lining. Perfect for birthdays, weddings and Eid. Comfortable inner lining.",
    descriptionBn:
      "নেট ও সাটিন লাইনিং সহ সুন্দর পার্টি ফ্রক। জন্মদিন, বিয়ে ও ঈদের জন্য উপযুক্ত। ভিতরে আরামদায়ক লাইনিং।",
    price: 1250,
    comparePrice: 1500,
    category: "kids",
    productType: "frock",
    occasions: "eid,wedding",
    ageGroup: "3-5",
    sizes: "S,M,L,XL",
    colors: "Pink,Purple,Red",
    image: "/products/frock.jpg",
    featured: true,
  },
  {
    slug: "baby-romper",
    nameEn: "Baby Romper",
    nameBn: "বেবি রমপার",
    descriptionEn:
      "Super soft cotton romper for babies. Snap buttons make diaper changes easy. Gentle on sensitive baby skin.",
    descriptionBn:
      "শিশুদের জন্য অতি নরম কটন রমপার। স্ন্যাপ বোতাম থাকায় ডায়াপার বদলানো সহজ। শিশুর সংবেদনশীল ত্বকের জন্য নিরাপদ।",
    price: 550,
    comparePrice: null,
    category: "kids",
    productType: "romper",
    occasions: "casual",
    ageGroup: "0-2",
    sizes: "NB,0-6M,6-12M,12-24M",
    colors: "Yellow,White,Mint",
    image: "/products/romper.jpg",
    featured: false,
  },
  {
    slug: "kids-winter-hoodie",
    nameEn: "Kids Winter Hoodie",
    nameBn: "শিশুদের শীতের হুডি",
    descriptionEn:
      "Warm fleece-lined hoodie for winter. Front pocket and soft hood. Ideal for December-February weather in Bangladesh.",
    descriptionBn:
      "শীতের জন্য উষ্ণ ফ্লিস-লাইনযুক্ত হুডি। সামনে পকেট ও নরম হুড। বাংলাদেশের ডিসেম্বর-ফেব্রুয়ারির আবহাওয়ার জন্য আদর্শ।",
    price: 950,
    comparePrice: 1100,
    category: "kids",
    productType: "hoodie",
    occasions: "winter",
    ageGroup: "3-5",
    sizes: "S,M,L,XL",
    colors: "Grey,Navy,Maroon",
    image: "/products/hoodie.jpg",
    featured: false,
  },
  {
    slug: "girls-summer-dress",
    nameEn: "Girls Summer Dress",
    nameBn: "মেয়েদের গ্রীষ্মের ড্রেস",
    descriptionEn:
      "Light and airy summer dress in soft voile cotton. Floral print, sleeveless design keeps little ones cool in hot weather.",
    descriptionBn:
      "নরম ভয়েল কটনের হালকা গ্রীষ্মের ড্রেস। ফুলেল প্রিন্ট, হাতাকাটা ডিজাইন গরমে শিশুকে ঠান্ডা রাখে।",
    price: 650,
    comparePrice: 750,
    category: "kids",
    productType: "dress",
    occasions: "casual,summer",
    ageGroup: "0-2",
    sizes: "0-6M,6-12M,12-24M",
    colors: "Pink,Yellow",
    image: "/products/dress.jpg",
    featured: false,
  },
];
