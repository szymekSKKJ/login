"use server";

import { NextRequest } from "next/server";
import { ApiResponse, createApiResponse } from "../../api";
import drizzleClient from "@/drizzle/drizzle";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;

    const result = await drizzleClient.select({ email: users.email }).from(users).where(eq(users.email, email));

    if (result.length !== 0) {
      return createApiResponse(200, "Email jest już zajęty", { isTaken: true });
    } else {
      return createApiResponse(200, null, { isTaken: false });
    }
  } catch (error) {
    return createApiResponse(500, null, null);
  }
};

export { POST };

const apiUserCheckEmail = async (email: string): Promise<ApiResponse<null | { isTaken: boolean }>> => {
  email = email.toLowerCase();

  const formData = new FormData();

  formData.append(`email`, `${email}`);

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/checkEmail`, {
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json());
};

export { apiUserCheckEmail };
