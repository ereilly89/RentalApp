const { Router } = require('express');
const bookingController = require('../controllers/bookingController')
const { requireAuth, requireTenantAuth, requireHostAuth } = require('../middleware/authMiddleware');
const router = Router();

router.get('/booking/:listing_id', requireTenantAuth, bookingController.booking_listing_get);
router.post('/booking/:listing_id', requireTenantAuth, bookingController.booking_post);
router.delete('/booking/:booking_id', requireAuth, bookingController.booking_delete);


module.exports = router;