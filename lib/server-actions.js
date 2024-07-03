"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

async function isInvalidInput(text) {
  return !text || !text.trim() === "";
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };
  if (
    isInvalidInput(meal.title) ||
    isInvalidInput(meal.creator) ||
    isInvalidInput(meal.instructions) ||
    isInvalidInput(meal.summary) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    !meal.image.size === 0
  ) {
    return {
      message: "Invalid input! Please check the inputs and try again.",
    };
  }

  await saveMeal(meal);
  revalidatePath("/meals", "layout");
  redirect("/meals");
}
