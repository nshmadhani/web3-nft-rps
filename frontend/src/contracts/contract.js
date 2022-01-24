import { ethers } from 'ethers';
import * as contractMetadata from "./metadata/EpicRPS";

const contractAddr = "0x106fd0efedc1b769AcdB92c070Ea270a967406c6";



export default class EpicRPS {
  //Attack the Boss
  //Get the Boss

  static contract = null;
  static etherem
  static async load(ethereum) {

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    this.contract = new ethers.Contract(
      contractAddr,
      contractMetadata.abi,
      signer
    );
  }


  //Returns Metadata for user
  static async getMintedNFT(address) {
    return await this.contract.checkIfUserHasNFT();
  }

  static async getDefaultCharacters() {
    return await this.contract.getAllDefaultCharacters();
  }

  static async mintCharacterNFT(index) {
    return await this.contract.mintNFTCharacter(index);
  } 


  static async attackBoss() {
    return await this.contract.attackBoss();
  }

  static getContract() {
    return this.contract;
  }








  
}