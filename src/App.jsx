import { useEffect, useMemo, useState } from "react";
import {ethers} from "ethers";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { id } from "ethers/lib/utils";
const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0xF67775E2D92Ae0f6f174D84Fb9e6c05D726Dd030"
);
const tokenModule = sdk.getTokenModule(
  "0xf04200aECf2ED125640180136014482bd4bB1Cf4"
);
const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address", address);

  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  const [isClaiming, setIsClaiming] = useState(false);

  //Holds then amount of token each member has in state
  const  [ memberTokenAmounts, setMemberTokenAmounts] = useState({})
  //The array holding all of our memvers addresses
  const [membersAddresses, setMembersAddresses] = useState([])

  // A fancy function to shorten someones wallet address, no nooed to show the whole thing
  const shortenAddress =(str) =>{
    return str.substring(0,6) + "..." + str.substring(str.length-4)

  }
  useEffect(()=>{
    if(!hasClaimedNFT){
      return
    }
// just lik ewe did in the 7-airdrop-token.js file! Grab the users  who hold thee nft
// with the token id of #0
    bundleDropModule.
    getAllClaimerAddresses("0".
    then(addresses=>{
      console.log("🚀 Members addresses", addresses)
      setMembersAddresses(addresses)
    })).
    catch(err=>{
      console.error("Failed to get member list", err)
    })

  },[hasClaimedNFT])
  // This useEffect grabs the # of tokens each member holds
  useEffect(() => {
    if(!hasClaimedNFT)return
    //Grab all the balances

    tokenModule.getAllHolderBalances()
    .then(amounts=>{
      console.log("👜 Amounts ", amounts)
      setMemberTokenAmounts(amounts)
    })
    .catch(err=>{
      console.error("Failed ot get token amounts", err)
    })

  }, [hasClaimedNFT])

  // Now we combine the membersAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(()=>{
    return membersAddresses.map(address=>{
      return {
        address,  tokenAmount: ethers.utils.formatUnits(
          // if athe address isn't in membersTookenAmount, it means they don't
          // hold any of out tikens.
          memberTokenAmounts[address] || 0,
          18
        )
      }
    })
  },[membersAddresses, memberTokenAmounts])
  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

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
  if (hasClaimedNFT) {
    return (
     <div classsName="member-page">
       <h1>
         🎓 DAO member Page
         <p>Congratulations on being a member</p>
         <div>
           <h2>
             Member list
           </h2>
           <table className="card">
             <thead>
               <tr>
                 <th>Address</th>
                 <th>Token Amount </th>
               </tr>
             </thead>
             <tbody>
               {memberList.map(member=>{
                 return (
                   <tr key={member.address}>
                     <td>{shortenAddress(member.address)} </td>
                     <td>{member.tokenAmount} </td>
                   </tr>
                 )
               })}
             </tbody>
           </table>
         </div>
       </h1>

     </div>
    );
  }
  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        setHasClaimedNFT(true);

        console.log(
          `🌊 Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
      })
      .catch((err) => {
        console.error("Failed to Claim", err);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  };
  return (
    <div className="landing">
      <h1>Mint your free 🎓 DAO membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};;

export default App;
