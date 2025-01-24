import bcrypt from 'bcryptjs';
import database from '../config/database.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone, role } = req.body;

    const [existingUsers] = await database.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?', 
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await database.execute(
      'INSERT INTO users (username, email, password, phone, role) VALUES (?, ?, ?, ?, ?)', 
      [username, email, hashedPassword, phone, role]
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const [users] = await database.execute(
      'SELECT * FROM users WHERE username = ? AND role = ?', 
      [username, role]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { password: excludedPassword, ...userData } = user;

    res.json({ 
      message: 'Login successful', 
      user: userData 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await database.execute(
      'SELECT id, username, email, phone, role FROM users'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, role } = req.body;

    await database.execute(
      'UPDATE users SET username = ?, email = ?, phone = ?, role = ? WHERE id = ?', 
      [username, email, phone, role, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await database.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};
