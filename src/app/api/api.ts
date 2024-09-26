"use server";
import jwt from "jsonwebtoken";

type ApiResponse<Response> = { status: 200 | 500; message: null | string; response: Response };

export type { ApiResponse };

const createApiResponse = <Response>(status: 200 | 500, message: null | string, response: Response | null) => {
  return Response.json({ status: status, message: message, response: response }, { status: status });
};

const encryptData = (data: object | string) => {
  return jwt.sign(data, process.env.JWT_SECRET as string);
};

const verifyData = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new Error(error as string);
  }
};

export { createApiResponse, encryptData, verifyData };
