import express from 'express';
import { createReview, deleteReview, getReviewByGigId } from '../controller/review.controller.js';
import { verifyToken } from '../middleware/jwt.js';

const router = express.Router();

router.post('/', verifyToken,createReview)
router.get('/:gigId', getReviewByGigId)
router.delete('/:id', verifyToken ,deleteReview)

export {router as reviewRouter}