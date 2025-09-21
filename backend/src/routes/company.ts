import express from 'express';
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} from '../controllers/company';

const router = express.Router();

// GET /api/companies - Get all companies with search
router.get('/', getAllCompanies as any);

// GET /api/companies/:id - Get a single company
router.get('/:id', getCompanyById as any);

// POST /api/companies - Create a new company
router.post('/', createCompany as any);

// PUT /api/companies/:id - Update a company
router.put('/:id', updateCompany as any);

// DELETE /api/companies/:id - Delete a company
router.delete('/:id', deleteCompany as any);

export default router;
