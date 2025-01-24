import express from 'express';
import {
    addFgItem,
    getCutOutItems,
    getFgItems
} from '../controllers/itemController.js';

const router = express.Router();

// router.get('/cut-out' , getCutOutItems);
router.get('/cut-out/:bno', getCutOutItems);

router.get('/fg', getFgItems);
router.post('/addItem', addFgItem);

export default router;