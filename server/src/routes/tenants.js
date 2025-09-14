const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

router.post('/:slug/upgrade', requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const { tenantId } = req.user;

    const tenant = await prisma.tenant.findFirst({
      where: {
        slug,
        id: tenantId
      }
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    if (tenant.subscription === 'pro') {
      return res.status(400).json({
        success: false,
        message: 'Tenant is already on Pro plan'
      });
    }

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { subscription: 'pro' }
    });

    res.json({
      success: true,
      message: 'Tenant upgraded to Pro plan successfully',
      data: {
        tenant: {
          id: updatedTenant.id,
          name: updatedTenant.name,
          slug: updatedTenant.slug,
          subscription: updatedTenant.subscription
        }
      }
    });

  } catch (error) {
    console.error('Upgrade tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;