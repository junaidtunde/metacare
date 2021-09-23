import app from './app';

require('dotenv').config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.info(`Express server listening on port ${PORT}`);
});