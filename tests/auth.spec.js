const { generateToken, verifyToken } = require('../middlewares/auth');

describe('Test de la méthode generateToken', () => {
  it('devrait générer un jeton JWT valide', () => {
    const userId = '123456'; // ID de l'utilisateur fictif
    const token = generateToken(userId);

    // Vérifiez que le jeton est une chaîne non vide
    expect(token).toBeTruthy();

    // Vérifiez que le jeton peut être vérifié avec la même clé secrète
    const decoded = verifyToken(token, 'test');
    expect(decoded.userId).toBe(userId);
  });
});