// import fs from "node:fs";

// import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { uploadImage } from "./cloudinary";
import { MongoClient } from "mongodb";

// const db = sql("meals.db");

export async function getMeals() {
  //  to simulate an async call
  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();
  const foodsCollection = db.collection("nextlevelfood");

  const meetups = await foodsCollection.find().toArray();

  // console.log(result);
  client.close();

  //  to simulate an error occurence
  // throw new Error("Db connection failed");
  return meetups;
}

export async function getMeal(slug) {
  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();
  const foodsCollection = db.collection("nextlevelfood");

  const meetup = await foodsCollection.findOne({ slug: slug });

  // console.log(result);
  client.close();

  // console.log(meetup);

  //  to simulate an error occurence
  // throw new Error("Db connection failed");
  return meetup;
  // return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // console.log(meal.image);

  const bufferedImage = await meal.image.arrayBuffer();

  let url;
  try {
    url = await uploadImage(bufferedImage);
    // console.log(url);
  } catch (error) {
    throw new Error(
      "Uploading image to our databases failed. Please try again in sometime."
    );
  }

  // console.log(url);
  meal.image = url;

  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();
  const foodsCollection = db.collection("nextlevelfood");

  const result = await foodsCollection.insertOne(meal);

  // console.log(result);
  client.close();

  return result;

  // db.prepare(
  //   `
  //   INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email)
  //   VALUES (
  //        @slug,
  //        @title,
  //        @image,
  //        @summary,
  //        @instructions,
  //        @creator,
  //        @creator_email
  //     )
  //   `
  // ).run(meal);
}
