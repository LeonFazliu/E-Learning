const Course = require('../models/course');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Fetch all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.render('courses', { courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Create a new course with file upload handling
exports.createCourse = [
    upload.single('image'), // Handle file upload for the 'image' field
    async (req, res) => {
        const { name, description, instructor, duration, rating, videoUrl } = req.body; // Include videoUrl
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''; // Set the image URL if a file was uploaded

        try {
            // Create the course with userId set to the logged-in user's ID
            await Course.create({
                name,
                description,
                imageUrl,
                instructor,
                duration,
                rating: rating ? parseFloat(rating) : null,
                videoUrl, // Add videoUrl to the course data
                userId: req.user.id // Assign the userId to the logged-in user's ID
            });
            res.redirect('/'); // Redirect after successful creation
        } catch (error) {
            console.error('Error creating course:', error);
            res.status(500).send('Internal Server Error');
        }
    }
];


// View saved courses for a user
exports.getSavedCourses = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Course, as: 'savedCourses' }]
        });

        if (user) {
            res.render('myCourses', { courses: user.savedCourses });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching saved courses:', error);
        res.status(500).send('Internal Server Error');
    }
};

// View a single course with save status
exports.viewCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).render('404', { message: 'Course not found' });
        }

        // Fetch the user by ID instead of relying on req.user's methods
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Course, as: 'savedCourses' }]
        });

        // Check if the course is saved by the user
        const isSaved = user.savedCourses.some(savedCourse => savedCourse.id === course.id);

        res.render('courseDetail', { course, isSaved });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).render('error', { message: 'Failed to load course details' });
    }
};


// Save a course for the user
exports.saveCourse = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const course = await Course.findByPk(req.params.id);

        if (user && course) {
            await user.addSavedCourse(course);
            res.redirect('/my-courses');
        } else {
            res.status(404).send('Course or user not found');
        }
    } catch (error) {
        console.error('Error saving course:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Remove a saved course
exports.removeCourse = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const course = await Course.findByPk(req.params.id);

        if (user && course) {
            await user.removeSavedCourse(course);
            res.redirect(`/courses/${course.id}`);
        } else {
            res.status(404).send('Course or user not found');
        }
    } catch (error) {
        console.error('Error removing course:', error);
        res.status(500).send('Internal Server Error');
    }
};
