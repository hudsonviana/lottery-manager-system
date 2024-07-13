import express from 'express';
import cors from 'cors';
import http from 'http';
import apiRoutes from './routes/api.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

const runServer = (port, server) => {
  server.listen(port, () => console.log(`Server running at: http://localhost:${port}`));
};

const regularServer = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  //
} else {
  const serverPort = parseInt(process.env.PORT) || 3333;
  runServer(serverPort, regularServer);
}
