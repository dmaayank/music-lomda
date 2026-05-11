import React from "react";
import {useState} from "react";
import '../css/card.css';
const Text = ({title,text}) => {
    
return (
    <>
      <div className= "text-container">
        <div className = "card-inner">
                    <h2>{title}</h2>
                <hr />
            <div className="card-text">
                <p className="example-text">
                    <strong></strong> <br />
                    {text}
                </p>
            </div>
        </div>
     </div>
    </>
  );
}


export default Text;
