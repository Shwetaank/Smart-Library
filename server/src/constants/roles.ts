export const Roles = {
  USER: 'USER',
  LIBRARIAN: 'LIBRARIAN',
  ADMIN: 'ADMIN',
} as const;

export type RoleName = (typeof Roles)[keyof typeof Roles];
