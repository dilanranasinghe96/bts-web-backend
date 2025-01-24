import pool from '../config/database.js';

// export const getCutOutItems = async (req, res) => {
//   try {
//     const [results] = await pool.execute('SELECT * FROM cut_out');
//     res.json(results);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getCutOutItems = async (req, res) => {
  try {
    const { bno } = req.params;  // Get the bno from URL params

    // Query the database to find an item by bno
    const [results] = await pool.execute('SELECT * FROM cut_out WHERE bno = ?', [bno]);

    if (results.length > 0) {
      // If item is found, return the result
      res.json(results[0]);
    } else {
      // If no item is found for the given bno
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    // Return error response in case of failure
    res.status(500).json({ error: err.message });
  }
};



export const getFgItems = async (req, res) => {
  try {
    const [results] = await pool.execute('SELECT * FROM fg ORDER BY DateTime DESC');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addFgItem = async (req, res) => {
  const {
    bno, SO, Style, Style_Name, Cut_No, Colour, Size, BQty,
    Plant, Line, Damage_Pcs, Cut_Panel_Shortage, Good_Pcs,User
  } = req.body;

  const sql = `
    INSERT INTO fg (
      bno, SO, Style, Style_Name, Cut_No, Colour, Size, BQty,
      Plant, Line, Damage_Pcs, Cut_Panel_Shortage, Good_Pcs,
      DateTime, User, Year, Month, Subtraction
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, YEAR(CURRENT_DATE), MONTH(CURRENT_DATE), 0)
  `;

  const values = [
    bno, SO, Style, Style_Name, Cut_No, Colour, Size, BQty,
    Plant, Line, Damage_Pcs, Cut_Panel_Shortage, Good_Pcs,User
  ];

  try {
    const [result] = await pool.execute(sql, values);
    res.status(201).json({ 
      message: 'Item added successfully', 
      data: result 
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
};