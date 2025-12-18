const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('./database.sqlite')

db.run(`
  CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    telefone TEXT,
    plano TEXT
  )
`)

app.get('/', (req, res) => {
  res.send('Backend da academia rodando')
})

// ✅ CADASTRAR ALUNO
app.post('/matricula', (req, res) => {
  const { nome, email, telefone, plano } = req.body

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' })
  }

  db.run(
    `INSERT INTO alunos (nome, email, telefone, plano) VALUES (?, ?, ?, ?)`,
    [nome, email, telefone, plano],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: err.message })
      }
      res.json({ sucesso: true, id: this.lastID })
    }
  )
})



app.get('/alunos', (req, res) => {
  db.all(`SELECT * FROM alunos`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message })
    }
    res.json(rows)
  })
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})
