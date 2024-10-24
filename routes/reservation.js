const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  reserveBook,
  getAllReservations,
  getReservation,
  updateReservation,
  deleteReservation,
} = require('../controllers/reservation');
// const { protect } = require('../controllers/authController'); // Assuming you have an authController with a protect middleware

const router = express.Router();

router.post('/reserve',authMiddleware.protectRoute, reserveBook);
router.get('/', authMiddleware.protectRoute,  getAllReservations);
router.get('/:id', authMiddleware.protectRoute, getReservation);
router.patch('/:id',authMiddleware.protectRoute, updateReservation);
router.delete('/:id',authMiddleware.protectRoute, deleteReservation);

module.exports = router;