const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const requirePermission = require('../middlewares/rbacMiddleware');
const { getPeopleData, getCrmData, getBooksData, getDeskData } = require('../controllers/zohoController');

router.get('/people', authenticate, requirePermission('access:zoho_people'), getPeopleData);
router.get('/crm', authenticate, requirePermission('access:zoho_crm'), getCrmData);
router.get('/books', authenticate, requirePermission('access:zoho_books'), getBooksData);
router.get('/desk', authenticate, requirePermission('access:zoho_desk'), getDeskData);

module.exports = router;