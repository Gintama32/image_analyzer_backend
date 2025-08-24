import bcrypt from 'bcrypt';
import db from '../database.js';
function signin(req, res) {
  const {email,password} = req.body
  if (!email || !password){
    res.status(400).json('invalid credentials')
  }
  db.select('email','hash').from('login')
  .where('email','=', email)
  .then(data=>{
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if(isValid){
      return db.select('*').from('users')
      .where('email','=',email)
      .then(user=>{
        res.json({id: user[0].id,name: user[0].name,entries:user[0].entries})
      })
      .catch(err=>res.status(400).json('unable to get user'))
    }else{
      res.status(400).json('wrong credentials')
    }
  })
  .catch(err=>res.status(400).json('wrong credentials'))
}



function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password || !name){
    return res.status(400).json('invalid credentials');
  }
  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.transaction(trx => {
    // First insert into users table
    trx('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then(user => {
      // Then insert into login table
      return trx.insert({
        hash: hashedPassword,
        email: email
      })
      .into('login')
      .returning('email')
      .then(() => {
        res.json({id: user[0].id, name: user[0].name, entries: user[0].entries})
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => {
    console.error(err);
    res.status(400).json('unable to register');
  });
}
  
export { signin, register };
