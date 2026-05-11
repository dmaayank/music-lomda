import React from "react";
import { useState } from "react";
import '../css/card.css';
const Card = ({ name }) => {

  const [isFlipped, setIsFlipped] = useState(false);
  const [toShowPage, setToShowPage] = useState(false)

  const imageUrl = `${import.meta.env.BASE_URL}images/${name.toLowerCase()}.png`;

  const myStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const showInfo = () => {

  }



  return (
    <>
      <div className="card-container" style={myStyle} onClick={() => setToShowPage(true)}>
        <h5 className="name">{name}</h5>
      </div>
    </>
  );
}


export default Card;
