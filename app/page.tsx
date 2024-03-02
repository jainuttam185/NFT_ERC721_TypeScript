"use client";
import Image from "next/image";
import { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import nft from "../frontend/app/artifacts/contracts/nft.sol/nft.json";
import styles from "./page.module.css";
import spidermanImage from "./spiderman.jpeg";
const ethers = require("ethers");
import { Nft__factory, Nft } from "../typechain-types";

interface IState{
  token: number
  outputValue: string;
  contract: Nft;
  Provider: string;
  ipfsaddress: string;
  toaddress: string;
  contractAddress: string;
  loading: boolean;
  isloading: boolean;
  burnloading: boolean;
  mintPrice: number;
  burnPrice: number;
  number: number;
}

class CampaignIndex extends Component {
  state = {
    token: 0,
    outputValue: "",
    Provider: "",
    ipfsaddress:
      "ipfs://bafkreidblxpobb5frd57djj43mavu2ixtbyrofqq3ieflpwavaoqq524yq",
    toaddress: "0xf261F307159B06BeAAB840fe4281d456F5156A50",
    contractAddress: "0x3754b370b2da7CbE45d587A72afb92E5287de0ed",
    loading: false,
    isloading: false,
    burnloading: false,
    mintPrice: 0,
    burnPrice: 0,
    number:0,
  } as IState;

  async componentDidMount() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    if (provider) {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      //setAccount(address);
      // const contractAddress = "0xcC680Ce60E640F8BEF955AC5fDe00F4700DC97D3";
      console.log(provider);
      const contract = new ethers.Contract(
        this.state.contractAddress,
        nft.abi,
        signer
      );

      //this.setState.contract=contract;
      this.setState({
        contract: contract,
      });
      this.setState({
        Provider: signer,
      });
      this.setState({
        mintPrice: await contract.Price(),
      });
      this.setState({
        burnPrice: await contract.BuurnPrice(),
      });
      this.setState({
        number: await contract.NumberOfTokens(),
      });
      // this.setState.Token1Contract=Token1Contract;
      // this.setState.Token2Contract=Token2Contract;
      // this.setState.Provider=signer;
    } else {
      alert("Metamask is not installed.");
    }

    // this.setState({
    //   reserveOut: await contract.reserve1()
    // });
    // this.setState.reserveOut = await contract.reserve1();
    // console.log("line1", parseInt(this.state.reserveIn));
    // console.log("line2", parseInt(this.state.reserveOut));
  }
  onSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      console.log(this.state.contract);
      event.preventDefault();
      this.setState({ loading: true });
      this.setState({ isloading: true });
      const price = await this.state.contract.Price();
      const mint = await this.state.contract.mint(this.state.ipfsaddress, {
        value: price,
      });
      this.state.loading && toast("Please wait for few seconds");
      //toast(mint ,{pending:"Please wait for few seconds",success:"Mint Successfull",error:"Sorry,Mint failed"});
      await mint.wait();
      // this.setState({ loading: false });
      toast("Mint Successfull");
      this.setState({
        mintPrice: await this.state.contract.Price()
      });
      this.setState({
        burnPrice: await this.state.contract.BuurnPrice()
      });
      this.setState({
        number: await this.state.contract.NumberOfTokens()
      });
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message.split("(")[0];
      const fullMessage = errorMessage[0].toUpperCase() + errorMessage.slice(1);
      toast(fullMessage);
    } finally {
      this.setState({ loading: false });
      this.setState({ isloading: false });
    }
  };

  onSubmitBurn = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      console.log(this.state.contract);
      event.preventDefault();
      this.setState({ loading: true });
      this.setState({ burnloading: true });
      const burn = await this.state.contract.burn();
      this.state.loading && toast("Please wait for few seconds");
      await burn.wait();
      toast("Burn Successfull");
      this.setState({
        mintPrice: await this.state.contract.Price()
      });
      this.setState({
        burnPrice: await this.state.contract.BuurnPrice()
      });
      this.setState({
        number: await this.state.contract.NumberOfTokens()
      });
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message.split("(")[0];
      const fullMessage = errorMessage[0].toUpperCase() + errorMessage.slice(1);
      toast(fullMessage);
    } finally {
      this.setState({ loading: false });
      this.setState({ burnloading: false });
    }
  };

  render() {
    return (
      <div className={styles.full}>
        <ToastContainer />
        <div className={styles.header}>
          <h2 className={styles.header2}>UTTAM MINT NFT</h2>
        </div>
        <div className={styles.top}>
          <div className={styles.box}>
            <div className={styles.token1}>SpiderMan NFT</div>
            <div className={styles.imageContainer}>
              <Image
                src={spidermanImage}
                alt="Spiderman"
                className={styles.image}
              />
            </div>
            <button
              disabled={this.state.isloading}
              className={styles.button}
              onClick={this.onSubmit}
            >
              {this.state.isloading ? (
                <p className={styles.spinner}></p>
              ) : (
                "Mint"
              )}
            </button>
            <div className={styles.price}>
                   <div className={styles.innerPrice}  style={this.state.number ==   0 ? { width:'400px'} : {}}>Mint Price: <br/>{Number(this.state.mintPrice.toString())/1000000000000000000} Eth</div>
                   {this.state.number>0 ? <div className={styles.innerPrice}>Burn Price: <br/>{Number(this.state.burnPrice.toString())/1000000000000000000} Eth</div> : ""}
            </div>
                {
                  this.state.number > 0 ?
                  <button
                  disabled={this.state.burnloading}
                  className={styles.buttonBurn}
                  onClick={this.onSubmitBurn}
                >
                  {this.state.burnloading ? (
                    <p className={styles.spinner}></p>
                  ) : (
                    "Burn"
                  )}
                </button> : ""
                }
              </div>
            </div>
          </div>
    );
  }
}

export default CampaignIndex;


