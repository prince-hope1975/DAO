import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

//This is the contract address of our ERC-20 contract princted out in the step before ie script 5

const tokenModule = sdk.getTokenModule(
  "0xf04200aECf2ED125640180136014482bd4bB1Cf4"
);

(async () => {
try{//Max supply of tokens
  const amount = 1_000_000;

  //We use the util function from ethes to convert the amount
  // to have 18 decimals (Ehic is the standard for ERC20 tokens)
  const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
// interact with your deployed ERC-20 contract and mint the token

  await tokenModule.mint(amountWith18Decimals)
  const totalSupply = await tokenModule.totalSupply()

  //Print out how many of out tokens are out there

  console.log(
      "✅ There now is", ethers.utils.formatUnits(totalSupply, 18), "$YTH in circulation"

  )}
  catch (e){
      console.error("Failed to cPrinct money",error)
  }
})()
