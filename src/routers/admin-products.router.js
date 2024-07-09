const express = require('express');
const {checkAdmin} = require('../middleware/auth');
const router = express.Router();
const Category = require('../models/categories.model');
router.get('/add-product',checkAdmin, async (req, res, next) => {
    try{
        const categories = await Category.find();
        res.render('admin/add-product',{
            categories
        })
    }catch(err){
        console.log(err);
        next(err);
    }
})

module.exports = router;