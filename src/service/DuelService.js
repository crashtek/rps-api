import logger from '../logger';

export class DuelService {
  constructor() {
    this.message = 'not implemented';
  }

  async find(id) {
    logger.info(`${this.message}`);
    return Promise.resolve({ id, message: 'blah' });
  }
}

export default DuelService;
