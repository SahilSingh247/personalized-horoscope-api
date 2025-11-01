const express = require('express');
const app = express();

const authRoutes = require('./routes/jwtAuth');
const rateLimit = require('./middleware/ratelimit');
const horoscopeRoutes = require('./routes/horoscopeRoutes');
const authenticateToken = require('./middleware/authToken');
app.use(express.json());

app.use('/api', rateLimit, authRoutes);
app.use('/api/horoscope', authenticateToken, horoscopeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
