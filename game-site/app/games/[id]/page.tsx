"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Modal from 'react-modal'; // Import the modal library

interface Game {
  id: number;
  name: string;
  cover?: {
    image_id: string;
  };
  summary?: string;
  screenshots?: {
    image_id: string;
  }[];
}

export default function GameDetailsPage({ params }: { params: { id: string } }) {
  const [gameDetails, setGameDetails] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!gameDetails) {
    return <p>No game details found.</p>;
  }

  return (
    <div className="game-details-container">
      {/* Cover Image and Info Section */}
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
      </div>

      {/* Swiper Section */}
      {gameDetails.screenshots && gameDetails.screenshots.length > 0 && (
        <div className="swiper-section">
          <h2 className="screenshots-title">Screenshots</h2>
          <Swiper spaceBetween={20} slidesPerView={3}>
            {gameDetails.screenshots.map((screenshot, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`https://images.igdb.com/igdb/image/upload/t_1080p/${screenshot.image_id}.jpg`}
                  alt={`Screenshot ${index + 1}`}
                  className="screenshot-image"
                  loading="lazy"
                  onClick={() => openModal(`https://images.igdb.com/igdb/image/upload/t_1080p/${screenshot.image_id}.jpg`)} // Open modal on click
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Modal for Full-Size Image */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Full Size Image"
        className="modal" // You can add your custom styles
        overlayClassName="overlay" // Custom overlay styles
      >
        <button onClick={closeModal} className="close-button">&times;</button>
        {selectedImage && (
          <img src={selectedImage} alt="Full Size" className="modal-image" />
        )}
      </Modal>
    </div>
  );
}
