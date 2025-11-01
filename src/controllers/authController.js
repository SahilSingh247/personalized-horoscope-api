const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../postgresql');
const { getZodiacSign } = require('../utils/getZodiac');

const JWT_SECRET = 'jwt_secret_key';

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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, zodiacSign: user.zodiac_sign },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        zodiacSign: user.zodiac_sign
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  signup,
  login
};