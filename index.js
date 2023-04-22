import express from 'express';
import hbs from 'express-handlebars';
import bodyParser from 'body-parser';
import session from 'express-session'
import { User } from './models/User.js'

const app = express();

app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true
}))

app.get('/', (req, res) => {
  if (req.session.errors) {
      const errorsArray = req.session.errors
      req.session.errors = ''

    return res.render('index', { NavActiveRegister: true, error: errorsArray })
  }

  if (req.session.success) {
    req.session.success = false
    return res.render('index', { NavActiveRegister: true, successMessage: true })
  }

  return res.render('index', { NavActiveRegister: true})
});

app.get('/users', (req, res) => {
  User.findAll().then((data) => {
    const dataArray = data.map(datas => datas.toJSON())

    if (data.length > 0) {
      res.render('users', { NavActiveUsers: true, table: true, users: dataArray})
    } else {
      res.render('users', { NavActiveUsers: true, table: false });
    }
  })
  .catch(err => console.log(err)) 
});

app.post('/edit', (req, res) => {
  const { id } = req.body
  User.findByPk(id)
  .then(data => {
    return res.render('edit', {error: false, id: data.id, name: data.nome, email: data.email})
  })
  .catch(err => {
    console.log(err)
    return res.render('edit', {error: true, messageError: 'Impossível editar!'})
  })
})

app.post('/register', (req, res) => {
  const error = [];

  var email = req.body.email;
  var name = req.body.name;

  name = name.trim();
  email = email.trim();

  name = name.replace(/[^A-zÀ-ú\s]/gi, '');

  if (name == '' || typeof name == undefined || name == null) {
    error.push({ message: 'Campo nome pode ser vazio!' });
  }

  if (!/^[A-Za-zàáââéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/.test(name)) {
    error.push({ message: 'Nome inválido!' });
  }

  if (email == '' || typeof email == undefined || email == null) {
    error.push({ message: 'Campo não pode ser vazio!' });
  }

  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    error.push({ message: 'Campo de email inválido!' });
  }

  if (error.length > 0) {
    console.log(error)
    req.session.errors = error
    req.session.success = false
    return res.redirect('/')
  }

  User.create({
    nome: name,
    email: email.toLowerCase()
  })
  .then(() => {
    console.log('Sucess in register user')
    req.session.success = true
    return res.redirect('/')
  }).catch((err) => {
    console.log('Error: ' + err)
  })
});

app.post('/update', (req, res) => {
  const error = [];

  var email = req.body.email;
  var name = req.body.name;

  name = name.trim();
  email = email.trim();

  name = name.replace(/[^A-zÀ-ú\s]/gi, '');

  if (name == '' || typeof name == undefined || name == null) {
    error.push({ message: 'Campo nome pode ser vazio!' });
  }

  if (!/^[A-Za-zàáââéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/.test(name)) {
    error.push({ message: 'Nome inválido!' });
  }

  if (email == '' || typeof email == undefined || email == null) {
    error.push({ message: 'Campo não pode ser vazio!' });
  }

  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    error.push({ message: 'Campo de email inválido!' });
  }

  if (error.length > 0) {
    console.log(error)
    return res.status(400).send({status: 400, message: error})
  }

  User.update(
    {
      nome: name,
      email: email.toLowerCase()
    },
    {
      where: {
        id: req.body.id
      }
    }
  ).then(data => {
    console.log(data)
    return res.redirect('/users')
  }).catch(err => console.log(err))
})

app.post('/delete', ( req, res ) => {
  User.destroy({
    where: {
      id: req.body.id
    }
  }).then(() => {
    return res.redirect('/users')
  }).catch(err => console.log(err))
})

app.listen(3000);
