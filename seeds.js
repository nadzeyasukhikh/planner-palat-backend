const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./config'); // Путь к файлу конфигурации Sequelize
const Category = require('./models/category'); // Путь к модели Category

const initialCategories = [
  { name: 'breakfast', imageUrl: '/uploads/breakfast.jpg' },
  { name: 'lunch', imageUrl: '/uploads/lunch.jpg' },
  { name: 'dinner', imageUrl: '/uploads/dinner.jpg' },
  { name: 'dessert', imageUrl: '/uploads/dessert.jpg' },
  { name: 'snacks', imageUrl: '/uploads/snacks.jpg' }
  
];

async function seedDatabase() {
  await sequelize.sync({ force: false }); 

  
  for (const category of initialCategories) {
    await Category.create(category);
  }

  console.log('Категории успешно добавлены в базу данных');
}

seedDatabase();
