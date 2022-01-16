import sdk from "./1-initialize-sdk.js"
import {readFileSync} from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0xF67775E2D92Ae0f6f174D84Fb9e6c05D726Dd030"
);

(async ()=>{
    try{
        await bundleDrop.createBatch([
            {
                name: "Knowledge Is Power",
                description :"This NFT will give you access to YoutDAO",
                image: readFileSync("scripts/assets/Knowledge.gif")

            }
        ]);
        console.log("✅ Successfully created a new NFT in the drop")
    }
    catch(e){
        console.log("Failed to create the new NFT", e)
    }
})()