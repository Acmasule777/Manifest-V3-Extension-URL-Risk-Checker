const express = require('express');
const router = express.Router();
const securityController = require('../controllers/security.controller');

router.post('/check-url', securityController.checkUrl);

module.exports = router;