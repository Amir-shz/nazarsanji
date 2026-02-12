"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./session";

export async function adminLogin(username: string, password: string) {
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    await createSession(username);
    redirect("/admin");
  } else {
    return { status: "failed", message: "نام‌کاربری یا رمزعبور اشتباه است." };
  }
}

export async function adminLogout() {
  await deleteSession();
  redirect("/");
}
