// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract nft is ERC721URIStorage, Ownable {
    uint256 public counter;
    uint256 public totalSupply;
    uint256 listPrice = 0.001 ether;
    mapping(uint256 => address) public tokenOwner;
    mapping(address => uint[]) public countOfTokenId;

    constructor() ERC721("Spiderman", "Spider") Ownable(msg.sender) {}

    function getListPrice() public view returns (uint) {
        return listPrice;
    }

    function Price() public view returns (uint256) {
        if (totalSupply == 0) {
            return 100000000000000;
        }
        uint256 price = 1000000000000000000*(totalSupply)**2 / 8000;
        return price;
    }

    function BuurnPrice() public view returns (uint){
        if(totalSupply==0){
            return 0;
        }
        uint burnsupply=totalSupply-1;
        if (burnsupply == 0) {
            return 100000000000000;
        }
        uint pricee = 1000000000000000000*(burnsupply)**2 / 8000;
        return pricee;
    }

    function NumberOfTokens() public view returns (uint){
        uint count = countOfTokenId[msg.sender].length;
        return count;
    }

    function mint(string calldata _uri) external payable {
        uint256 mintPrice = Price();
        require(msg.value == mintPrice, "please enter correct amount");
        counter++;
         totalSupply++;
        _mint(msg.sender, counter);
        _setTokenURI(counter, _uri);
        tokenOwner[counter] = msg.sender;
        countOfTokenId[msg.sender].push(counter);
    }

    function burn() external payable {
        require(countOfTokenId[msg.sender].length>0,"Sorry don't have enough tokens,Please mint");
        uint length = countOfTokenId[msg.sender].length;
        uint _tokenId = countOfTokenId[msg.sender][length-1];                           
        totalSupply--;
        _burn(_tokenId);
        countOfTokenId[msg.sender].pop();
        payable(msg.sender).transfer(Price());
    }
}
