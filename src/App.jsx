import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0xF67775E2D92Ae0f6f174D84Fb9e6c05D726Dd030"
);
const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address", address);

 const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

 useEffect(() => {
   // If they don't have an connected wallet, exit!
   if (!address) {
     return;
   }

   // Check if the user has the NFT by using bundleDropModule.balanceOf
   return bundleDropModule
     .balanceOf(address, "0")
     .then((balance) => {
       // If balance is greater than 0, they have our NFT!
       if (balance.gt(0)) {
         setHasClaimedNFT(true);
         console.log("🌟 this user has a membership NFT!");
       } else {
         setHasClaimedNFT(false);
         console.log("😭 this user doesn't have a membership NFT.");
       }
     })
     .catch((error) => {
       setHasClaimedNFT(false);
       console.error("failed to get nft balance", error);
     });
 }, [address]);

  if (!address) {
    return (
      <div className="landing">
        Welcome To Youth DAO
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect Your Wallet
        </button>
      </div>
    );
  }
  return (
    <div className="landing">
      <h1>🎓🎓🎓 Welcome to My Youth DAO</h1>
    </div>
  );
};

export default App;
