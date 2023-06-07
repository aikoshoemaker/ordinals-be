import express from 'express';

export const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => {
  res.send('test from router receive ');
});

router.post('/paid', async (req, res) => {
  const body = req.body;
  console.log({ body });
  res.status(200).send({});
});
