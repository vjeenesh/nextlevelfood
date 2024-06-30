import fs from "node:fs";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { cloudinary, uploadImage } from "./cloudinary";

const db = sql("meals.db");

export async function getMeals() {
  //  to simulate an async call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  //  to simulate an error occurence
  // throw new Error("Db connection failed");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // console.log(meal.image);

  const bufferedImage = await meal.image.arrayBuffer();

  let url;
  try {
    url = await uploadImage(bufferedImage);
    console.log(url);
  } catch (error) {
    throw new Error(
      "Uploading image to our databases failed. Please try again in sometime."
    );
  }

  // console.log(url);
  meal.image = url;
  db.prepare(
    `
    INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email)
    VALUES (
         @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creator_email
      )
    `
  ).run(meal);
}
