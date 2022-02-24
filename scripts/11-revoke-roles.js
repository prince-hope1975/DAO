import sdk from "./1-initialize-sdk.js"

const tokenModule = sdk.getTokenModule(
  "0xf04200aECf2ED125640180136014482bd4bB1Cf4"
);
(async () => {
  try {
    console.log(
      "👀 Roles that exist now: ",
      await tokenModule.getAllRoleMembers()
    );

    //revoke all the superpowers your wallet has over the ERC-20 contract
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log(
      "🎊 Roles after revoking ourselves",
      await tokenModule.getAllRoleMembers()
    );
    console,
      log("Successfully revoked our superpowers from teh ERC-20 contract");
  } catch (e) {
    console.error("Failed to revoke ourselves from the DAO treasurys ", e );
  }
})();