export type CollectionPhase =
  | "private_access"
  | "private_purchase"
  | "public"
  | "sold_out";

export type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  detailDescription: string;
  coverImage: string;
  images: string[];
  totalPieces: number;
  collectionPhase: CollectionPhase;
};

export const products: Product[] = [
  {
    id: "crimson-rose",
    name: "Crimson Rose",
    type: "Lace-up Co-ord Set",
    price: 30000,

    description:
      "A lace-up sculpted co-ord set crafted in luminous dual-tone satin.",

    detailDescription: `
Crimson Rose is crafted from luxurious dual-tone satin that shifts gracefully between rich crimson and deep plum as it catches the light. Designed with a structured lace-up silhouette, the co-ord set balances sculptural tailoring with fluid elegance, creating a refined statement.

Every detail reflects precision craftsmanship—from the clean construction to the lustrous finish of the satin. Produced in strictly limited quantities, Crimson Rose embodies AVENOR's philosophy of quiet luxury, timeless design, and enduring sophistication.
    `,

    coverImage:
      "/products/crimson-rose/cover.jpg",

    images: [
      "/products/crimson-rose/1.jpg",
      "/products/crimson-rose/2.jpg",
      "/products/crimson-rose/3-v2.jpg",
      "/products/crimson-rose/4.jpg",
      "/products/crimson-rose/5.jpg",
      "/products/crimson-rose/6.jpg",
      "/products/crimson-rose/7.jpg",
      "/products/crimson-rose/8.jpg",
    ],

    totalPieces: 1,

    collectionPhase:
      "private_access",
  },

  {
    id: "ivory-blush",
    name: "Ivory Blush",
    type: "Dusty Gold Floral Embroidered Gown",
    price: 50000,

    description:
      "A dusty gold floral embroidered gown designed for timeless elegance.",

    detailDescription: `
Ivory Blush is an expression of refined femininity, crafted in a soft dusty gold palette adorned with intricate floral embroidery. Delicate embellishments catch the light with subtle brilliance, while the graceful silhouette creates an effortless sense of movement and sophistication.

Every gown is meticulously constructed with exceptional attention to detail, celebrating the artistry of fine craftsmanship. Produced in limited quantities, Ivory Blush reflects AVENOR's commitment to exclusivity, quiet luxury, and contemporary elegance.
    `,

    coverImage:
      "/products/ivory-blush/cover.jpg",

    images: [
      "/products/ivory-blush/1.jpg",
      "/products/ivory-blush/2.jpg",
      "/products/ivory-blush/3.jpg",
      "/products/ivory-blush/4.jpg",
      "/products/ivory-blush/5.JPG",
      "/products/ivory-blush/6.jpg",
      "/products/ivory-blush/7.jpg",
      "/products/ivory-blush/8.jpg",
    ],

    totalPieces: 5,

    collectionPhase:
      "private_access",
  },

  {
    id: "blue-crystal",
    name: "Blue Crystal",
    type: "Embroidered Mini Dress",
    price: 33000,

    description:
      "An intricately embroidered mini dress designed with a luminous crystal-like finish.",

    detailDescription: `
Blue Crystal is a refined expression of contemporary glamour, crafted as an intricately embroidered mini dress with a luminous, jewel-like character. The delicate detailing catches the light with subtle brilliance, creating a silhouette that feels both striking and effortlessly elegant.

Every detail is thoughtfully finished to celebrate the artistry of fine craftsmanship. Produced in limited quantities, Blue Crystal embodies AVENOR's philosophy of quiet luxury, individuality, and contemporary sophistication.
    `,

    coverImage:
      "/products/blue-crystal/cover.JPG",

    images: [
      "/products/blue-crystal/1.JPG",
      "/products/blue-crystal/2.JPG",
      "/products/blue-crystal/3.jpg",
    ],

    totalPieces: 3,

    collectionPhase:
      "private_access",
  },

  {
    id: "sunset-lilac",
    name: "Sunset Lilac",
    type: "Embroidered Mini Dress",
    price: 25000,

    description:
      "A softly luminous embroidered mini dress blending dusky lilac tones with delicate embellishment.",

    detailDescription: `
Sunset Lilac is a romantic expression of contemporary elegance, crafted in a delicate lilac-toned fabric with intricate embroidery and subtle shimmering embellishments. The softly luminous palette evokes the quiet warmth of a sunset, while the sculpted mini silhouette creates a refined and feminine presence.

Every detail is thoughtfully finished to celebrate the artistry of fine craftsmanship. Produced in limited quantities, Sunset Lilac embodies AVENOR's philosophy of quiet luxury, individuality, and effortless sophistication.
    `,

    coverImage:
      "/products/sunset-lilac/cover.jpg",

    images: [
      "/products/sunset-lilac/1.jpg",
      "/products/sunset-lilac/2.jpg",
      "/products/sunset-lilac/3.JPG",
    ],

    totalPieces: 7,

    collectionPhase:
      "private_access",
  },
];
