const Moralis = require("moralis/node");
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APPID;
const web3 = require("web3");
Moralis.start({ serverUrl, appId });

export default async function handler(req, res) {
  if (req.method === "POST" && web3.utils.isAddress(req.body.address)) {
    const eth = await Moralis.Web3API.account.getNFTs({
      chain: "eth",
      address: req.body.address,
    });
  }
  
}
