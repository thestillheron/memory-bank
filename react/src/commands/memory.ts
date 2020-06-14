import api from '../api';
import { NewMemory } from '../model';

export const saveMemory = (request: NewMemory) => {
  api.post('memory', request);
};
