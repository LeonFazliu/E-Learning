const express = require('express');
const teacherController = require('../controllers/teacherController');
const router = express.Router();

// Routes
router.get('/dashboard', teacherController.getUserCourses);
router.post('/course/new', teacherController.createCourse);
router.get('/course/:id/edit', teacherController.showEditCourseForm);
router.post('/course/:id/edit', teacherController.updateCourse);
router.post('/course/:id/delete', teacherController.deleteCourse);

module.exports = router;
