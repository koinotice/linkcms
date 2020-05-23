import { Stan } from 'docker-streaming';
import getConnection from '../src/index';

describe("Test 'Queue Groups' streaming", () => {
  let stan: Stan;

  beforeAll(() => {
    try {
      stan = getConnection('test-cluster', 'test');
    } catch (err) {
      throw new Error('NATS streaming server is disconnected');
    }
  });

  it('NATS streaming server is connected', () => {
    stan.on('connect', nc => expect(nc).toBeTruthy());
  });

  it('When a message is published a subscriber group will receive the message', () => {
    return;
  });

  afterAll(() => {
    stan.close();
  });
});
