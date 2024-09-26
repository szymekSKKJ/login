"use server";

import { NextRequest } from "next/server";
import { ApiResponse, createApiResponse, encryptData, verifyData } from "../../api";
import drizzleClient from "@/drizzle/drizzle";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;

    const data = verifyData(token) as { email: string; password: string };

    const response = await drizzleClient
      .select({ email: users.email, password: users.password, firstName: users.firstName, lastName: users.lastName })
      .from(users)
      .where(eq(users.email, data.email))
      .then((response) => response[0]);

    const tokenPassword = verifyData(response.password);

    if (tokenPassword === data.password) {
      return createApiResponse(200, "Zostałeś zalogowany", {
        isLoggedIn: true,
        user: {
          firstName: response.firstName,
          lastName: response.lastName,
        },
      });
    } else {
      return createApiResponse(200, "Podany email lub hasło są niepoprawne", { isLoggedIn: false, user: null });
    }
  } catch (error) {
    return createApiResponse(500, null, null);
  }
};

export { POST };

const apiUserAuth = async (
  email: string,
  password: string
): Promise<ApiResponse<null | { isLoggedIn: boolean; user: { firstName: string; lastName: string } | null }>> => {
  email = email.toLowerCase();

  const formData = new FormData();

  const token = encryptData({ email: email, password: password });

  formData.append(`token`, `${token}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/auth`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json());
};

export { apiUserAuth };
