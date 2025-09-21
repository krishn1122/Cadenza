import express from 'express';
import {
  getAllPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson
} from '../controllers/person';

const router = express.Router();

// GET /api/people - Get all people with search
router.get('/', getAllPeople as any);

// GET /api/people/:id - Get a single person
router.get('/:id', getPersonById as any);

// POST /api/people - Create a new person
router.post('/', createPerson as any);

// PUT /api/people/:id - Update a person
router.put('/:id', updatePerson as any);

// DELETE /api/people/:id - Delete a person
router.delete('/:id', deletePerson as any);

export default router;
