const express = require('express');
const app = express();


const Category = require('./models/category');

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

const Recipe = require('./models/recipe'); // Импорт модели рецепта

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [{ model: Category }] // Включение категорий
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/recipes', upload.single('image'), async (req, res) => {
    try {
      const { title, recipeText, categoryId } = req.body;
      const imageUrl = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;
  
      const recipe = await Recipe.create({ 
        title, 
        recipeText, 
        imageUrl,
        categoryId // Связь с категорией
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
  const multer = require('multer');

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/'); // Папка для сохранения файлов
    },
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Формирование имени файла
    }
  });
  
  const upload = multer({ storage: storage });


  app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('Ошибка: файл не загружен.');
    }
  
    // URL файла (зависит от вашей конфигурации сервера)
    const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  
    // Логика сохранения URL в базу данных (зависит от вашей схемы БД)
  
    res.json({ message: 'Файл успешно загружен', imageUrl: fileUrl });
  });

  sequelize.query("SELECT NOW()")
  .then(([results, metadata]) => {
    console.log('Time in DB:', results);
  })
  .catch(err => {
    console.error('Error during query execution:', err);
  });

  const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});