import React from "react";

export const Modal = ({ callback, children }) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-10 transition-opacity z-10"
        onClick={callback}
      />
      {children}
    </>
  );
};
