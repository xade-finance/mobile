import axios from 'axios';

const mobulaBaseURL = 'https://api.mobula.io/api/1/';
const marketRoutes = {getNFTs: '/nft', getWallets: 'wallet/portfolio'};

export const getNftsHoldingForAddress = async address => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}${marketRoutes.getNFTs}?wallet=${address}`,
    );
    console.log('response from nft api:', response?.data?.length);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
export const getCryptoHoldingForAddress = async address => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}`,
    );
    console.log('response from nft api:', response?.data?.data);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};