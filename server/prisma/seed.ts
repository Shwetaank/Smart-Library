
import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { env } from '../src/config/env.js';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient({
  adapter: new PrismaMssql(env.databaseUrl),
});

async function main() {
  console.log('Start seeding...');

  const defaultPassword = await hashPassword('Password@123');
  const users = [
    { email: 'admin@smartlibrary.local', name: 'Admin User', role: 'ADMIN' },
    { email: 'librarian@smartlibrary.local', name: 'Library Manager', role: 'LIBRARIAN' },
    { email: 'user@smartlibrary.local', name: 'Library Member', role: 'USER' },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash: defaultPassword,
        isActive: true,
        deletedAt: null,
      },
      create: {
        externalId: user.email,
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash: defaultPassword,
      },
    });
  }

  const genres = await Promise.all(
    [
      'Science Fiction',
      'Fantasy',
      'Mystery',
      'Thriller',
      'Romance',
      'Self-Help',
      'Horror',
      'History',
    ].map((name) =>
      prisma.genre.upsert({
        where: { name },
        update: { deletedAt: null },
        create: { name },
      }),
    ),
  );

  const genreByName = Object.fromEntries(genres.map((genre) => [genre.name, genre]));

  const books = [
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '9780441013593',
      description: 'A masterpiece of science fiction.',
      publishedYear: 1965,
      genreId: genreByName['Science Fiction'].id,
      quantity: 10,
      availableCopies: 10,
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9780618260300',
      description: 'A fantasy classic.',
      publishedYear: 1937,
      genreId: genreByName.Fantasy.id,
      quantity: 15,
      availableCopies: 15,
    },
    {
      title: 'The Adventures of Sherlock Holmes',
      author: 'Arthur Conan Doyle',
      isbn: '9780140437713',
      description: 'A collection of detective stories.',
      publishedYear: 1892,
      genreId: genreByName.Mystery.id,
      quantity: 12,
      availableCopies: 12,
    },
    {
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      isbn: '9781250301697',
      description: 'A shocking psychological thriller.',
      publishedYear: 2019,
      genreId: genreByName.Thriller.id,
      quantity: 8,
      availableCopies: 8,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      description: 'A classic romance novel.',
      publishedYear: 1813,
      genreId: genreByName.Romance.id,
      quantity: 20,
      availableCopies: 20,
    },
    {
      title: 'The 7 Habits of Highly Effective People',
      author: 'Stephen R. Covey',
      isbn: '9781982137274',
      description: 'A popular self-help book.',
      publishedYear: 1989,
      genreId: genreByName['Self-Help'].id,
      quantity: 25,
      availableCopies: 25,
    },
    {
      title: 'It',
      author: 'Stephen King',
      isbn: '9781501175466',
      description: 'A horror novel by American author Stephen King.',
      publishedYear: 1986,
      genreId: genreByName.Horror.id,
      quantity: 10,
      availableCopies: 10,
    },
    {
      title: 'The Shining',
      author: 'Stephen King',
      isbn: '9780385121675',
      description: 'A horror novel by American author Stephen King.',
      publishedYear: 1977,
      genreId: genreByName.Horror.id,
      quantity: 12,
      availableCopies: 12,
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      isbn: '9780062316097',
      description: 'A book by Yuval Noah Harari, first published in Hebrew in Israel in 2011.',
      publishedYear: 2011,
      genreId: genreByName.History.id,
      quantity: 15,
      availableCopies: 15,
    },
    {
      title: 'A Game of Thrones',
      author: 'George R. R. Martin',
      isbn: '9780553103540',
      description: 'The first novel in A Song of Ice and Fire, a series of fantasy novels by American author George R. R. Martin.',
      publishedYear: 1996,
      genreId: genreByName.Fantasy.id,
      quantity: 18,
      availableCopies: 18,
    },
    {
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      isbn: '9780756404741',
      description: 'A fantasy novel by American writer Patrick Rothfuss, the first book in The Kingkiller Chronicle.',
      publishedYear: 2007,
      genreId: genreByName.Fantasy.id,
      quantity: 14,
      availableCopies: 14,
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      description: 'A dystopian social science fiction novel by English novelist George Orwell.',
      publishedYear: 1949,
      genreId: genreByName['Science Fiction'].id,
      quantity: 20,
      availableCopies: 20,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: { ...book, deletedAt: null },
      create: book,
    });
  }

  console.log('Seeding finished.');
}

try {
  await main();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
