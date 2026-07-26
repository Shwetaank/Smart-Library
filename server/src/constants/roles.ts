// Application roles used for authorization
export const Roles = {
  USER: 'USER',
  LIBRARIAN: 'LIBRARIAN',
  ADMIN: 'ADMIN',
} as const;

// Type representing all valid role values
export type RoleName = (typeof Roles)[keyof typeof Roles];
