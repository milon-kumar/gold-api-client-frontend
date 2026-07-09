import { useState } from "react";

export default function useImageUpload(maxSizeMB = 2) {
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setError("");

    const maxSize = maxSizeMB * 1024 * 1024;

    if (file.size > maxSize) {
      setError(`Image size must be less than ${maxSizeMB} MB`);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result); // Base64
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  /**
   * Save successful hole backend theke image url diye update korbe
   */
  const setImageUrl = ({ image, preview }) => {
    setImage(image);
    setPreview(preview); // full url
  };

  /**
   * Reset
   */
  const resetImage = () => {
    setImage("");
    setPreview("");
    setError("");
    setExistingImageUrl("")
  };

  return {
    image,
    preview,
    error,
    handleImageChange,
    setImageUrl,
    resetImage,
    existingImageUrl,
    setExistingImageUrl,
  };
}
