import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseStore";

const CLOUDINARY_CLOUD = "dt217i0cw"; 
const UPLOAD_PRESET = "visitingcard";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);

  // 🔥 Pagination states
  const [page, setPage] = useState(1);
  const photosPerPage = 10;

  const fetchImages = async () => {
    const querySnapshot = await getDocs(collection(db, "images"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // File change
  const handleFileChange = (e) => setFiles([...e.target.files]);

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) return alert("Select images first");
    setUploading(true);

    for (let img of files) {
      try {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        await addDoc(collection(db, "images"), {
          imageUrl: data.secure_url,
          uploadedAt: new Date(),
        });

      } catch (err) {
        console.error("Upload Error:", err);
      }
    }

    setUploading(false);
    setFiles([]);
    fetchImages();
    alert("Upload Completed!");
  };

  // Delete one
  const deleteImage = async (id) => {
    await deleteDoc(doc(db, "images", id));
    fetchImages();
  };

  // Delete selected multiple
  const deleteSelected = async () => {
    if (selected.length === 0) return alert("No images selected");
    for (let id of selected) {
      await deleteDoc(doc(db, "images", id));
    }
    setSelected([]);
    fetchImages();
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🔥 Pagination Logic
  const totalPages = Math.ceil(images.length / photosPerPage);
  const startIndex = (page - 1) * photosPerPage;
  const currentImages = images.slice(startIndex, startIndex + photosPerPage);

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold text-center mb-4">Admin Panel</h1>

      {/* Upload */}
      <input type="file" multiple onChange={handleFileChange} className="border p-2 w-full" />

      {files.length > 0 && (
        <button onClick={handleUpload} disabled={uploading}
          className="my-4 bg-blue-600 text-white px-4 py-2 rounded">
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      )}

      <hr className="my-4" />

      {selected.length > 0 && (
        <button onClick={deleteSelected}
          className="bg-red-600 text-white px-4 py-2 rounded mb-4">
          Delete Selected ({selected.length})
        </button>
      )}

      {/* Image Grid (Paginated Data) */}
      <div className="grid grid-cols-3 gap-3">
        {currentImages.map((item) => (
          <div key={item.id} className="relative border rounded p-2">

            <input type="checkbox"
              className="absolute top-2 left-2"
              checked={selected.includes(item.id)}
              onChange={() => toggleSelect(item.id)}
            />

            <img src={item.imageUrl} alt="" className="rounded" />

            <button
              onClick={() => deleteImage(item.id)}
              className="mt-2 bg-red-500 text-white text-sm px-3 py-1 rounded w-full">
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40">
          ⬅ Prev
        </button>

        <span className="font-bold">Page {page} / {totalPages}</span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40">
          Next ➡
        </button>
      </div>

    </div>
  );
}
