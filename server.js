const express = require('express');
const multer = require('multer');
const app = express();
const Sequelize = require('sequelize');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const Recipe = require('./models/recipe');
const Category = require('./models/category');

// Разбор JSON тела запросов
app.use(express.json());

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,DELETE',
  credentials: true
}));

// Настройка хранения для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Подключение к базе данных
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

// Синхронизация моделей с базой данных
sequelize.sync({ force: false })
  .then(() => {
    console.log("Tables successfully created/updated");
  })
  .catch(err => {
    console.error("Error during tables creation:", err);
  });

// Маршруты для категорий
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Маршруты для рецептов
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [{ model: Category }]
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/recipes', upload.single('image'), async (req, res) => {
  try {
    const { title, recipeText, categoryName } = req.body;
    const imageUrl = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;

    const category = await Category.findOne({ where: { name: categoryName } });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const recipe = await Recipe.create({
      title,
      recipeText,
      imageUrl,
      CategoryId: category.id
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/recipes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Recipe.destroy({
      where: { id }
    });
    if (deleted) {
      res.status(204).send("Рецепт удален");
    } else {
      res.status(404).send("Рецепт не найден");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Маршрут для загрузки изображений
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Ошибка: файл не загружен.');
  }

  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ message: 'Файл успешно загружен', imageUrl: fileUrl });
});

// Сервирование статических файлов
app.use('/uploads', express.static('uploads'));

// Проверка подключения к базе данных
sequelize.query("SELECT NOW()")
  .then(([results, metadata]) => {
    console.log('Time in DB:', results);
  })
  .catch(err => {
    console.error('Error during query execution:', err);
  });

// Запуск сервера
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
