const User = require('../models/user');

// Render the admin dashboard
exports.getDashboard = (req, res) => {
    res.render('admin/dashboard');
};

// List all users
exports.listUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('admin/users', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update a user (e.g., change role)
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findByPk(id);
        if (user) {
            user.role = role; // Set new role (e.g., 'user', 'teacher', or 'admin')
            await user.save();
            res.redirect('/admin/users');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.redirect('/admin/users');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
};
