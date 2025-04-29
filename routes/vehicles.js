const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login');
};

// Get all vehicles
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ user: req.user._id });
        res.render('vehicles/index', { vehicles });
    } catch (err) {
        req.flash('error_msg', 'Error fetching vehicles');
        res.redirect('/');
    }
});

// Show form to create new vehicle
router.get('/new', isAuthenticated, (req, res) => {
    res.render('vehicles/new');
});

// Create new vehicle
router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { vehicleName, price, desc, brand } = req.body;
        const vehicle = new Vehicle({
            vehicleName,
            price,
            image: req.file ? '/uploads/' + req.file.filename : '',
            desc,
            brand,
            user: req.user._id
        });
        await vehicle.save();
        req.flash('success_msg', 'Vehicle added successfully');
        res.redirect('/vehicles');
    } catch (err) {
        req.flash('error_msg', 'Error adding vehicle');
        res.redirect('/vehicles/new');
    }
});

// Show single vehicle
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, user: req.user._id });
        if (!vehicle) {
            req.flash('error_msg', 'Vehicle not found');
            return res.redirect('/vehicles');
        }
        res.render('vehicles/show', { vehicle });
    } catch (err) {
        req.flash('error_msg', 'Error fetching vehicle');
        res.redirect('/vehicles');
    }
});

// Show edit form
router.get('/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, user: req.user._id });
        if (!vehicle) {
            req.flash('error_msg', 'Vehicle not found');
            return res.redirect('/vehicles');
        }
        res.render('vehicles/edit', { vehicle });
    } catch (err) {
        req.flash('error_msg', 'Error fetching vehicle');
        res.redirect('/vehicles');
    }
});

// Update vehicle
router.put('/:id', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { price, desc, brand } = req.body;
        const updateData = {
            price,
            desc,
            brand
        };
        if (req.file) {
            updateData.image = '/uploads/' + req.file.filename;
        }
        await Vehicle.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            updateData,
            { new: true }
        );
        req.flash('success_msg', 'Vehicle updated successfully');
        res.redirect('/vehicles');
    } catch (err) {
        req.flash('error_msg', 'Error updating vehicle');
        res.redirect(`/vehicles/${req.params.id}/edit`);
    }
});

// Delete vehicle
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        await Vehicle.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        req.flash('success_msg', 'Vehicle deleted successfully');
        res.redirect('/vehicles');
    } catch (err) {
        req.flash('error_msg', 'Error deleting vehicle');
        res.redirect('/vehicles');
    }
});

module.exports = router; 