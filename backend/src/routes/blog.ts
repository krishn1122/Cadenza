import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  getBlogsByCategory,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
  getPinnedBlogs,
  togglePinned
} from '../controllers/blog';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/pinned', getPinnedBlogs); // Get pinned posts for dashboard
router.get('/category/:category', getBlogsByCategory);
router.get('/:id', getBlogById);

// Protected routes (admin only)
router.post('/', authenticateToken, createBlog);
router.put('/:id', authenticateToken, updateBlog);
router.put('/:id/pin', authenticateToken, togglePinned); // Toggle pin status
router.delete('/:id', authenticateToken, deleteBlog);
router.get('/admin/all', authenticateToken, getAllBlogsAdmin);

export default router;
