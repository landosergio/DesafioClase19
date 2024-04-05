import { UserModel } from "./models/User.model.js";

class SesAccManager {
  async createUser(user) {
    if (
      !user.first_name ||
      !user.last_name ||
      !user.email ||
      !user.age ||
      !user.password
    ) {
      return "Debés completar todos los datos";
    }

    try {
      await UserModel.create(user);
    } catch (error) {
      return error.message;
    }
    return "Usuario registrado";
  }

  async login(user) {
    let dbUser;
    try {
      dbUser = await UserModel.find({
        email: user.email,
        password: user.password,
      }).lean();
    } catch (error) {
      return error.body;
    }
    return dbUser[0] ? dbUser[0] : 0;
  }
}

export default SesAccManager;
