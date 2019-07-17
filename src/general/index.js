import amqp from 'amqplib/callback_api';
import DuelService from '../service/DuelService';

const start = () => {
  amqp.connect(process.env.CLOUDAMQP_URL, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      const queue = 'random_duel_queue';

      channel.assertQueue(queue, {
        durable: false
      });
      channel.prefetch(2);
      console.log(' [x] Awaiting RPC requests');
      let previousMessage = null;
      channel.consume(queue, (msg) => {
        // const n = parseInt(msg.content.toString());

        console.log('looking for opponent:', msg.content.toString());

        if (previousMessage) {
          const duelService = new DuelService();
          const opponent1 = JSON.parse(msg.content.toString());
          const opponent2 = JSON.parse(previousMessage.content.toString());
          duelService.create(opponent1, opponent2)
            .then((duel) => {
              channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(duel)));
              channel.sendToQueue(previousMessage.properties.replyTo, Buffer.from(JSON.stringify(duel)));
              channel.ack(msg);
              channel.ack(previousMessage);
              previousMessage = null;
            });
        } else {
          previousMessage = msg;
        }
      });
    });
  });
};

export default start;
