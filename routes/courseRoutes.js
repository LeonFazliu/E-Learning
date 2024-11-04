const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateUser, checkAdminOrTeacher } = require('../middleware/auth');
const { UserCourse } = require('../models'); // Import the UserCourse model


// Apply authenticateUser middleware to all routes in this router
router.use(authenticateUser);

// Protect the create course route
router.post('/create-course', checkAdminOrTeacher, courseController.createCourse); // No role array passed here

// Optionally protect the route to display the create course form
router.get('/create-course', checkAdminOrTeacher, (req, res) => {
    res.render('createCourse');
});

// Route to get all courses
router.get('/courses', courseController.getCourses);

router.get('/courses/:id', courseController.viewCourse);


  
// POST route to save a course
router.post('/courses/:id/save', authenticateUser, courseController.saveCourse);
router.post('/courses/:id/remove', authenticateUser, courseController.removeCourse);
router.get('/my-courses', authenticateUser, courseController.getSavedCourses);


module.exports = router;
