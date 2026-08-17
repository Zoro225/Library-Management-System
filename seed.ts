import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

async function main() {
  console.log("Seeding database...");

  // ---- Users ----
  const adminPassword = await hash("Admin@123");
  const staffPassword = await hash("Staff@123");
  const studentPassword = await hash("Student@123");

  await prisma.user.upsert({
    where: { email: "admin@library.com" },
    update: {},
    create: {
      name: "Ava Admin",
      email: "admin@library.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@library.com" },
    update: {},
    create: {
      name: "Sam Staff",
      email: "staff@library.com",
      passwordHash: staffPassword,
      role: "STAFF",
    },
  });

  await prisma.user.upsert({
    where: { email: "student@library.com" },
    update: {},
    create: {
      name: "Stu Student",
      email: "student@library.com",
      passwordHash: studentPassword,
      role: "STUDENT",
    },
  });

  // ---- Categories ----
  const categoryNames = [
    "Action",
    "Sci-Fi",
    "Fantasy",
    "Mystery",
    "Romance",
    "Non-Fiction",
    "Biography",
    "History",
  ];
  const categories: Record<string, string> = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = cat.id;
  }

  // ---- Tags ----
  const tagNames = [
    "Bestseller",
    "Award-Winning",
    "Classic",
    "New Arrival",
    "Series",
    "Short Read",
    "Thriller",
    "Adventure",
  ];
  const tags: Record<string, string> = {};
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags[name] = tag.id;
  }

  // ---- Books ----
  const books = [
    {
      title: "The Last Horizon",
      author: "Maria Chen",
      category: "Sci-Fi",
      tags: ["Bestseller", "New Arrival"],
      description: "A gripping tale of humanity's last colony ship searching for a new home.",
      coverColor: "#2563eb",
      totalCopies: 3,
    },
    {
      title: "Shadow Protocol",
      author: "James Cole",
      category: "Action",
      tags: ["Thriller", "Series"],
      description: "An elite operative races against time to stop a global conspiracy.",
      coverColor: "#dc2626",
      totalCopies: 4,
    },
    {
      title: "The Crown of Embers",
      author: "Elena Vasquez",
      category: "Fantasy",
      tags: ["Award-Winning", "Series"],
      description: "A young mage must reclaim her throne from an ancient evil.",
      coverColor: "#7c3aed",
      totalCopies: 2,
    },
    {
      title: "Silent Witness",
      author: "Robert Hale",
      category: "Mystery",
      tags: ["Bestseller", "Thriller"],
      description: "A detective unravels a decades-old murder in a small coastal town.",
      coverColor: "#0f766e",
      totalCopies: 2,
    },
    {
      title: "Beneath a Paris Sky",
      author: "Sophie Laurent",
      category: "Romance",
      tags: ["Classic"],
      description: "Two strangers find love amid the cafes and cobblestones of Paris.",
      coverColor: "#db2777",
      totalCopies: 3,
    },
    {
      title: "Atomic Habits Revisited",
      author: "Dr. Alan Frost",
      category: "Non-Fiction",
      tags: ["Bestseller", "New Arrival"],
      description: "Practical strategies for building better habits, backed by science.",
      coverColor: "#16a34a",
      totalCopies: 5,
    },
    {
      title: "The Wright Brothers",
      author: "Nancy Byrne",
      category: "Biography",
      tags: ["Award-Winning"],
      description: "The story of the two brothers who changed the world with flight.",
      coverColor: "#ca8a04",
      totalCopies: 2,
    },
    {
      title: "Empires of Sand",
      author: "Farouk Idris",
      category: "History",
      tags: ["Classic", "Adventure"],
      description: "A sweeping account of the great desert empires of antiquity.",
      coverColor: "#a16207",
      totalCopies: 2,
    },
    {
      title: "Nebula's Edge",
      author: "Maria Chen",
      category: "Sci-Fi",
      tags: ["Series", "Adventure"],
      description: "The sequel to The Last Horizon — the colonists face a new threat.",
      coverColor: "#1d4ed8",
      totalCopies: 3,
    },
    {
      title: "Iron Vendetta",
      author: "James Cole",
      category: "Action",
      tags: ["Series", "Thriller"],
      description: "The stakes escalate in the second Shadow Protocol novel.",
      coverColor: "#b91c1c",
      totalCopies: 2,
    },
    {
      title: "Whispers of the Fae",
      author: "Elena Vasquez",
      category: "Fantasy",
      tags: ["New Arrival", "Adventure"],
      description: "A standalone fantasy adventure set in the world of Crown of Embers.",
      coverColor: "#6d28d9",
      totalCopies: 3,
    },
    {
      title: "The Quiet Alibi",
      author: "Robert Hale",
      category: "Mystery",
      tags: ["Short Read"],
      description: "A short, twisty mystery perfect for a single evening.",
      coverColor: "#115e59",
      totalCopies: 4,
    },
  ];

  for (const b of books) {
    const existing = await prisma.book.findFirst({ where: { title: b.title } });
    if (existing) continue;

    await prisma.book.create({
      data: {
        title: b.title,
        author: b.author,
        description: b.description,
        coverColor: b.coverColor,
        totalCopies: b.totalCopies,
        availableCopies: b.totalCopies,
        categoryId: categories[b.category],
        tags: {
          create: b.tags.map((t) => ({ tagId: tags[t] })),
        },
      },
    });
  }

  console.log("Seeding complete.");
  console.log("");
  console.log("Login credentials:");
  console.log("  Admin:   admin@library.com   / Admin@123");
  console.log("  Staff:   staff@library.com   / Staff@123");
  console.log("  Student: student@library.com / Student@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
