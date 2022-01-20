import sdk from "./1-initialize-sdk.js"

const app = sdk.getAppModule("0x1f5DAFCe869B711d4993e61a29905356606B3469");

(async ()=>{
    try{
        const tokenModule = await app.deployTokenModule({
            name: "Youth DAO",
            symbol: "YTH"

        })
        console.log("✅ Successfully deployed token module, address", tokenModule.address)
    }
    catch(e){
console.err0r("Failed to deploy token module ", e) 
    }
})()