import { z } from 'zod';

export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  module: z.string(),
});

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  permissions: z.record(z.record(z.boolean())),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;

export const AVAILABLE_PERMISSIONS = {
  candidates: {
    view: 'View candidates',
    create: 'Create candidates',
    edit: 'Edit candidates',
    delete: 'Delete candidates',
  },
  jobs: {
    view: 'View jobs',
    create: 'Create jobs',
    edit: 'Edit jobs',
    delete: 'Delete jobs',
  },
  clients: {
    view: 'View clients',
    create: 'Create clients',
    edit: 'Edit clients',
    delete: 'Delete clients',
  },
  team: {
    view: 'View team members',
    create: 'Invite team members',
    edit: 'Edit team members',
    delete: 'Remove team members',
  },
  settings: {
    view: 'View settings',
    manage: 'Manage settings',
  },
} as const;
