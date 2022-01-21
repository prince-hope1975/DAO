import {ethers} from "ethers"
import sdk from "./1-initialize-sdk.js"

//This is our governance contract

const voteModule = sdk.getVoteModule(
  "0x1f5DAFCe869B711d4993e61a29905356606B3469"
);

//This is our ERC-20 contract.
const tokenModule = sdk.getTokenModule(
  "0xf04200aECf2ED125640180136014482bd4bB1Cf4"
);

(async ()=>{
    try{
        // Give our treasurry the power to mint additional tokens if needed.
        await tokenModule.grantRole("minter", voteModule.address)
        console.log("✅ Successfully gave vote module permission to act on token module")
    }
    catch(err){
        console.error("Failed to grant vote module permission on token module", err)
        process.exit(1)

    }
    try{
        // Grab our wallet's token balance,
        const ownedTokenBalance = await tokenModule.balanceOf(
            //The wallet address stored in your env file or secrets section on RElp
            process.env.WALLET_ADDRESS
        )

        //Grab 90% of the supply that we hold
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const percent90 = ownedAmount.div(100).mul(90)

        // T
    }
    catch(err){

    }
})()