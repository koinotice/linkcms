import { connect, StanOptions, Stan } from 'docker-streaming';

export default function getConnection(clusterID: string, clientID: string, options?: StanOptions): Stan {
  return connect(clusterID, clientID, options);
}
