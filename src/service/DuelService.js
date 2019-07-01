import uuid from 'uuid';
import logger from '../logger';
import MessageQueueService from './MessageQueueService';

class DuelService {
  constructor() {
    this.message = 'not implemented';
  }

  async find(id) {
    logger.info(`${this.message}`);
    return { id, message: 'blah' };
  }

  // eslint-disable-next-line class-methods-use-this
  async join(user) {
    const msgService = new MessageQueueService();
    // Send Message to general that we want to duel
    const id = uuid.v4();

    const msgPromise = msgService.waitForMessage(id);

    await msgService.sendMessage('random_duel_queue', user, { replyTo: id });

    // wait for a response from the general
    return msgPromise.then(message => JSON.parse(message.content.toString()));
  }

  async create(opponent1, opponent2) {
    // create a new duel in the data base
    logger.info(`${this.message}`);
    // return the duel to the user
    return {
      id: 123456,
      warriors: [opponent1, opponent2]
    };
  }
}


export default DuelService;
