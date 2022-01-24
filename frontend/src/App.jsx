import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import EpicRPS from './contracts/contract';
import SelectCharacter from './Components/SelectCharacter';
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;







const App = () => {


  const [currentAccount, setCurrentAccount] = useState(0);
  const [userNFT, setUserNFT] = useState(0);
  const [contractLoaded, setContractLoaded] = useState(false);

  useEffect(() => {
    checkIfUserWalletConnected();
  },[]);

  useEffect(() => {

    const init = async () => {
      const {ethereum} = window;
      await EpicRPS.load(ethereum);
      setContractLoaded(true);
      
    }
    init();
  },[currentAccount]);

  useEffect(() => {

    checkifUserHasMinted();
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );
      checkifUserHasMinted();
    };
    EpicRPS.getContract().on('NFTCharacterMinted', onCharacterMint);


    return () => {
      EpicRPS.getContract().off('NFTCharacterMinted', onCharacterMint);
    }


  }, [contractLoaded]);
  

  const checkIfUserWalletConnected = async () => {

    try {
        const {ethereum} =  window;
        if(!ethereum) {
          alert("Please install MetaMask Wallet");
          return;
        }
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
              const account = accounts[0];
              console.log('Found an authorized account:', account);
              setCurrentAccount(account);

        } else {
              console.log('No authorized account found');
        }
    } catch(e) {
      alert("Error Occured while Check if Connected");
      console.error(e);
    }
  };

  const connectWalletAction = async () => {
    try {
        const {ethereum} =  window;
        if(!ethereum) {
          alert("Please install MetaMask Wallet");
          return;
        }
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log('Connected', accounts[0]);
        setCurrentAccount(accounts[0]);
    } catch(e) {
      console.error(e)
    }
  };

  const checkifUserHasMinted = async () => {
    try {
        const {ethereum} =  window;
        if(!ethereum) {
          alert("Please install MetaMask Wallet");
          return;
        }
        const mintedNFT = await EpicRPS.getMintedNFT(currentAccount);
        console.log(mintedNFT);
        if(mintedNFT.name) 
          setUserNFT(mintedNFT);
        
    } catch(e) {
      console.log("CheckifUserHasMinted");
      console.error(e)
    }
  }

  const mintUserNFT = async (userChoice) => {

    const _index = userChoice.characterIndex;
    console.log('Minting character in progress...');
    const mintTxn = await EpicRPS.mintCharacterNFT(_index);
    await mintTxn.wait();
    console.log('mintTxn:', mintTxn);




  }


  const renderMain =  () => {
    console.log("RenderMain");
    if(!currentAccount) {
        return (
           <div className="connect-wallet-container">
            <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
         
              <button
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
              Connect Wallet To Get Started
            </button>  
          </div>
        );
    } else if(userNFT) {
      return (<div>{JSON.stringify(userNFT)}</div>);
    } else   return (<SelectCharacter setCharacterNFT={mintUserNFT}></SelectCharacter>)


  }

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>

          {renderMain()}
          


        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
