import { Request } from 'express';

export interface userData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterUserRequest extends Request {
  body: userData;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
  };
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface IRefreshTokenPayload {
  id: string;
}

export interface ITenant {
  name: string;
  address: string;
}

export interface CreateTenantRequest extends Request {
  body: ITenant;
}

export interface CreateUserRequest extends Request {
  body: userData;
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface UserQueryParams {
  currentPage: number;
  perPage: number;
  q: string;
  role: string;
}
