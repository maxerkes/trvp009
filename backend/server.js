const express = require('express');
const mysql = require('mysql2/promise'); // Use the promise-based API
const cors = require('cors');

// Create the Express app
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',       // Database host
  user: 'root',            // Database username
  password: '100391qwE!',  // Database password
  database: 'Sklad',       // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
pool.getConnection()
  .then((connection) => {
    console.log('Подключение к базе данных успешно!');
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error('Ошибка подключения к базе данных:', err);
    process.exit(1); // Exit the application if the connection fails
  });

// Route to check if the server is running
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

// ---------- Get all suppliers and blanks ----------

app.get('/Suppliers', async (req, res) => {
  const sql = `
    SELECT 
      r.supplier_id,
      r.supplier_name,
      DATE_FORMAT(r.supplier_date, '%d/%m/%Y') AS supplier_date,
      b.blank_id,
      b.material_name,
      b.part_name
    FROM Suppliers r
    LEFT JOIN Supply_Blanks ib ON r.supplier_id = ib.supplier_id
    LEFT JOIN Blanks b ON ib.blank_id = b.blank_id
    ORDER BY r.supplier_id, b.blank_id;
  `;

  try {
    const [results] = await pool.query(sql);

    const Suppliers = {};

    results.forEach((row) => {
      const { supplier_id, supplier_name, supplier_date, blank_id, material_name, part_name } = row;

      if (!Suppliers[supplier_id]) {
        Suppliers[supplier_id] = {
          supplier_id,
          supplier_name,
          supplier_date,
          Blanks: [],
        };
      }

      if (blank_id) {
        Suppliers[supplier_id].Blanks.push({
          blank_id,
          material_name,
          part_name,
        });
      }
    });

    const response = Object.values(Suppliers);
    res.json(response);
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    res.status(500).json({ error: 'Ошибка при получении данных', details: err.message });
  }
});

// ---------- Add a supplier ----------

app.post('/Suppliers/add', async (req, res) => {
  const { supplier_name, supplier_date } = req.body;

  try {
    // Convert the DD/MM/YYYY format to a JavaScript Date object
    const [day, month, year] = supplier_date.split('/');
    const mysqlDate = new Date(`${year}-${month}-${day}`);
    const currentDate = new Date();

    // Date verification
    if (mysqlDate < currentDate) {
      console.error('Дата заказа не может быть меньше текущей');
      return res.status(400).json({ error: 'Дата заказа не может быть меньше текущей' });
    }

    // Check for duplicate supplier
    const [existingSuppliers] = await pool.query(
      'SELECT * FROM Suppliers WHERE supplier_name = ? AND supplier_date = ?',
      [supplier_name, supplier_date]
    );

    if (existingSuppliers.length > 0) {
      console.error('Поставщик с таким именем и датой уже существует');
      return res.status(400).json({ error: 'Поставщик с таким именем и датой уже существует' });
    }

    // Insert the new supplier
    const sql = `
      INSERT INTO Suppliers (supplier_name, supplier_date)
      VALUES (?, ?);
    `;

    const [result] = await pool.query(sql, [supplier_name, supplier_date]);

    res.status(201).json({
      message: 'Заказчик успешно добавлен.',
      supplier_id: result.insertId,
    });
  } catch (err) {
    console.error('Ошибка при добавлении заказчика:', err);
    res.status(500).json({ error: 'Ошибка при добавлении заказчика', details: err.message });
  }
});

// ---------- Delete a supplier ----------

app.delete('/Suppliers/delete/:supplier_id', async (req, res) => {
  const { supplier_id } = req.params;

  const sql = `
    DELETE FROM Suppliers
    WHERE supplier_id = ?;
  `;

  try {
    const [result] = await pool.query(sql, [supplier_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Читатель с указанным ID не найден.' });
    }

    res.json({
      message: 'Читатель успешно удалён.',
      supplier_id: supplier_id,
    });
  } catch (err) {
    console.error('Ошибка при удалении поставщика:', err);
    res.status(500).json({ error: 'Ошибка при удалении поставщика', details: err.message });
  }
});

// ---------- Edit a supplier ----------

app.put('/Suppliers/edit/:supplier_id', async (req, res) => {
  const { supplier_id } = req.params;
  const { supplier_name } = req.body;

  if (!supplier_name) {
    return res.status(400).json({ error: 'Полное имя читателя обязательно для обновления.' });
  }

  const sql = `
    UPDATE Suppliers
    SET supplier_name = ?
    WHERE supplier_id = ?;
  `;

  try {
    const [result] = await pool.query(sql, [supplier_name, supplier_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Заказчик с указанным ID не найден.' });
    }

    res.json({
      message: 'Заказчик успешно обновлён.',
      supplier_id: supplier_id,
      updated_supplier_name: supplier_name,
    });
  } catch (err) {
    console.error('Ошибка при обновлении заказчика:', err);
    res.status(500).json({ error: 'Ошибка при обновлении заказчика', details: err.message });
  }
});

// ---------- Get all blanks ----------

app.get('/Blanks', async (req, res) => {
  const sql = `SELECT * FROM Blanks;`;

  try {
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    res.status(500).json({ error: 'Ошибка при получении данных', details: err.message });
  }
});

// ---------- Add a blank ----------

app.post('/Blanks/add', async (req, res) => {
  const { material_name, part_name, total_quantity } = req.body;

  const sql = `
    INSERT INTO Blanks (material_name, part_name, total_quantity)
    VALUES (?, ?, ?);
  `;

  try {
    const [result] = await pool.query(sql, [material_name, part_name, parseInt(total_quantity)]);
    res.status(201).json({ message: 'Заготовка успешно добавлена', blank_id: result.insertId });
  } catch (err) {
    console.error('Ошибка при добавлении заготовки:', err);
    res.status(500).json({ error: 'Ошибка при добавлении заготовки', details: err.message });
  }
});

// ---------- Edit a blank ----------

app.put('/Blanks/edit/:blank_id', async (req, res) => {
  const { blank_id } = req.params;
  const { material_name, part_name, total_quantity } = req.body;

  const sql = `
    UPDATE Blanks
    SET material_name = ?, part_name = ?, total_quantity = ?
    WHERE blank_id = ?;
  `;

  try {
    const [result] = await pool.query(sql, [material_name, part_name, parseInt(total_quantity), blank_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Заготовка с указанным ID не найдена.' });
    }

    res.status(200).json({ message: 'Заготовка успешно обновлена.' });
  } catch (err) {
    console.error('Ошибка при обновлении данных о заготовке:', err);
    res.status(500).json({ error: 'Ошибка при обновлении данных о заготовке', details: err.message });
  }
});

// ---------- Report a supply ----------

app.post('/supply-blank', async (req, res) => {
  const { supplier_id, blank_id } = req.body;

  try {
    const [results] = await pool.query('SELECT total_quantity FROM Blanks WHERE blank_id = ?', [blank_id]);
    const totalQuantity = results[0]?.total_quantity;

    if (!totalQuantity || totalQuantity <= 0) {
      return res.status(400).json({ error: 'Заготовка недоступна для поставки' });
    }

    await pool.query('UPDATE Blanks SET total_quantity = total_quantity - 1 WHERE blank_id = ?', [blank_id]);
    await pool.query('INSERT INTO Supply_Blanks (supplier_id, blank_id) VALUES (?, ?)', [supplier_id, blank_id]);

    res.status(200).json({ message: 'Сведения о поставке успешно заполнены' });
  } catch (err) {
    console.error('Ошибка при обработке поставки:', err);
    res.status(500).json({ error: 'Ошибка при обработке поставки', details: err.message });
  }
});

// ---------- Return a blank to the warehouse ----------

app.post('/new-blank', async (req, res) => {
  const { supplier_id, blank_id } = req.body;

  try {
    await pool.query('DELETE FROM Supply_Blanks WHERE supplier_id = ? AND blank_id = ?', [supplier_id, blank_id]);
    await pool.query('UPDATE Blanks SET total_quantity = total_quantity + 1 WHERE blank_id = ?', [blank_id]);

    res.status(200).json({ message: 'Поставка успешно заполнена' });
  } catch (err) {
    console.error('Ошибка при возврате заготовки:', err);
    res.status(500).json({ error: 'Ошибка при возврате заготовки', details: err.message });
  }
});

// ---------- Transfer a blank between suppliers ----------

app.post('/transfer-blank', async (req, res) => {
  const { supplier_id, new_supplier_id, blank_id } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE Supply_Blanks SET supplier_id = ? WHERE supplier_id = ? AND blank_id = ?',
      [new_supplier_id, supplier_id, blank_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Не найдена запись о поставке заготовки для данного человека' });
    }

    res.status(200).json({ message: 'Заготовка успешно переведена на нового поставщика' });
  } catch (err) {
    console.error('Ошибка при передаче заготовки:', err);
    res.status(500).json({ error: 'Ошибка при передаче заготовки', details: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});