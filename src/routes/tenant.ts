import express from 'express';
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import logger from '../config/logger';
import authenticate from '../middlwares/authenticate';
import { canAccess } from '../middlwares/canAccess';
import { Roles } from '../constants';
import { Admin } from 'typeorm';

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

const Bholes = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  MANAGER: 'manager',
};

router.post('/', authenticate, (req, res, next) => {
  tenantController.create(req, res, next);
});

router.get('/', (req, res, next) => {
  tenantController.get(req, res, next);
});

export default router;
