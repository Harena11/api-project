const Article = require("./articles.model");
const bcrypt = require("bcrypt");

class ArticleService {
  getAll() {
    return Article.find({});
  }
  get(id) {
    return Article.findById(id);
  }

  getUserAll(userId){
    return Article.find({user : userId});
  }

  create(data) {
    const article = new Article(data);
    return article.save();
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
  async checkPasswordUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      return false;
    }
    const bool = await bcrypt.compare(password, user.password);
    if (!bool) {
      return false;
    }
    return user._id;
  }
}

module.exports = new ArticleService();
