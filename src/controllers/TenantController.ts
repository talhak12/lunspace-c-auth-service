import { NextFunction, Response } from 'express';
import { TenantService } from '../services/TenantService';
import { CreateTenantRequest } from '../types';
import { Logger } from 'winston';

export class TenantController {
  constructor(private tenantService: TenantService, private logger: Logger) {}

  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    try {
      const { name, address } = req.body;
      const tenant = await this.tenantService.create({ name, address });

      this.logger.info('Tenant has been created', { id: tenant.id });

      res.status(201).json({ id: tenant.id });
    } catch (err) {
      next(err);
    }
  }

  async get(req: CreateTenantRequest, res: Response, next: NextFunction) {
    try {
      const tenant = await this.tenantService.get();

      //console.log(JSON.stringify(tenant[0]));

      const g = JSON.stringify(tenant);
      const k = [];
      this.logger.info('Tenant has been created');

      k.push(JSON.parse(g));

      res.status(201).json(JSON.parse(g));
    } catch (err) {
      next(err);
    }
  }
}
