import express from 'express';
import { getBlogImage, getPersonImage, getCompanyImage } from '../controllers/image';

const router = express.Router();

// Routes for image retrieval
router.get('/blog/:id', getBlogImage);
router.get('/person/:id', getPersonImage);
router.get('/company/:id', getCompanyImage);

export default router;
