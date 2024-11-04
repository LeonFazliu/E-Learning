const Course = require('../models/course');
const User = require('../models/user');

// Fetch courses for the logged-in user (displayed in the teacher dashboard)
exports.getUserCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const courses = await Course.findAll({ where: { userId } });
        
        res.render('teacher/teacherDashboard', { courses }); // Updated to render teacher dashboard
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Could not retrieve courses. Please try again later.');
    }
};

// Show the form for creating a new course


// Handle creating a new course
exports.createCourse = async (req, res) => {
    const { name, description, duration, rating } = req.body;

    try {
        await Course.create({
            name,
            description,
            userId: req.user.id,
            duration,
            rating: rating ? parseFloat(rating) : null,
        });
        res.redirect('/teacher/dashboard'); // Updated redirect to include /teacher
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Could not create course. Please try again later.');
    }
};

// Show the form for editing an existing course
exports.showEditCourseForm = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        
        if (!course || course.userId !== req.user.id) {
            return res.status(404).send('Course not found or you do not have permission to edit this course');
        }
        
        res.render('teacher/editCourse', { course }); // Keep rendering in the teacher directory
    } catch (error) {
        console.error('Error fetching course for editing:', error);
        res.status(500).send('Could not retrieve course for editing. Please try again later.');
    }
};

// Handle updating an existing course
exports.updateCourse = async (req, res) => {
    const { name, description, duration, rating } = req.body;

    try {
        const course = await Course.findByPk(req.params.id);
        
        if (!course || course.userId !== req.user.id) {
            return res.status(404).send('Course not found or you do not have permission to edit this course');
        }
        
        await course.update({
            name,
            description,
            duration,
            rating: rating ? parseFloat(rating) : null,
        });
        
        res.redirect('/teacher/dashboard'); // Updated redirect to include /teacher
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).send('Could not update course. Please try again later.');
    }
};

// Handle deleting a course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        
        if (!course || course.userId !== req.user.id) {
            return res.status(404).send('Course not found or you do not have permission to delete this course');
        }
        
        await course.destroy();
        res.redirect('/teacher/dashboard'); // Updated redirect to include /teacher
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send('Could not delete course. Please try again later.');
    }
};
