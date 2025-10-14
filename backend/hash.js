const bcrypt = require('bcrypt');


const plainPassword = 'mekdi';


async function hashPassword(password) {
  try {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Plain Password:', password);
    console.log('Hashed Password:', hashedPassword);
    return hashedPassword;
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}


hashPassword(plainPassword);
