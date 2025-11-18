import http from 'http';
import { env } from './config/env';
import app from './app';
import { initSocket } from './socket';

const server = http.createServer(app);
initSocket(server);

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${env.port}`);
});
