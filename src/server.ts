import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import sampleRoutes from './routes/sample';

const NAMESPACE = 'Server';
const router = express();

/** Logging the request */
router.use((req, res, next) => {
  logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
    /** Log the res */
    logging.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}] - STATUS - [${req.statusCode}]`
    );
  });

  next();
});

/* Parse the request */
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/** Rulles of our API */
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // will need IP's and routes pre-defined
  res.header('Access-Control-Allow-Headers', 'Origin, x-Requested-With, Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET PATCH DELTE POST PUT');
    return res.status(200).json({});
  }

  next();
});

/** Routes */
router.use('/sample', sampleRoutes);

/** Error Handling */
router.use((req, res, next) => {
  const error = new Error('not found');

  return res.status(404).json({
    message: error.message,
  });
});
console.warn(config.server.port);

/** Create the server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () =>
  logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`)
);
