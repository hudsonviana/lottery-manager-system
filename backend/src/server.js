import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import cookieParser from 'cookie-parser';

import siteRoutes from './routes/site.js';
import apiRoutes from './routes/api.js';

const isProductionEnv = process.env.NODE_ENV === 'production';

const clientOrigin = `http://localhost:${isProductionEnv ? 3000 : 4173}`; //is reverted //npm run preview
// const clientOrigin = `http://localhost:${isProductionEnv ? 4173 : 3000}`; //correct  //npm run client

const corsOptions = {
  // origin: clientOrigin,
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(siteRoutes);
app.use('/api', apiRoutes);

const runServer = (port, server) => {
  server.listen(port, () => console.log(`Server running at: http://localhost:${port}`));
};

const regularServer = http.createServer(app);

if (isProductionEnv) {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  };

  const safeServer = https.createServer(options, app);

  runServer(80, regularServer);
  runServer(443, safeServer);
} else {
  const serverPort = parseInt(process.env.PORT) || 3333;
  runServer(serverPort, regularServer);
}
