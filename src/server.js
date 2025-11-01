const express = require('express');
const app = express();

const authRoutes = require('./routes/jwtAuth');
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
