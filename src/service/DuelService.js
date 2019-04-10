export class DuelService {
  async find(id) {
    return Promise.resolve({ id, message: 'blah' });
  }
};

export default DuelService;