export const INFRASTRUCTURE_CONSTANTS = {} as const;
export const priority = ['NONE', 'LOW', 'MEDIUM', 'HIGH'] as const;
export type Priority = (typeof priority)[number];
