import express from 'express';
import {
    getUsers,
    getUserStats,
    getUserById,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// User management routes
router.get('/', getUsers);

router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

export default router;