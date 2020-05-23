import { Stan } from 'docker-streaming';
import getConnection from '../src/index';

describe("Test 'Publish-Subscribe' streaming", () => {
  let stan: Stan;

  beforeAll(() => {
    try {
      stan = getConnection('test-cluster', 'test');
    } catch (err) {
      throw new Error('NATS streaming server is disconnected');
    }
  });

  it('NATS streaming server is connected', done => {
    stan.on('connect', nc => {
      expect(nc).toBeTruthy();
      done();
    });
  });

  it('When a message is published a subscriber receive the message', done => {
    const subject = 'test.pub-sub';
    const message = 'Test message';

    const opts = stan.subscriptionOptions().setStartWithLastReceived();
    const subscription = stan.subscribe(subject, opts);
    subscription.on('message', function(msg) {
      expect(msg.getSubject()).toEqual(subject);
      expect(msg.getData()).toEqual(message);
      subscription.unsubscribe();
      done();
    });

    stan.publish(subject, message, function(err, guid) {
      if (err) {
        expect(err).toBeInstanceOf(Error);
      } else {
        expect(guid).toBeTruthy();
      }
    });
  });

  it('When a message is published multiple subscriber receive the message', () => {
    const subject = 'test.pub-sub';
    const message = 'Test message';

    const opts = stan.subscriptionOptions().setStartWithLastReceived();
    const promise1 = new Promise(resolve => {
      const subscription = stan.subscribe(subject, opts);
      subscription.on('message', function(msg) {
        expect(msg.getSubject()).toEqual(subject);
        expect(msg.getData()).toEqual(message);
        subscription.unsubscribe();
        resolve();
      });
    });
    const promise2 = new Promise(resolve => {
      const subscription = stan.subscribe(subject, opts);
      subscription.on('message', function(msg) {
        expect(msg.getSubject()).toEqual(subject);
        expect(msg.getData()).toEqual(message);
        subscription.unsubscribe();
        resolve();
      });
    });

    stan.publish(subject, message, function(err, guid) {
      if (err) {
        expect(err).toBeInstanceOf(Error);
      } else {
        expect(guid).toBeTruthy();
      }
    });
    return Promise.all([promise1, promise2]);
  });

  it('When a message is published only subjected subscribers will receive the message', done => {
    const subject1 = 'test.pub-sub';
    const subject2 = 'test';
    const message = 'Test message';

    const mockCb1 = jest.fn(() => Promise.resolve());
    const mockCb2 = jest.fn(() => setTimeout(Promise.resolve, 0));

    const opts = stan.subscriptionOptions().setStartWithLastReceived();
    const service1 = stan.subscribe(subject1, opts);
    const service2 = stan.subscribe(subject2, opts);

    service1.on('message', mockCb1);
    service2.on('message', mockCb2);

    stan.publish(subject1, message);

    setTimeout(() => {
      expect(mockCb1.mock.calls.length).toBeTruthy();
      expect(mockCb2.mock.calls.length).toBeFalsy();

      service1.unsubscribe();
      service2.unsubscribe();
      done();
    }, 50);
  });

  afterAll(() => {
    stan.close();
  });
});
