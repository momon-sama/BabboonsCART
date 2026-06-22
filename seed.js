// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  { name: 'Classic Denim Jacket', price: 400, category: 'jackets', image: 'https://picsum.photos/seed/jacket/400/400', description: 'A timeless denim jacket for every season.' },
  { name: 'Elegant Floral Dress', price: 220, category: 'dresses', image: 'https://picsum.photos/seed/dress/400/400', description: 'Flowy and elegant floral dress.' },
  { name: 'Comfortable Hoodie', price: 650, category: 'hoodies', image: 'https://picsum.photos/seed/hoodie/400/400', description: 'Soft and cozy hoodie for casual wear.' },
  { name: 'Slim Fit Chinos', price: 450, category: 'pants', image: 'https://picsum.photos/seed/chinos/400/400', description: 'Stylish slim fit chinos.' },
  { name: 'Striped T-Shirt', price: 350, category: 'tshirts', image: 'https://picsum.photos/seed/tshirt/400/400', description: 'Classic striped t-shirt, breathable cotton.' },
  { name: 'Winter Wool Coat', price: 780, category: 'coats', image: 'https://picsum.photos/seed/coat/400/400', description: 'Warm and stylish wool coat.' },
  { name: 'Sporty Sneakers', price: 1499, category: 'shoes', image: 'https://picsum.photos/seed/sneakers/400/400', description: 'Comfortable and trendy sneakers.' },
  { name: 'Boho Maxi Skirt', price: 455, category: 'skirts', image: 'https://picsum.photos/seed/skirt/400/400', description: 'Lightweight boho maxi skirt.' }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Inserted ${products.length} products.`);

  const adminEmail = 'admin@babboonscart.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'admin1234',
      role: 'admin'
    });
    console.log(`Admin user created: ${adminEmail} / admin1234`);
  } else {
    console.log('Admin user already exists.');
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
