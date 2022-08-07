import { connect } from 'mongoose';
import 'dotenv/config';

connect(process.env.MONGODB_URL)
  .then(() => {
    console.log(`Connected.....`);
  })
  .catch(err => {
    console.log(err.message);
  });
