import {v4 as uuid} from 'uuid';

export const uid = (): string => String(uuid());
