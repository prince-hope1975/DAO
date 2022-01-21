import sdk from "./1-initialize-sdk.js";

//grab app module address

const appModule = sdk.getAppModule(
  "0x1f5DAFCe869B711d4993e61a29905356606B3469"
);
(async () => {
  try {
    const voteModule = await appModule.deployBundleDropModule({
      // Give your governance cintract a name
      name: "YouthDAO's Awesome Proposals",

      // This is the location of our Governance token ERC-20 contract !\
      votingTokenAddress: "0xf04200aECf2ED125640180136014482bd4bB1Cf4",

      //   after a proposal is created, when can members start voting
      // For now we set this to immediately

      proposalStartWaitTimeInSeconds: 0,

      // How long do members have to voote on a proposal when it's created?
      // Here, we set it tp 24 ghours (86400 seconds)
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      // will explain more below
      votingQuorumFraction: 0,
      //   This specifies the minimum required tokens needed for the vpte tp be passed

      // What is the minimum # of tokens a user needs to be allowed tp create a proposal?
      // I set it to  0. Meanibg no tekens are required for a user to be allowed to create a proposal
      minimumNumberOfTokensNeededToPropose: "0",
    });
    console.log(
      "✅ Successfully deployed vote module, address",
      voteModule.address
    );
  } catch (e) {
    console.error("Failed to deploy vote module ", e);
  }
})();
