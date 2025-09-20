// VirtualCourtOverlay.js
import React from "react";
import VirtualCourt from "../court/VirtualCourt1";

const VirtualCourtOverlay = ({ currentUser, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <button
        className="absolute top-4 right-4 text-white text-xl z-50 bg-red-600 rounded-full w-10 h-10 flex items-center justify-center"
        onClick={onClose}
      >
        ✕
      </button>
      <VirtualCourt
        currentUser={currentUser || { id: "guest", name: "زائر" }}
        roomId="main"
        onClose={onClose}
      />
    </div>
  );
};

export default VirtualCourtOverlay;
