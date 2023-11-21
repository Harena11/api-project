const request = require('supertest');
const express = require('express');
const articlesService = require('../api/articles/articles.service');
const { app } = require("../server");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const usersService = require("../api/users/users.service");
const { generateToken } = require("../middlewares/auth");

// Assurez-vous d'inclure la configuration de votre application Express ici,
// y compris l'ajout du contrôleur comme middleware pour les routes appropriées

describe('ArticlesController', () => {

    let token;
    beforeAll(async() => {
        // Générer un token valide à utiliser dans les tests
        const userId = '1234';
        token = generateToken(userId);


        // Créer un utilisateur administrateur dans la base de données et générer un token pour lui
        const adminUser = {
            _id: "adminTestId", // Remplacez par l'ID souhaité
            name: "Admin",
            email: "admin@example.com",
            password: "password123", // N'oubliez pas de crypter le mot de passe si nécessaire
            role: "admin", // Assurez-vous que le rôle est "admin"
          };
          
          // Configurez mockingoose pour renvoyer l'administrateur lorsque vous recherchez par ID
          mockingoose(User).toReturn(adminUser, "findOne");
      
          // Générez un token JWT pour l'administrateur
          adminToken = generateToken(adminUser._id);

    });

  it('should get all articles', async () => {
    const mockArticles = [{ title: 'Article 1' }, { title: 'Article 2' }];
    articlesService.getAll = jest.fn(() => mockArticles);

    const response = await request(app)
      .get('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(mockArticles);
  });

  it('should get an article by ID', async () => {
    const mockArticle = { _id: '123', title: 'Test Article' };
    articlesService.get = jest.fn(() => mockArticle);

    const response = await request(app)
      .get('/api/articles/123')
      .set('Authorization', `Bearer ${token}`) // Utilisez un ID valide ici
      .expect(200);

    expect(response.body).toEqual(mockArticle);
  });

  it('should create an article', async () => {
    const mockArticle = { title: 'New Article', content: 'Article Content' };
    articlesService.create = jest.fn(() => mockArticle);

    const response = await request(app)
      .post('/api/articles')
      .send(mockArticle)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body).toEqual(mockArticle);
  });

  it('should update an article', async () => {
    const mockArticle = { _id: '123', title: 'Updated Article' };
    articlesService.update = jest.fn(() => mockArticle);

    const response = await request(app)
      .put('/api/articles/123')
      .send(mockArticle)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toEqual(mockArticle);
  });

  it('should delete an article', async () => {
    const mockArticle = { _id: '123', title: 'Updated Article' };
    articlesService.delete = jest.fn(() => mockArticle);
    // articlesService.delete = jest.fn();

    const response = await request(app)
      .delete('/api/articles/123')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);

    expect(response.body.message).toBe(undefined);
  });

  // Tests pour les cas d'erreur, par exemple, UnauthorizedError, NotFoundError, etc.

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
