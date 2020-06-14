import api from '../api';

export const saveMemory = (request: any) => {
  api.post('memory', request);
};
