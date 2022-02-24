import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import {UnsupportedChainIdError} from "@web3-react/core"
const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0xF67775E2D92Ae0f6f174D84Fb9e6c05D726Dd030"
);
const tokenModule = sdk.getTokenModule(
  "0xf04200aECf2ED125640180136014482bd4bB1Cf4"
);
const voteModule = sdk.getVoteModule(
  "0x8C562da3ADd93DF28b7817D8D38E77E9eaB35F98"
);
const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address", address);

  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  const [isClaiming, setIsClaiming] = useState(false);

  //Holds then amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  //The array holding all of our memvers addresses
  const [membersAddresses, setMembersAddresses] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(async () => {
    if (!hasClaimedNFT) return;
    try {
      const proposals = await voteModule.getAll();
      setProposals(proposals);
      console.log("🌈 Proposals: ", proposals);
    } catch (error) {
      console.log("Failed to get Proposals ", error);
    }
  }, [hasClaimedNFT]);
  //Check if the user has already voted
  useEffect(async () => {
    if (!proposals.length) {
      return;
    }
    try {
      const hasVoted = await voteModule.hasVoted(
        proposals[0].proposalId,
        address
      );
      setHasVoted(hasVoted);
      if (hasVoted) {
        console.log("🥵 User has already voted");
      } else {
        console.log("😋 User has not voted yet");
      }
    } catch (e) {
      console.log("Failed to check if wallet has voted ", e);
    }
  }, [hasClaimedNFT, proposals, address]);
  // A fancy function to shorten someones wallet address, no nooed to show the whole thing
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // just lik ewe did in the 7-airdrop-token.js file! Grab the users  who hold thee nft
    // with the token id of #0
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🚀 Members addresses", addresses);
        setMembersAddresses(addresses);
      })
      .catch((err) => {
        console.error("Failed to get member list", err);
      });
  }, [hasClaimedNFT]);
  // This useEffect grabs the # of tokens each member holds
  useEffect(() => {
    if (!hasClaimedNFT) return;
    //Grab all the balances

    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts ", amounts);
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("Failed ot get token amounts", err);
      });
  }, [hasClaimedNFT]);

  // Now we combine the membersAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return membersAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // if the address isn't in membersTokenAmount, it means they don't
          // hold any of out tokens.
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [membersAddresses, memberTokenAmounts]);
  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(async () => {
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
  if(error instanceof UnsupportedChainIdError){
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby </h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks in your connected wallet and make sure you have rinkeby Eth
        </p>
      </div>
    );
  }

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
      <div className="member-page">
        <h1>🎓 DAO member Page</h1>

        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member list</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount </th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)} </td>
                      <td>{member.tokenAmount} </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <div>
              <h2>Active Proposals</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  //before we do async things, we want to disable the butten to prevent double clocks
                  setIsVoting(true);
                  //lets get the votes from the form for the values
                  const votes = proposals.map((proposal) => {
                    let voteResults = {
                      proposalId: proposal.proposalId,
                      // abstain by default
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + "-" + vote.type
                      );
                      if (elem.checked) {
                        voteResults.vote = vote.type;
                        return;
                      }
                    });
                    return voteResults;
                  });
                  try {
                    const delegation = await tokenModule.getDelegationOf(address);
                    // if the delegation is  0x0 address that means they have not delegated their governance tokens yet
                    if (delegation === ethers.constants.AddressZero) {
                      await tokenModule.delegateTo(address);
                    }
                    // then we need to vote on the proposal
                    try {
                      await Promise.all(
                        votes.map(async (vote) => {
                          const proposal = await voteModule.get(vote.proposalId);
                          if (proposal.state === 1) {
                            return voteModule.vote(vote.proposalId, vote.vote);
                          }
                          return;
                        })
                      );
                      try {
                        await Promise.all(
                          votes.map(async (vote) => {
                            const proposal = await voteModule.get(
                              vote.proposalId
                            );
                            if (proposal.state === 4) {
                              return voteModule.execute(vote.proposalId);
                            }
                          })
                        );
                        setHasVoted(true);
                        console.log("Succesfully voted");
                      } catch (e) {
                        console.log("failed To execute votes", e);
                      }
                    } catch (e) {
                      console.error("Failed to vote", e);
                    }
                  } catch (e) {
                    console.error("Failed to delegate tokens");
                  } finally {
                    setIsVoting(false);
                  }
                }}
              >
                {proposals.map((proposal, index) => {
                  return (
                    <div key={proposal.proposalId} className="card">
                      <h5>{proposal.description}</h5>
                      <div>
                        {proposal.votes.map((vote) => (
                          <div key={vote.type}>
                            <input
                              type="radio"
                              id={proposal.proposalId + "-" + vote.type}
                              name={proposal.proposalId}
                              value={vote.type}
                              // default the "abstain" vot eto checked
                              defaultChecked={vote.type === 2}
                            />
                            <label
                              htmlFor={proposal.proposalId + "-" + vote.type}
                            >
                              {vote.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <button disabled={isVoting || hasVoted} type="submit">
                  {isVoting
                    ? "voting..."
                    : hasVoted
                    ? "You Already voted"
                    : "Submit votes"}
                </button>
                <small>
                  This will trigger multiple transactions please do well to sign all
                </small>
              </form>
            </div>
          </div>
        </div>
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
};

export default App;
