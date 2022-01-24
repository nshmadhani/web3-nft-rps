import React, {useState, useEffect} from 'react';





const transform = (rawCharacter) => {
    return rawCharacter;
}


const MinButton = ({onClick, character}) => {
    return  (
        <button
        type="button"
        className="character-mint-button"
        onClick={() => {onClick(character)}}
      >{`Mint`}</button>
    );
};

const NFT = ({ rawCharacter, children}) => {
    const character  = transform(rawCharacter);
    return (
        <div className="character-item" key={character.name}>
            <div className="name-container">
                <p>{character.name}</p>
            </div>
            <img src={character.imageURI} alt={character.name} />
            {children}
        </div> 
    );
}

export {
    NFT,
    MinButton
}




