import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import siteRoutes from './routes/site.js';
import apiRoutes from './routes/api.js';

const corsOptions = {
  origin: 'http://localhost:5173', // Specify the allowed origin
  credentials: true, // Allow credentials
};

const app = express();
// app.use(cors());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(siteRoutes);
app.use('/api', apiRoutes);

const runServer = (port, server) => {
  server.listen(port, () => console.log(`Server running at: http://localhost:${port}`));
};

const regularServer = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
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
