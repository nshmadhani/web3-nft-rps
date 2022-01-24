//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./lib/Base64.sol";

contract EpicRPS is ERC721 {
    //So to use Counter as a "datatype" we are specifying the Counters lib for it. to make it into "a class"
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    CharacterAttributes[] defaultCharacters;

    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHP;
        uint256 attackDamage;
    }

    mapping(uint256 => CharacterAttributes) public nftCharacters;
    mapping(address => uint256) public nftHolders;
    
    CharacterAttributes public Boss;




    event NFTCharacterMinted(
        address receiver,
        uint256 nftTokenID,
        uint256 characterIndex
    );
    event BossAttacked(
        uint BossHP,
        uint playerHP
    );

    /* 
        0 index will be Boss
    */
    constructor(
        string[] memory characterNames,
        string[] memory characterImages,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDamage
    ) ERC721("Jawan", "JWN")  {

        Boss = CharacterAttributes(
                    0,
                    characterNames[0],
                    characterImages[0],
                    characterHp[0],
                    characterHp[0],
                    characterAttackDamage[0]
                );

        
        for (uint256 i = 1; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes(
                    i,
                    characterNames[i],
                    characterImages[i],
                    characterHp[i],
                    characterHp[i],
                    characterAttackDamage[i]
                )
            );
            CharacterAttributes memory c = defaultCharacters[i-1];
            console.log(
                "Done initializing %s w/ HP %s, img %s",
                c.name,
                c.hp,
                c.imageURI
            );
        }
        _tokenIDs.increment();
    }

    function mintNFTCharacter(uint256 _indexOfCharacter) external {
        uint256 nftID = _tokenIDs.current();

        _safeMint(msg.sender, nftID);

        nftCharacters[nftID] = CharacterAttributes(
            _indexOfCharacter,
            defaultCharacters[_indexOfCharacter].name,
            defaultCharacters[_indexOfCharacter].imageURI,
            defaultCharacters[_indexOfCharacter].hp,
            defaultCharacters[_indexOfCharacter].maxHP,
            defaultCharacters[_indexOfCharacter].attackDamage
        );

        nftHolders[msg.sender] = nftID;

        emit NFTCharacterMinted(msg.sender, nftID, _indexOfCharacter);

        _tokenIDs.increment();
    }


    function attackBoss() public {
        // Get the state of the player's NFT.
        uint tokenID = nftHolders[msg.sender];
        console.log("User has the token %d", tokenID);
        CharacterAttributes memory playerChar = nftCharacters[tokenID];
        
        console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", playerChar.name, playerChar.hp, playerChar.attackDamage);
        console.log("Boss %s has %s HP and %s AD", Boss.name, Boss.hp, Boss.attackDamage);


        // Make sure the player has more than 0 HP

        require(playerChar.hp > 0, "Player is Dead");
        // Make sure the boss has more than 0 HP.
        require(Boss.hp > 0, "Boss is Dead yoo!");
        // Allow player to attack boss.

        Boss.hp = Boss.hp - playerChar.attackDamage;
        // Allow boss to attack player.
        playerChar.hp = playerChar.hp - Boss.attackDamage;

        emit BossAttacked(Boss.hp, playerChar.hp);

        console.log("Player attacked boss. New boss hp: %s", Boss.hp);
        console.log("Boss attacked player. New player hp: %s\n", playerChar.hp);

    }

    

    function tokenURI(uint256 _tokenID)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory character = nftCharacters[_tokenID];

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                character.name,
                " -- NFT #: ",
                Strings.toString(_tokenID),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                character.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                Strings.toString(character.hp),
                ', "max_value":',
                Strings.toString(character.maxHP),
                '}, { "trait_type": "Attack Damage", "value": ',
                Strings.toString(character.attackDamage),
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }


    function getMintedNFT() public view returns(string memory) {
        uint tokenID = nftHolders[msg.sender];
        // If the user has a tokenId in the map, return their character.
        if(tokenID > 0) return tokenURI(tokenID);
        else return "";

    }

    function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
        // Get the tokenId of the user's character NFT
        uint tokenID = nftHolders[msg.sender];
        // If the user has a tokenId in the map, return their character.
        if(tokenID > 0) return nftCharacters[tokenID];
        // Else, return an empty character.
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }
    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
        return defaultCharacters;
    }
    function getBigBoss() public view returns (CharacterAttributes memory) {
        return Boss;
    }



}
