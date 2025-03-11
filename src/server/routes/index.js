const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

let users = [];
const JWT_SECRET = '123';

router.post('/registration', async (req, res) => {
    const {email, password, name} = req.body;

    if(!email || !password || !name){
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const userExists = users.find(user => user.email === email);
    if(userExists){
        return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);

    res.send('Usuario cadastrado!');
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const user = users.find(user => user.email === email);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!user || !isPasswordCorrect){
        return res.status(400).json({ message: 'Email ou senha incorretos.' });
    }

    const token = jwt.sign({ userId: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login bem-sucedido!', token });
});

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.user = user;
        next();
      });
};

router.get('/perfil', authenticateToken, (req, res) => {
    res.json({ message: `Bem-vindo, ${req.user.userId}!` });
});
  

module.exports = router;
