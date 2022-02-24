# Youth DAO

## DESCRIPTION 👋

This repo contains the code that was used to build Youth Dao and Deploy on the Ethereum(Rinkeby) chain.
To be able to vote one needs exclusive access to the DAO so to enable one be a member of the DAO an NFT must be minted that is according to the <strong>ERC-1155</strong> standard which allows multiple people to share an NFT

The repo a contains scripts that allow you to do things from creating a proposal and fetching the proposals to be displayed on the front end using any front end library eg REACT, to deplying a voting contract, to revoking access to certain actions ,etc.
It contains eleven (11) scripts in total, that were responsible for creating various components of the DAO, from creating the custom token to airdropping and allocating funds to specific or all members of the DAO. Feel free to improve on it as You may

PS: There is a little song i feel may appeal to those who go through the entrie process of casting a vote 👀. Feel free to also request for tokens

## Want to interact with the token on Uniswap?

Copy the token address below and paste it in uniswap, the token with the ticker YTH should appear

```bash
    0xf04200aECf2ED125640180136014482bd4bB1Cf4
```

## PREREQUISITES TO RUN ON LOCAL SYSTEM

- Node.js
- A compatible terminal (For linux and mac users you are good to go, but for windows users i would recommend Gitbash or installing WSL on your machine)
- Metamask browser extension

## RUN ON YOUR LOCAL MACHINE

- `git clone` the repository
- `cd` into the repository

- ` Create` a `.env` file in the root directory

```bash
 touch .env
 # or
 echo .env
```

- Insert the following variables in the `env` file and fill in the env variables

```bash
PRIVATE_KEY (gotten from metamask)
ALCHEMY_API_URL
WALLET_ADDRESS
```

- Install dependencies

```bash
  npm install
  # or
  yarn add
```

- `Start` development server

```bash
npm start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Functionalities

<!-- - [x] Admin can add active participants.
- [x] Admin can reward single address.
- [x] Admin can reward bulk address
- [x] Error Handling to prevent multiple address submissions.
- [x] Address Validation -->

## Technology used

- React.js
- Thirdweb
- ethers

## Preview the site

<a href="https://youthdao.netlify.app">Here</a>
