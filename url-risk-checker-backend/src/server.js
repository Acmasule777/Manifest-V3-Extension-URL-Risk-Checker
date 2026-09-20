const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const securityRoutes = require('./routes/security.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'URL Risk Checker backend is running' });
});

app.use('/api/security', securityRoutes);

app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});