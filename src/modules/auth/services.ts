import { ApiError } from "../../errors/ApiError";
import { Prisma } from "../../database";
import { generateToken } from "../../utils/jwt";
import { validateLogin } from "./validators";


export const handleLogin = async (body: any) => {
    validateLogin(body);
    const user = await Prisma.empregado.findFirst({
        where: {
          email: body.email,
        },
      });
    if(!user) return ApiError.notFound("Usuario não encontrado");
    if(!["Diretor", "Supervisor"].includes(user.cargo)) return ApiError.unauthorized("Não autorizado");
    const token = generateToken(user);
    return { 
      ...user,
      token
      };
}