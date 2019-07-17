import amqp from 'amqplib';

class MessageQueueService {
  async sendMessage(queue, content, properties) {
    const channel = await this.getChannel();

    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)), properties);
  }

  async waitForMessage(queue) {
    const channel = await this.getChannel();

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(`[x] Awaiting RPC requests from ${queue}`);

    return new Promise(resolve => channel.consume(queue, msg => resolve(msg)));
  }

  async getChannel() {
    if (this.channel) return this.channel;

    if (!MessageQueueService.channel) {
      console.log(`connecting to url ${process.env.CLOUDAMQP_URL.split('@')[1]}`);
      MessageQueueService.connection = await amqp.connect(process.env.CLOUDAMQP_URL);
      MessageQueueService.channel = await MessageQueueService.connection.createChannel();
    }

    this.channel = MessageQueueService.channel;
    return this.channel;
  }
}

MessageQueueService.connection = null;
MessageQueueService.channel = null;

export default MessageQueueService;
