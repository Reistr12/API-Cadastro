/**
 * API de Autenticação - Projeto de Estudo
 *
 * Esta API oferece endpoints para registro e login de usuários,
 * utilizando Prisma ORM para interação com o banco de dados
 * e bcrypt para hash de senhas.
 *
 * Tecnologias utilizadas:
 * - Node.js
 * - Express
 * - Prisma
 * - Bcrypt
 */

// Importação de dependências
import express from 'express'; // Framework web
import { PrismaClient } from '@prisma/client'; // ORM para banco de dados
import bcrypt from 'bcrypt'; // Biblioteca para hash de senhas
import bodyParser from 'body-parser'; // Middleware para parsear requisições

// Inicialização do aplicativo Express
const app = express();
const PORT = 5000; // Porta do servidor
const prisma = new PrismaClient(); // Instância do cliente Prisma

// Configuração de middlewares
app.use(express.urlencoded({ extended: true })); // Para formulários
app.use(express.json()); // Para JSON

/**
 * Rota: POST /register
 * Descrição: Registra um novo usuário no sistema
 * Parâmetros (body):
 * - name: Nome do usuário (string)
 * - email: E-mail do usuário (string)
 * - password: Senha do usuário (string)
 */
app.post('/register', async (req, res) => {
  try {
    // Extrai e normaliza os dados do corpo da requisição
    let { name, email, password } = req.body;
    email = email.toLowerCase().trim(); // Normaliza o e-mail

    // Validação dos campos obrigatórios
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    
    //Verifica se o email contém "@"
    if (!email.includes("@")) {
      return res.status(500).json({ error: "O email deve conter '@' " });
    }
    //Verifica a força da Senha
    if (password.length < 6 || !password.includes("@" || "#" || "!" || "$")) {
      return res.status(500).json({ error: "Senha Fraca " });
    }


    // Cria o usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: await bcrypt.hash(password, 8) // Gera hash da senha
      }
    });

    // Retorna o usuário criado com status 201 (Created)
    res.status(201).json(newUser);

  } catch (erro) {
    // Tratamento de erros
    console.error("Erro na aplicação:");
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

/**
 * Rota: POST /login
 * Descrição: Autentica um usuário existente
 * Parâmetros (body):
 * - email: E-mail do usuário (string)
 * - password: Senha do usuário (string)
 */
app.post('/login', async (req, res) => {
  try {
    // Extrai e normaliza os dados do corpo da requisição

    console.log(req.body)

    let { email, password } = req.body;
    email = email.toLowerCase().trim(); // Normaliza o e-mail

    // Validação dos campos obrigatórios
    if (!email || !password) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    // Busca o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    // Verifica se o usuário existe
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Compara a senha fornecida com o hash armazenado
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Retorna mensagem de sucesso e dados do usuário (sem a senha)
    res.json({
      message: "Login bem-sucedido!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (erro) {
    // Tratamento de erros
    console.error("Erro na aplicação:", erro);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Aplicação está rodando na porta ${PORT}`);
});

/**
 * Melhorias futuras:
 * 1. Implementar tokens JWT para autenticação
 * 2. Adicionar validação mais robusta de e-mail e senha
 */
