import { Request, Response } from 'express';
import { Company } from '../models';
import { Op } from 'sequelize';

// Get all companies with optional search parameters
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const { search, limit = 10, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    // Build search condition
    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { category: { [Op.iLike]: `%${search}%` } },
            { location: { [Op.iLike]: `%${search}%` } }
          ]
        }
      : {};
    
    // Get companies with pagination
    const { count, rows } = await Company.findAndCountAll({
      where: whereCondition,
      limit: Number(limit),
      offset,
      order: [['name', 'ASC']]
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / Number(limit));
    
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error: any) {
    console.error('Error getting companies:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get a single company by ID
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id);
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    res.status(200).json({ success: true, data: company });
  } catch (error: any) {
    console.error('Error getting company:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create a new company
export const createCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (error: any) {
    console.error('Error creating company:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update a company
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id);
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    await company.update(req.body);
    
    res.status(200).json({ success: true, data: company });
  } catch (error: any) {
    console.error('Error updating company:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete a company
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id);
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    await company.destroy();
    
    res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting company:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
