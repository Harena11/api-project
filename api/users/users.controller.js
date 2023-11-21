const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const usersService = require("./users.service");
const articlesService = require("../articles/articles.service");
const { generateToken } = require("../../middlewares/auth");

class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await usersService.get(id);
      if (!user) {
        throw new NotFoundError();
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
  async create(req, res, next) {
    try {
      const user = await usersService.create(req.body);
      user.password = undefined;
      req.io.emit("user:create", user);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const userModified = await usersService.update(id, data);
      userModified.password = undefined;
      res.json(userModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await usersService.delete(id);
      req.io.emit("user:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userId = await usersService.checkPasswordUser(email, password);
      if (!userId) {
        throw new UnauthorizedError();
      }
      const token = generateToken(userId)
      res.json({
        token: token,
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req,res,next) {
    try {
      const user = await usersService.get(req.user.userId);
      if (!user) {
        throw new NotFoundError();
      }
      res.json(user)
    } catch (error) {
      next(error);
    }
  }

  async getArticlesByUserId (req, res, next) {
    try {
        const userId = req.user.userId;
        const user = await usersService.getById(userId);
        const articles = await articlesService.getUserAll(userId);
        // Envoyer une réponse JSON contenant à la fois l'utilisateur et les articles
        res.json({ user: user, articles: articles });
    } catch (error) {
        next(error);
    }
  }

}

module.exports = new UsersController();