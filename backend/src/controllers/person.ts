import { Request, Response } from 'express';
import { Person } from '../models';
import { Op } from 'sequelize';

// Get all people with optional search parameters
export const getAllPeople = async (req: Request, res: Response) => {
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
            { location: { [Op.iLike]: `%${search}%` } },
            { company: { [Op.iLike]: `%${search}%` } },
            { position: { [Op.iLike]: `%${search}%` } }
          ]
        }
      : {};
    
    // Get people with pagination
    const { count, rows } = await Person.findAndCountAll({
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
    console.error('Error getting people:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get a single person by ID
export const getPersonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const person = await Person.findByPk(id);
    
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found' });
    }
    
    res.status(200).json({ success: true, data: person });
  } catch (error: any) {
    console.error('Error getting person:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create a new person
export const createPerson = async (req: Request, res: Response) => {
  try {
    const person = await Person.create(req.body);
    res.status(201).json({ success: true, data: person });
  } catch (error: any) {
    console.error('Error creating person:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update a person
export const updatePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const person = await Person.findByPk(id);
    
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found' });
    }
    
    await person.update(req.body);
    
    res.status(200).json({ success: true, data: person });
  } catch (error: any) {
    console.error('Error updating person:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete a person
export const deletePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const person = await Person.findByPk(id);
    
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found' });
    }
    
    await person.destroy();
    
    res.status(200).json({ success: true, message: 'Person deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting person:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
