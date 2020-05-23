import { Client, NatsError } from 'ts-nats';
import getConnection from '../src/index';

describe("Test 'Queue Groups' pattern", () => {
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

  it('When a message is published a subscriber group will receive the message', async () => {
    const subjectA = 'test.pub-sub.A';
    const subjectB = 'test.pub-sub.B';
    const messageA = 'Test message A';
    const messageB = 'Test message B';

    const promise1 = new Promise(async (resolve, reject) => {
      const service1 = await nc.subscribe(
        subjectA,
        (err, msg) => {
          if (err) {
            expect(err).toBeInstanceOf(NatsError);
            return reject();
          } else {
            expect(msg.subject).toEqual(subjectA);
            expect(msg.data).toContain(messageA);
          }
          service1.unsubscribe();
          resolve();
        },
        { queue: 'TestA' }
      );
    });

    const promise2 = new Promise(async (resolve, reject) => {
      const service2 = await nc.subscribe(
        subjectB,
        (err, msg) => {
          if (err) {
            expect(err).toBeInstanceOf(NatsError);
            return reject();
          } else {
            expect(msg.subject).toEqual(subjectB);
            expect(msg.data).toContain(messageB);
          }
          service2.unsubscribe();
          resolve();
        },
        { queue: 'TestB' }
      );
    });

    nc.publish(subjectA, messageA);
    nc.publish(subjectB, messageB);

    return Promise.all([promise1, promise2]);
  });

  afterAll(async () => {
    await nc.drain();
    nc.close();
  });
});
