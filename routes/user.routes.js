const express=require('express');
const router=express.Router();

const {body}=require('express-validator');
const userController=require('../controllers/user.controller');
const { authUser } = require('../middlewares/auth.middleware');

router.post('/signup',[
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.signup);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
], userController.login);

router.get('/profile', authUser,userController.getUserProfile);

router.get('/logout',authUser, userController.logout);

module.exports = router;


