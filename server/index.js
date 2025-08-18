import express from 'express';
import cors from 'cors';
import { accept, leave } from './handlers.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ride-now/requests/:id/accept', accept);
app.post('/ride-now/requests/:id/leave', leave);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
