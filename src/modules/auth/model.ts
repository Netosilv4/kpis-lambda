/* eslint-disable camelcase */
import { Prisma } from '../../database'

class AuthModel {
  static async findUser (email: string) {
    const user = await Prisma.empregado.findFirst({
      where: {
        email
      }
    })
    return user
  }
}

export default AuthModel
