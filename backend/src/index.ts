import http from 'http';
import { env } from './config/env';
import app from './app';
import { initSocket } from './socket';

const server = http.createServer(app);
initSocket(server);

const host = '::'; // listen on IPv6 (and IPv4-mapped) for Railway private network
server.listen(env.port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://${host}:${env.port}`);
});
