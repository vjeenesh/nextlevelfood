"use client";
import { useRef, useState } from "react";
import styles from "./image-picker.module.css";
import Image from "next/image";

export default function ImagePicker({ name, label }) {
  const imageRef = useRef();
  const [pickedImage, setPickedImage] = useState();

  function handlePickImage() {
    imageRef.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null);
      return;
    }
    const filereader = new FileReader();
    filereader.onload = () => {
      setPickedImage(filereader.result);
    };
    filereader.readAsDataURL(file);
  }

  // console.log(pickedImage);

  return (
    <div className={styles.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.controls}>
        <div className={styles.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && <Image src={pickedImage} fill />}
        </div>
        <input
          type="file"
          className={styles.input}
          id={name}
          accept="image/png, image/jpeg, image/jpg"
          name={name}
          required
          ref={imageRef}
          onChange={handleImageChange}
        />
      </div>
      <button className={styles.button} onClick={handlePickImage} type="button">
        Pick an Image
      </button>
    </div>
  );
}
