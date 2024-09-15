import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const users = [
  {
    id: 1,
    username: 'mluukkai',
    password: 'password' 
  }
];

const SECRET = 'my_secret_key';

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  const passwordCorrect = user === undefined
    ? false
    : password === user.password;

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({ token, username: user.username, name: 'Matti Luukkainen' });
});

app.get('/api/blogs', (req, res) => {
  res.json([
    { id: 1, title: 'Things I Don\'t Know as of 2018', author: 'Dan Abramov' },
    { id: 2, title: 'Microservices and the First Law of Distributed Objects', author: 'Martin Fowler' },
  ]);
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
