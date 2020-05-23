import { Client, NatsError } from 'ts-nats';
import getConnection from '../src/index';

describe("Test 'Request-Reply' pattern", () => {
  let nc: Client;

  beforeAll(async () => {
    try {
      nc = await getConnection();
    } catch (err) {
      throw new Error('NATS server is disconnected');
    }
  });

  it('NATS server is connected', () => {
    nc.on('connect', nc => expect(nc).toBeTruthy());
  });

  it('When a message is published a subscriber receive the message and reploy to it', async done => {
    const subject = 'test.pub-sub';
    const message = 'Test message';
    const replyMessage = 'Reply test message';

    const service1 = await nc.subscribe(subject, (err, msg) => {
      if (err) {
        expect(err).toBeInstanceOf(NatsError);
      } else if (msg.reply) {
        nc.publish(msg.reply, replyMessage);
      }

      expect(msg.subject).toEqual(subject);
      expect(msg.data).toEqual(message);

      service1.unsubscribe();
    });

    const inbox = nc.createInbox();
    const service2 = await nc.subscribe(
      inbox,
      (err, msg) => {
        if (err) {
          expect(err).toBeInstanceOf(NatsError);
        }
        expect(msg.subject).toEqual(inbox);
        expect(msg.data).toEqual(replyMessage);

        service2.unsubscribe();
        done();
      },
      { max: 1 }
    );

    nc.publish(subject, message, inbox);
  });

  it('Request and reply using "Request-Reply Semantics"', async () => {
    const subject = 'test.pub-sub';
    const message = 'Test message';
    const replyMessage = 'Reply test message';
    let replySubject = '';

    const service1 = await nc.subscribe(subject, (err, msg) => {
      if (err) {
        expect(err).toBeInstanceOf(NatsError);
      } else if (msg.reply) {
        replySubject = msg.reply;
        nc.publish(msg.reply, replyMessage);
      }

      expect(msg.subject).toEqual(subject);
      expect(msg.data).toEqual(message);

      service1.unsubscribe();
    });

    const msg = await nc.request(subject, 1000, message);
    expect(msg.subject).toEqual(replySubject);
    expect(msg.data).toEqual(replyMessage);
    nc.close();
  });

  afterAll(async () => {
    await nc.drain();
    nc.close();
  });
});
