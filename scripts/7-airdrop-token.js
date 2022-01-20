import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

//This is the address to our ERC-1155 membership NFT contrct
const bundleDropModule = sdk.getBundleDropModule(
  "0xF67775E2D92Ae0f6f174D84Fb9e6c05D726Dd030"
);

const tokenModule = sdk.getTokenModule(
  "0xf04200aECf2ED125640180136014482bd4bB1Cf4"
);

(async () => {
  try {
    //Grab all the addresses of people who own our membership NFT
    // a token id of 0

    const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");
    if (walletAddresses.length === 0) {
    console.log("No NFTs have been claimed yet, maybe get some friends to  claim your free NFTs!")
    process.exit(0)

    }
    // loop through the array of addresses c
    const airdropTargets  = walletAddresses.map(address=>{
        //Pick a random # betwoeen 1000  and 10000
        const randomAmount = Math.floor(Math.random() * (10000 -  1000 +1) +1000)
        console.log("✅ Going to airdrop", randomAmount, "tokens to ",address)

        //Set up the target
        const airdropTarget ={ address, 
        //Remember , we need 18 decimal places
        amount:  ethers.utils.parseUnits(randomAmount.toString(), 18)

        //
    }
    return airdropTarget;

    })
    //Call transferBatch to all our airdrop targets
    console.log("🌈 Starting airdrop...")
    await tokenModule.transferBatch(airdropTargets)
    console.log("✅ Sucessfully airdropped tokens to all the holdersof the NFT!")
  } catch (err) {
      console.error("Failed to airdrop tokens", err)
  }
})();
