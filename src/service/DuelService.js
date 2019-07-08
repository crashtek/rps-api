import uuid from 'uuid';
import mongo from 'mongodb';
import logger from '../logger';
import MessageQueueService from './MessageQueueService';

class DuelService {
  constructor() {
    this.message = 'not implemented';
    this.db = null;
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
    const db = await this.getDb();
    logger.info(`${this.message}`);
    const duel = {
      id: uuid.v4(),
      warriors: [opponent1, opponent2]
    };
    await db.insertOne(duel);
    // return the duel to the user
    return duel;
  }

  async getDb() {
    if (this.db !== null) return this.db;

    const client = await mongo.MongoClient.connect(process.env.MONGO_URI);
    const db = await client.db('rps');
    this.db = await db.collection('duels');
    return this.db;
  }
}


export default DuelService;
