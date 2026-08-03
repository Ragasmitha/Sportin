const express = require('express');
const router = express.Router();
const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  applyToOpportunity,
  getApplicants
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getOpportunities);
router.get('/:id', getOpportunityById);
router.post('/create', protect, createOpportunity);
router.post('/apply/:id', protect, applyToOpportunity);
router.get('/applicants/:id', protect, getApplicants);

module.exports = router;