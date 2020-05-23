import { connect, Client, NatsConnectionOptions } from 'ts-nats';

export default function getConnection(options?: NatsConnectionOptions): Promise<Client> {
  return connect(options);
}
