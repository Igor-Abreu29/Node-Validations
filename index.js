import express from 'express';
import hbs from 'express-handlebars';
import bodyParser from 'body-parser';

const app = express();

app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index', { NavActiveRegister: true });
});

app.get('/users', (req, res) => {
  res.render('users', { NavActiveUsers: true });
});

app.get('/edit', (req, res) => {
  res.render('edit');
});

app.post('/register', (req, res) => {
  const erros = [];

  var email = req.body.email;
  var name = req.body.name;

  name = name.trim();
  email = email.trim();

  name = name.replace(/[^A-zÀ-ú\s]/gi, '');

  if (name == '' || typeof name == undefined || name == null) {
    erros.push({ message: 'Campo nome pode ser vazio!' });
  }

  console.log(name);

  if (!/^[A-Za-zàáââéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/.test(name)) {
    erros.push({ message: 'Nome inválido!' });
  }

  console.log(erros);

  if (email == '' || typeof email == undefined || email == null) {
    erros.push({ message: 'Campo não pode ser vazio!' });
  }

  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    erros.push({ message: 'Campo de email inválido!' });
  }
  console.log(erros);
});

app.listen(3000);
