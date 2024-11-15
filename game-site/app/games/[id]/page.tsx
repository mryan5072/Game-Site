"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import Modal from 'react-modal';
import 'swiper/css';
import 'swiper/css/scrollbar';
import Rating from '@mui/material/Rating';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config';
import platformMapping from '../../../utils/platformMapping';
import { CircularProgress } from '@mui/material';
import { GiConsoleController } from 'react-icons/gi';

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
  const [totalRating, setTotalRating] = useState<number | null>(null);
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

  useEffect(() => {
    const fetchTotalRating = async () => {
      if (gameDetails) {
        const totalRatingDoc = await getDoc(doc(firestore, "totalGameRatings", gameDetails.id.toString()));
        if (totalRatingDoc.exists()) {
          const data = totalRatingDoc.data();
          const averageRating = data.totalRating / data.numberOfRatings;
          setTotalRating(averageRating);
        } else {
          setTotalRating(null);
        }
      }
    };
    fetchTotalRating();
  }, [gameDetails]);  

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const handleRatingChange = async (newValue: number | null) => {
    if (!userUID || !gameDetails) return;
  
    const gameId = gameDetails.id.toString();
    const individualRatingRef = doc(firestore, "individualGameRatings", userUID, "ratings", gameId);
    const totalRatingRef = doc(firestore, "totalGameRatings", gameId);
    let currentRating = rating; // store current rating before any changes
  
    try {
      // get the users previous rating if it exists
      const previousRatingDoc = await getDoc(individualRatingRef);
      const previousRating = previousRatingDoc.exists() ? previousRatingDoc.data().rating : null;
  
      // get the current total ratings
      const totalRatingDoc = await getDoc(totalRatingRef);
      const totalRatingData = totalRatingDoc.exists() 
        ? totalRatingDoc.data() 
        : { totalRating: 0, numberOfRatings: 0 };
  
      // update local state early
      setRating(newValue);
  
      if (newValue === null) {
        // user is removing their rating
        if (previousRating !== null) {
          // delete individual rating
          await deleteDoc(individualRatingRef);
          
          if (totalRatingDoc.exists()) {
            if (totalRatingData.numberOfRatings > 1) {
              await updateDoc(totalRatingRef, {
                totalRating: totalRatingData.totalRating - previousRating,
                numberOfRatings: totalRatingData.numberOfRatings - 1
              });
              setTotalRating((totalRatingData.totalRating - previousRating) / (totalRatingData.numberOfRatings - 1));
            } else {
              // if this was the last rating
              await deleteDoc(totalRatingRef);
              setTotalRating(null);
            }
          }
        }
      } else {
        // user is adding or updating their rating
        await setDoc(individualRatingRef, {
          gameID: gameDetails.id,
          rating: newValue,
          timestamp: new Date().toISOString()
        });
  
        if (!totalRatingDoc.exists()) {
          // if its the games first rating
          await setDoc(totalRatingRef, {
            totalRating: newValue,
            numberOfRatings: 1
          });
          setTotalRating(newValue);
        } else {
          if (previousRating === null) {
            // adding new rating to existing total
            const newTotal = totalRatingData.totalRating + newValue;
            const newCount = totalRatingData.numberOfRatings + 1;
            await setDoc(totalRatingRef, {
              totalRating: newTotal,
              numberOfRatings: newCount
            });
            setTotalRating(newTotal / newCount);
          } else {
            // updating existing rating
            const newTotal = totalRatingData.totalRating - previousRating + newValue;
            await setDoc(totalRatingRef, {
              totalRating: newTotal,
              numberOfRatings: totalRatingData.numberOfRatings
            });
            setTotalRating(newTotal / totalRatingData.numberOfRatings);
          }
        }
      }
  
      console.log("Rating updated successfully!");
    } catch (error) {
      console.error("Error updating rating:", error);
      setRating(currentRating);
      throw error;
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
                icon={(platformMapping[platformId]?.icon as React.ReactElement) || <GiConsoleController />}
                color="primary" 
                variant="filled" 
                className="platform-name"
              />
              </div>
            ))}
          </Box>
        </div>
      </div>

      <div className="total-game-rating">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <h2>Average user rating:</h2>
          <Rating
            name="total-game-rating-stars"
            value={totalRating}
            precision={0.5}
            emptyIcon={<StarPurple500Icon style={{ opacity: 0.55 }} fontSize="inherit" />}
            className="custom-rating"
            readOnly
          />
        </Box>
      </div>

      <div className="game-rating">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <h2>Rate this game:</h2>
          <Rating
            name="game-rating-stars"
            value={rating}
            onChange={(event, newValue) => handleRatingChange(newValue)}
            precision={0.5}
            emptyIcon={<StarPurple500Icon style={{ opacity: 0.55 }} fontSize="inherit" />}
            className="custom-rating"
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
