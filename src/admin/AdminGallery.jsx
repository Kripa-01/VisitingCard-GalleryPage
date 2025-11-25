import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseStore";

const CLOUDINARY_CLOUD = "dt217i0cw"; 
const UPLOAD_PRESET = "visitingcard";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleUpload = async () => {
    if (images.length === 0) return alert("Select images first");

    setUploading(true);

    for (let img of images) {
      try {
        // 1️⃣ Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        // 2️⃣ Save URL to Firestore (collection: images)
        await addDoc(collection(db, "images"), {
          imageUrl: data.secure_url,
          uploadedAt: new Date(),
        });

      } catch (err) {
        console.error("Upload Error:", err);
      }
    }

    setUploading(false);
    alert("Upload completed!");
    setImages([]);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Admin Panel - Upload Photos</h1>

      {/* File input */}
      <div className="mb-5">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full border p-2 rounded"
        />
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-5">
          {images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt="preview"
              className="rounded shadow"
            />
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
}
