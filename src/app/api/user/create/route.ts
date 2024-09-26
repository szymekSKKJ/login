"use server";

import { NextRequest } from "next/server";
import { ApiResponse, createApiResponse, encryptData, verifyData } from "../../api";
import { apiUserCheckEmail } from "../checkEmail/route";
import drizzleClient from "@/drizzle/drizzle";
import { users } from "@/drizzle/schema";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;

    const data = verifyData(token) as { firstName: string; lastName: string; email: string; password: string };

    const response = await apiUserCheckEmail(data.email);

    if (response.status === 200) {
      if (response.response?.isTaken) {
        return createApiResponse(200, "Ten email jest już zajęty", { isCreated: false });
      } else {
        const token = encryptData(data.password);

        await drizzleClient.insert(users).values({ email: data.email, firstName: data.firstName, lastName: data.lastName, password: token });

        return createApiResponse(200, "Konto zostało utworzone", { isCreated: true });
      }
    } else {
      throw new Error(`${response.message}`);
    }
  } catch (error) {
    return createApiResponse(500, null, null);
  }
};

export { POST };

const apiUserCreate = async (firstName: string, lastName: string, email: string, password: string): Promise<ApiResponse<null | { isCreated: boolean }>> => {
  const formData = new FormData();

  const token = encryptData({ firstName: firstName, lastName: lastName, email: email, password: password });

  formData.append(`token`, `${token}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/create`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json());
};

export { apiUserCreate };
