import { Client, NatsError } from 'ts-nats';
import getConnection from '../src/index';

describe("Test 'Publish-Subscribe' pattern", () => {
  let nc: Client;
  let mockCb1: jest.Mock;
  let mockCb2: jest.Mock;

  beforeAll(async () => {
    try {
      nc = await getConnection();
    } catch (err) {
      throw new Error('NATS server is disconnected');
    }
  });

  beforeEach(() => {
    mockCb1 = jest.fn(() => Promise.resolve());
    mockCb2 = jest.fn(() => setTimeout(Promise.resolve, 0));
  });

  it('NATS server is connected', () => {
    nc.on('connect', nc => expect(nc).toBeTruthy());
  });

  it('When a message is published a subscriber receive the message', async done => {
    const subject = 'test.pub-sub';
    const message = 'Test message';

    const service = await nc.subscribe(subject, (err, msg) => {
      if (err) {
        expect(err).toBeInstanceOf(NatsError);
      } else {
        expect(msg.subject).toEqual(subject);
        expect(msg.data).toEqual(message);
      }
      service.unsubscribe();
      done();
    });

    nc.publish(subject, message);
  });

  it('When a message is published multiple subscriber receive the message', async () => {
    const subject = 'test.pub-sub';
    const message = 'Test message';

    const promise1 = new Promise(async (resolve, reject) => {
      const service1 = await nc.subscribe(subject, (err, msg) => {
        if (err) {
          expect(err).toBeInstanceOf(NatsError);
          return reject();
        } else {
          expect(msg.subject).toEqual(subject);
          expect(msg.data).toEqual(message);
        }
        service1.unsubscribe();
        resolve();
      });
    });

    const promise2 = new Promise(async (resolve, reject) => {
      const service2 = await nc.subscribe(subject, (err, msg) => {
        if (err) {
          expect(err).toBeInstanceOf(NatsError);
          return reject();
        } else {
          expect(msg.subject).toEqual(subject);
          expect(msg.data).toEqual(message);
        }
        service2.unsubscribe();
        resolve();
      });
    });

    nc.publish(subject, message);

    return Promise.all([promise1, promise2]);
  });

  it('When a message is published only subjected subscribers will receive the message', async done => {
    const subject1 = 'test.pub-sub';
    const subject2 = 'test';
    const message = 'Test message';

    const service1 = await nc.subscribe(subject1, mockCb1);
    const service2 = await nc.subscribe(subject2, mockCb2);

    nc.publish(subject1, message);

    setTimeout(() => {
      expect(mockCb1.mock.calls.length).toBeTruthy();
      expect(mockCb2.mock.calls.length).toBeFalsy();

      service1.unsubscribe();
      service2.unsubscribe();
      done();
    }, 50);
  });

  it('When a message is published only subjected with wildcard "*" subscribers will receive the message', async done => {
    const subject1 = 'test.pub-sub';
    const subject2 = 'test';
    const subjectWilcard = 'test.*';
    const message = 'Test message';

    const service1 = await nc.subscribe(subjectWilcard, mockCb1);
    const service2 = await nc.subscribe(subject2, mockCb2);

    nc.publish(subject1, message);

    setTimeout(() => {
      expect(mockCb1.mock.calls.length).toBeTruthy();
      expect(mockCb2.mock.calls.length).toBeFalsy();

      service1.unsubscribe();
      service2.unsubscribe();
      done();
    }, 50);
  });

  it('When a message is published only subjected with wildcard ">" subscribers will receive the message', async done => {
    const subject1 = 'test.pub-sub.main.topic';
    const subject2 = 'test';
    const subjectWilcard = 'test.>';
    const message = 'Test message';

    const service1 = await nc.subscribe(subjectWilcard, mockCb1);
    const service2 = await nc.subscribe(subject2, mockCb2);

    nc.publish(subject1, message);

    setTimeout(() => {
      expect(mockCb1.mock.calls.length).toBeTruthy();
      expect(mockCb2.mock.calls.length).toBeFalsy();

      service1.unsubscribe();
      service2.unsubscribe();
      done();
    }, 50);
  });

  afterAll(async () => {
    await nc.drain();
    nc.close();
  });
});
