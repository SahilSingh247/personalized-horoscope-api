const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../postgresql');
const { getZodiacSign } = require('../utils/getZodiac');


const signup = async (req, res) => {
  try {
    const { name, email, password, birthdate } = req.body;

    if (!name || !email || !password || !birthdate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const zodiacSign = getZodiacSign(birthdate);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, birthdate, zodiac_sign) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, zodiac_sign',
      [name, email, hashedPassword, birthdate, zodiacSign]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  signup
};