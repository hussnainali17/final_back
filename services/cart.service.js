const mongoose = require('mongoose');
const express = require('express');
const Cart = require('../models/cart.model');


module.exports.createCart= async ({userId,items}) => {
    try {
        const cart = Cart.create({
            userId:userId,
            items: items || []
        })
        return cart;
    } catch (error) {
        throw new Error('Error creating cart');
    }
};
