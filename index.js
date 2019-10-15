const express = require('express');

const server = express();
server.use(express.json());
var x = 0;

server.use((req, res, next) =>{
  x = x + 1;
  console.log(`Número de consultas: ${x}`);

  next();
});

const projects = [{ id: "1", title: "Projeto SGA", tasks: [] },
{ id: "2", title: "Reset senha Google", tasks: [] }];

function checkProjectExists(req, res, next) {
  const pos = projects.findIndex(projects => projects.id == req.params.id);

  if (!projects[pos]) {
    return res.status(400).json({ error: 'Project does exists' });
  }

  return next();
}

server.post('/projects', (req, res) => {
  const project = { id: req.body.id, title: req.body.title, tasks: req.body.tasks };
  projects.push(project);

  return res.json({ mensagem: "Cadastrado com Sucesso" });
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(projects => projects.id == id);

  project.title = title;

  return res.json({ mensagem: "Alterado com Sucesso" });
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const pos = projects.findIndex(projects => projects.id == id);
  projects.splice(pos, 1);

  return res.json({ mensagem: "Deletado com Sucesso" });
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(projects => projects.id == id);
  project.tasks.push(title);

  return res.json({ mensagem: "Nova tarefa adicionada com Sucesso" });
});

server.listen(3333);


