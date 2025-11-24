// Backend Like Me - Parte I
// Servidor Express con CORS y conexión a PostgreSQL

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Habilitar CORS
app.use(cors());
// Habilitar JSON
app.use(express.json());

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'likeme',
  password: 'Casa2020..',
  port: 5432,
});

// Ruta GET para obtener todos los posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// Ruta POST para crear un nuevo post
app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [titulo, img, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el post' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


  // Ruta PUT para actualizar los likes de un post
  app.put('/posts/:id/like', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar los likes' });
    }
  });

  // Ruta DELETE para eliminar un post
  app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'DELETE FROM posts WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
      res.json({ mensaje: 'Post eliminado correctamente', post: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el post' });
    }
  });
