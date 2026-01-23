import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Guard against running in production
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot run seed in production! Set NODE_ENV=development to seed.');
    process.exit(1);
  }

  console.log('🌱 Starting database seed...');

  // Supprimer les données existantes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.admin.deleteMany();

  console.log('✅ Cleared existing data');

  // Images du produit SteelCat
  const productImages = [
    '/images/product1.png',
    '/images/product2.png',
    '/images/product3.png',
    '/images/product4.png',
    '/images/product5.png',
    '/images/product6.png',
  ];

  // Créer les 3 variantes du produit SteelCat
  const products = await Promise.all([
    // SteelCat 5kg
    prisma.product.create({
      data: {
        name: 'SteelCat Premium',
        description: 'Litière pour chat en acier premium, ultra-absorbante et sans odeur. Durée de vie exceptionnelle de 3 à 6 mois.',
        weight: '5kg',
        status: 'IN_STOCK',
        stock: 100,
        originalPrice: 125.00,
        currentPrice: 29.90,
        hasPromo: true,
        promoLimit: 20,
        promoSold: 0,
        images: productImages,
        featured: false,
        popular: false,
      },
    }),

    // SteelCat 10kg (Le plus populaire)
    prisma.product.create({
      data: {
        name: 'SteelCat Premium',
        description: 'Litière pour chat en acier premium, ultra-absorbante et sans odeur. Durée de vie exceptionnelle de 3 à 6 mois.',
        weight: '10kg',
        status: 'IN_STOCK',
        stock: 150,
        originalPrice: 125.00,
        currentPrice: 49.90,
        hasPromo: true,
        promoLimit: 20,
        promoSold: 0,
        images: productImages,
        featured: true,
        popular: true,
      },
    }),

    // SteelCat 15kg (Économisez 15%)
    prisma.product.create({
      data: {
        name: 'SteelCat Premium',
        description: 'Litière pour chat en acier premium, ultra-absorbante et sans odeur. Durée de vie exceptionnelle de 3 à 6 mois.',
        weight: '15kg',
        status: 'IN_STOCK',
        stock: 80,
        originalPrice: 125.00,
        currentPrice: 69.90,
        hasPromo: true,
        promoLimit: 20,
        promoSold: 0,
        images: productImages,
        featured: false,
        popular: false,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} product variants`);

  // Créer un compte admin par défaut
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.admin.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@steelcat.fr',
      name: 'Admin SteelCat',
      password: hashedPassword,
      canManageProducts: true,
      canManageOrders: true,
      canViewAnalytics: true,
    },
  });

  console.log(`✅ Created admin user: ${admin.email}`);
  console.log('   ⚠️  Please change the default password after first login!');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\nCreated products:');
  products.forEach((p) => {
    console.log(`  - ${p.name} ${p.weight}: ${p.currentPrice}€ (stock: ${p.stock})`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
