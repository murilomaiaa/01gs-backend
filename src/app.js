const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid repository Id" });
  }

  return next();
}
app.use("/repositories/:id", validateProjectId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repoIndex = repositories.findIndex((repository) => repository.id == id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: "Id doesn't exists" });
  }

  const likes = repositories[repoIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repoIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex((repository) => repository.id == id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: "Id doesn't exists" });
  }

  const repository = repositories[repoIndex];

  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex((repository) => repository.id == id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: "Id doesn't exists" });
  }

  let repository = repositories[repoIndex];
  repository.likes++;
  repositories[repoIndex] = repository;

  return res.json(repository);
});

module.exports = app;
