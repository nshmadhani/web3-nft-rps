import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import EpicRPS from '../../contracts/contract';
import { MinButton, NFT } from '../NFT';

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {
  
  const [defaultCharacters, setDefaultCharacters] = useState(0);

  useEffect(async () =>{

		let defChars = await EpicRPS.getDefaultCharacters();
		if(defChars)
			setDefaultCharacters(defChars);
  },[]);

 
  
  return (
    <div className="select-character-container">
     <h2>Mint Your Hero. Choose wisely.</h2>
			<div className ="character-grid">
			{defaultCharacters && 
		 	defaultCharacters.map((character, index) => (
				<NFT key={index} rawCharacter={character}>
					<MinButton key={index} onClick={setCharacterNFT} character={character}></MinButton>
				</NFT>
			))
		 }
			</div>
     
    </div>
  );
}

export default SelectCharacter;