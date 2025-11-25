import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseStore';
import ShajiRapheal from "../assets/Shaji Rapheal.png";

// MUI Masonry ImageList
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const LandingPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'images'),
        orderBy('uploadedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const imageList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setImages(imageList);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#000000]">

        {/* Banner */}
        <img alt="Banner" src={ShajiRapheal} className="w-full" />

        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Photo Gallery</h1>

          {images.length === 0 ? (
            <div className="text-center text-gray-500">No images uploaded yet</div>
          ) : (
            <Box sx={{ width: "100%", overflowY: "visible" }}>
              <ImageList variant="masonry" cols={3} gap={12}>
                {images.map((item) => (
                  <ImageListItem key={item.id}>
                    <img
                      src={`${item.imageUrl}?w=400&fit=crop&auto=format`}
                      srcSet={`${item.imageUrl}?w=400&fit=crop&auto=format&dpr=2 2x`}
                      alt="Gallery"
                      loading=  "lazy"
                      style={{ borderRadius: "10px" }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
