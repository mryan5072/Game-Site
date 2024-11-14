"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import Modal from 'react-modal';
import 'swiper/css';
import 'swiper/css/scrollbar';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config';
import platformMapping from '../../../utils/platformMapping';
import { CircularProgress } from '@mui/material';

interface Game {
  id: number;
  name: string;
  cover?: {
    image_id: string;
  };
  summary?: string;
  platforms?: number[];
  screenshots?: {
    image_id: string;
  }[];
}

export default function GameDetailsPage({ params }: { params: { id: string } }) {
  const [gameDetails, setGameDetails] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [userUID, setUserUID] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserUID(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchGameDetails = async (id: string) => {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + `/api/getGame?id=${id}`, {
        method: 'POST',
      });
      if (!res.ok) {
        console.error('Error fetching game details:', res.statusText);
        setLoading(false);
        return null;
      }
      const gameDetails: Game = await res.json();
      setGameDetails(gameDetails);
      setLoading(false);
    };
    fetchGameDetails(params.id);
  }, [params.id]);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (userUID && gameDetails) {
        const ratingDoc = await getDoc(doc(firestore, "individualGameRatings", userUID, "ratings", gameDetails.id.toString()));
        if (ratingDoc.exists()) {
          setRating(ratingDoc.data().rating);
        }
      }
    };
    fetchUserRating();
  }, [userUID, gameDetails]);

  // Open and close modal
  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const handleRatingChange = async (newValue: number | null) => {
    setRating(newValue);
    if (newValue !== null && userUID && gameDetails) {
      try {
        await setDoc(doc(firestore, "individualGameRatings", userUID, "ratings", gameDetails.id.toString()), {
          gameID: gameDetails.id,
          rating: newValue,
        });
        console.log("Rating saved successfully!");
      } catch (error) {
        console.error("Error saving rating:", error);
      }
    }
  };

  if (loading) {
    return <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </div>
  }

  if (!gameDetails) {
    return <p>No game details found.</p>;
  }

  return (
    <div className="game-details-container">
      <div className="cover-image-container">
        {gameDetails.cover ? (
          <img
            className="cover-image"
            src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${gameDetails.cover.image_id}.jpg`}
            alt={gameDetails.name}
            loading="lazy"
          />
        ) : (
          <div className="cover-image"></div>
        )}
      </div>

      <div className="game-info">
        <h1 className="game-title">{gameDetails.name}</h1>
        <p className="game-summary">{gameDetails.summary || 'No summary available'}</p>
        
        <div className="game-platforms">
          <h2>Available on:</h2>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {gameDetails.platforms?.map((platformId, index) => (
              <div className='chip-container'>
              <Chip 
                key={index} 
                label={platformMapping[platformId]?.name || "Unknown Platform"}
                icon={platformMapping[platformId]?.icon}
                color="primary" 
                variant="filled" 
                className="platform-name"
              />
              </div>
            ))}
          </Box>
        </div>
      </div>

      <div className="game-rating">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <h2>Rate this game:</h2>
          <Rating
            name="game-rating"
            value={rating}
            onChange={(event, newValue) => handleRatingChange(newValue)}
            precision={0.5}
          />
        </Box>
      </div>

      <div className="swiper-section">
        <h2 className="screenshots-title">Screenshots</h2>
        <div className="swiper-container">
          <Swiper
            spaceBetween={10}
            slidesPerView={3}
            modules={[Scrollbar]}
            scrollbar={{
              el: '.swiper-scrollbar',
              hide: false,
            }}
            className="mediaSwiper"
          >
            {gameDetails?.screenshots?.map((screenshot, index) => (
              <SwiperSlide key={index}>
                <div className="image-wrapper">
                  <img
                    src={`https://images.igdb.com/igdb/image/upload/t_1080p/${screenshot.image_id}.jpg`}
                    alt={`Screenshot ${index + 1}`}
                    className="screenshot-image"
                    loading="lazy"
                    onClick={() => openModal(`https://images.igdb.com/igdb/image/upload/t_1080p/${screenshot.image_id}.jpg`)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-scrollbar"></div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Full Size Image"
        className="modal"
        overlayClassName="overlay"
      >
        <button onClick={closeModal} className="close-button">&times;</button>
        {selectedImage && (
          <img src={selectedImage} alt="Full Size" className="modal-image" />
        )}
      </Modal>
    </div>
  );
}
