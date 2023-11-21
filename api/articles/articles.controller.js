const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.service");
const usersService = require("../users/users.service");
const usersController = require("../users/users.controller");

class ArticlesController {
  async getAll(req, res, next) {
    try {
      const articles = await articlesService.getAll();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const article = await articlesService.get(id);
      if (!article) {
        throw new NotFoundError();
      }
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      req.body.user = req.user.userId;
      const article = await articlesService.create(req.body);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const user = await usersService.get(userId);
      const data = req.body;
      if (user.role === "admin") {
        const articleModified = await articlesService.update(id, data);
        req.io.emit("article:update", articleModified);
        res.status(200).json(articleModified);
      } else {
        res.status(403).json({ message: "Missing required authorization" });
      }
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const userId = req.user.userId;
      const user = await usersService.get(userId);
      if (user.role === "admin") {
        await articlesService.delete(id);
        req.io.emit("article:delete", { id });
        res.status(204).send();
      } else {
        res.status(403).json({ message: "Missing required authorization" });
      }
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new ArticlesController();