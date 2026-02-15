import { Product, SortOption } from '../types';

/**
 * Available products in the SauceDemo store
 */
export const products = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: 29.99,
    description:
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    imagePath: '/static/media/sauce-backpack-1200x1500.0a0b85a3.jpg',
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    imagePath: '/static/media/bike-light-1200x1500.37c843b0.jpg',
  },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    description:
      'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    imagePath: '/static/media/bolt-shirt-1200x1500.c2599ac5.jpg',
  },
  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    description:
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
    imagePath: '/static/media/sauce-pullover-1200x1500.51d7ffaf.jpg',
  },
  onesie: {
    name: 'Sauce Labs Onesie',
    price: 7.99,
    description:
      "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    imagePath: '/static/media/red-onesie-1200x1500.2ec615b2.jpg',
  },
  tShirtRed: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    description:
      'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
    imagePath: '/static/media/red-tatt-1200x1500.30dadef4.jpg',
  },
};

/**
 * All products as an array
 */
export const allProducts: Product[] = Object.values(products);

/**
 * Sort options for product listing
 */
export const sortOptions = {
  nameAZ: 'az' as SortOption,
  nameZA: 'za' as SortOption,
  priceLowHigh: 'lohi' as SortOption,
  priceHighLow: 'hilo' as SortOption,
};

/**
 * Product names in alphabetical order (A-Z)
 */
export const productNamesAZ = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];

/**
 * Product names in reverse alphabetical order (Z-A)
 */
export const productNamesZA = [...productNamesAZ].reverse();

/**
 * Product prices in ascending order (Low to High)
 */
export const pricesLowToHigh = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];

/**
 * Product prices in descending order (High to Low)
 */
export const pricesHighToLow = [...pricesLowToHigh].reverse();

/**
 * Get a random product
 * @returns Random product object
 */
export function getRandomProduct(): Product {
  const productKeys = Object.keys(products);
  const randomKey = productKeys[Math.floor(Math.random() * productKeys.length)];
  return products[randomKey as keyof typeof products];
}

/**
 * Get multiple random products
 * @param count - Number of products to retrieve
 * @returns Array of random products
 */
export function getRandomProducts(count: number): Product[] {
  const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, allProducts.length));
}

/**
 * Get product by name
 * @param name - Product name
 * @returns Product object or undefined
 */
export function getProductByName(name: string): Product | undefined {
  return allProducts.find(p => p.name === name);
}

/**
 * Get cheapest product
 * @returns Product with lowest price
 */
export function getCheapestProduct(): Product {
  return products.onesie;
}

/**
 * Get most expensive product
 * @returns Product with highest price
 */
export function getMostExpensiveProduct(): Product {
  return products.fleeceJacket;
}

/**
 * Total count of available products
 */
export const TOTAL_PRODUCTS_COUNT = allProducts.length;
