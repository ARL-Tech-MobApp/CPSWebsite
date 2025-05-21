import React from "react";

interface ImagePreviewModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <img
        src={imageUrl}
        alt="Full Visiting Card"
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: 8,
          boxShadow: "0 0 10px #fff",
        }}
      />
    </div>
  );
};

export default ImagePreviewModal;