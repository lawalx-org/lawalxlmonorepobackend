export const INFRASTRUCTURE_CONSTANTS = {} as const;
export const priority = ['NONE', 'LOW', 'MEDIUM', 'HIGH'] as const;
export type Priority = (typeof priority)[number];

export const nodeType = ['PROJECT', 'PHASE', 'ACTIVITY', 'TASK'] as const;
export type NodeType = (typeof nodeType)[number];
