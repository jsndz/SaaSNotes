const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const { tenantId } = req.user;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        notes: true
      }
    });

    if (tenant.subscription === 'free' && tenant.notes.length >= 3) {
      return res.status(403).json({
        success: false,
        message: 'Free plan allows maximum 3 notes. Please upgrade to Pro plan.'
      });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content: content || '',
        userId: req.user.id,
        tenantId
      }
    });

    res.status(201).json({
      success: true,
      data: note
    });

  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { tenantId } = req.user;

    const notes = await prisma.note.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: notes
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const note = await prisma.note.findFirst({
      where: { 
        id,
        tenantId 
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: note
    });

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const { tenantId } = req.user;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const existingNote = await prisma.note.findFirst({
      where: { 
        id,
        tenantId
      }
    });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    const note = await prisma.note.update({
      where: { id },
      data: {
        title,
        content: content || ''
      }
    });

    res.json({
      success: true,
      data: note
    });

  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const existingNote = await prisma.note.findFirst({
      where: { 
        id,
        tenantId
      }
    });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    await prisma.note.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;