const bcrypt = require('bcrypt');

// Replace this with the actual password hash you got from your database for TEST_ADMIN_007
const hashFromDB = '$2b$10$B5evD82xhXzXap8ZGN/SZ.bNTX.5VgSk6meeHmwX.i6Zg.wCG2I46'; 

const inputPassword = '12345678@S';

bcrypt.compare(inputPassword, hashFromDB)
  .then(match => {
    if (match) {
      console.log('Password is correct!');
    } else {
      console.log('Password does not match.');
    }
  })
  .catch(err => {
    console.error('Error comparing passwords:', err);
  });
