import { Config } from './config';
import app from './app';
console.log(Config.PORT);

const startServer = () => {
  const PORT = Config.PORT;
  try {
    app.listen(PORT, () => {
      console.log(`${PORT}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startServer();
