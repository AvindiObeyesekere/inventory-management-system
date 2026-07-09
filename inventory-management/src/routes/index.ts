import type { ComponentType } from 'react';

export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const;

export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  protected?: boolean;
  layout?: 'auth' | 'dashboard';
}
