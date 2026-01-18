const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('./middleware/authMiddleware');
const applicationsController = require('./controllers/applicationsController'); // path stays the same

// Student creates application
router.post('/', requireAuth, applicationsController.create);

// List all user-visible applications (students see theirs; staff see all)
router.get('/', requireAuth, applicationsController.list);

// Approve/reject/advance (staff only)
router.patch('/:id/status',
  requireAuth,
  requireRole('advisor', 'hod', 'principal'),
  applicationsController.updateStatus
);



// Role-specific approved lists
// Advisor routes
router.get('/advisor/pending', requireAuth, requireRole('advisor'), applicationsController.listAdvisorPending);
router.get('/advisor/approved', requireAuth, requireRole('advisor'), applicationsController.listAdvisorApproved);
router.get('/advisor/rejected', requireAuth, requireRole('advisor'), applicationsController.listAdvisorRejected);

// HOD routes
router.get('/hod/pending', requireAuth, requireRole('hod'), applicationsController.listHODPending);
router.get('/hod/approved', requireAuth, requireRole('hod'), applicationsController.listHODApproved);
router.get('/hod/rejected', requireAuth, requireRole('hod'), applicationsController.listHODRejected);

// Principal routes
router.get('/principal/pending', requireAuth, requireRole('principal'), applicationsController.listPrincipalPending);
router.get('/principal/approved', requireAuth, requireRole('principal'), applicationsController.listPrincipalApproved);
router.get('/principal/rejected', requireAuth, requireRole('principal'), applicationsController.listPrincipalRejected);


module.exports = router;
