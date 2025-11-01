const pool = require('../postgresql');
const { getDailyHoroscope } = require('../utils/horoscopeStore');

const getTodayHoroscope = async (req, res) => {
  try {
    const { zodiacSign, id } = req.user;
    const today = new Date().toISOString().split('T')[0];

    let result = await pool.query(
      'SELECT * FROM horoscope_history WHERE user_id = $1 AND date = $2',
      [id, today]
    );

    if (result.rows.length === 0) {
      const horoscopeText = getDailyHoroscope(zodiacSign);

      result = await pool.query(
        'INSERT INTO horoscope_history (user_id, zodiac_sign, date, horoscope_text) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, zodiacSign, today, horoscopeText]
      );
    }

    res.json({
      date: today,
      zodiacSign,
      horoscope: result.rows[0].horoscope_text
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getHoroscopeHistory = async (req, res) => {
  try {
    const { id } = req.user;

    const result = await pool.query(
      'SELECT date, zodiac_sign, horoscope_text FROM horoscope_history WHERE user_id = $1 ORDER BY date DESC LIMIT 7',
      [id]
    );

    res.json({ history: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTodayHoroscope, getHoroscopeHistory };
