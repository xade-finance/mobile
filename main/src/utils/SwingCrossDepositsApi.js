import axios from 'axios';
export const getAllSupportedChainsFromSwing = async () => {
  const result = await axios.get('https://platform.swing.xyz/api/v1/chains', {
    headers: {'x-swing-environment': '', Accept: 'application/json'},
  });
  return result.data;
};
export const getQuoteFromSwing = async (
  from,
  to,
  fromUserAddress,
  toUserAddress,
  tokenAmount,
) => {
  console.log('Params', {
    fromChain: from.fromChain,
    fromChainId: from.fromChainId,
    tokenSymbol: from.tokenSymbol,
    fromTokenAddress: from.fromTokenAddress,

    toChain: to.toChain,
    toChainId: to.toChainId,
    toTokenSymbol: to.toTokenSymbol,
    toTokenAddress: to.toTokenAddress,
    fromUserAddress: fromUserAddress,
    tokenAmount: tokenAmount,
    toUserAddress,
    projectId: 'xade', // create your project here: https://platform.swing.xyz/
  });
  try {
    const result = await axios.get(
      'https://swap.prod.swing.xyz/v0/transfer/quote',
      {
        params: {
          fromChain: from.fromChain,
          fromChainId: from.fromChainId,
          tokenSymbol: from.tokenSymbol,
          fromTokenAddress: from.fromTokenAddress,

          toChain: to.toChain,
          toChainId: to.toChainId,
          toTokenSymbol: to.toTokenSymbol,
          toTokenAddress: to.toTokenAddress,
          fromUserAddress: fromUserAddress,
          tokenAmount: tokenAmount,
          toUserAddress,
          projectId: 'xade', // create your project here: https://platform.swing.xyz/
        },
        headers: {Accept: 'application/json'},
      },
    );
    console.log('response...', result.data);
    return result.data;
  } catch (error) {
    console.log('response...', error.response?.data);
  }
};
export const getApprovalCallDataFromSwing = async (
  from,
  to,
  fromUserAddress,
  bridge,
  tokenAmount,
) => {
  console.log('Params', {
    fromChain: from.fromChain,
    fromChainId: from.fromChainId,
    tokenSymbol: from.tokenSymbol,
    fromTokenAddress: from.fromTokenAddress,

    toChain: to.toChain,
    toChainId: to.toChainId,
    toTokenSymbol: to.toTokenSymbol,
    toTokenAddress: to.toTokenAddress,
    fromAddress: fromUserAddress,
    tokenAmount: tokenAmount,
  });
  try {
    const result = await axios.get(
      'https://swap.prod.swing.xyz/v0/transfer/approve',
      {
        params: {
          fromChain: from.fromChain,
          fromChainId: from.fromChainId,
          tokenSymbol: from.tokenSymbol,
          tokenAddress: from.fromTokenAddress,
          toChain: to.toChain,
          toChainId: to.toChainId,
          toTokenSymbol: to.toTokenSymbol,
          toTokenAddress: to.toTokenAddress,
          fromAddress: fromUserAddress,
          tokenAmount: tokenAmount,
          bridge,
          //toUserAddress,
          //projectId: 'xade', // create your project here: https://platform.swing.xyz/
        },
        headers: {Accept: 'application/json'},
      },
    );
    console.log('response...', result.data);
    return result.data;
  } catch (error) {
    console.log('response...', error.response?.data);
  }
};
export const getTxCallDataFromSwing = async (
  from,
  to,
  route,
  fromUserAddress,
  toUserAddress,
  tokenAmount,
) => {
  console.log('Execute transactionn....', {
    fromChain: from.fromChain,
    tokenSymbol: from.tokenSymbol,
    fromTokenAddress: from.fromTokenAddress,
    toChain: to.toChain,
    toTokenSymbol: to.toTokenSymbol,
    toTokenAddress: to.toTokenAddress,
    fromUserAddress: fromUserAddress,
    toUserAddress,
    tokenAmount: tokenAmount,
    integration: route[0].bridge,
    type: 'swap',
    route: [
      {
        bridge: route[0].bridge,
        bridgeTokenAddress: route[0].tokenAddress,
        name: route[0].tokenName,
        part: route[0].part,
        steps: ['allowance', 'approve', 'send'],
      },
    ],
    projectId: 'xade', // create your project here: https://platform.swing.xyz/
  });
  try {
    const result = await axios.get(
      'https://swap.prod.swing.xyz/v0/transfer/send',
      {
        params: {
          fromChain: from.fromChain,
          tokenSymbol: from.tokenSymbol,
          fromTokenAddress: from.fromTokenAddress,
          toChain: to.toChain,
          toTokenSymbol: to.toTokenSymbol,
          toTokenAddress: to.toTokenAddress,
          fromUserAddress: fromUserAddress,
          toUserAddress,
          tokenAmount: tokenAmount,
          integration: route[0].bridge,
          type: 'swap',
          route: [
            {
              bridge: route[0].bridge,
              bridgeTokenAddress: route[0].tokenAddress,
              name: route[0].tokenName,
              part: route[0].part,
              steps: ['allowance', 'approve', 'send'],
            },
          ],
          projectId: 'xade', // create your project here: https://platform.swing.xyz/
        },
        headers: {Accept: 'application/json'},
      },
    );
    console.log('response execute...', result.data);
    return result.data;
  } catch (error) {
    console.log('response...', error);
  }
};
// export const getApprovalCallDataFromSwing = async (
//   from,
//   to,
//   bridge,
//   fromAddress,
//   tokenAmount,
// ) => {
//   const result = await axios.get(
//     'https://swap.prod.swing.xyz/v0/transfer/approve',
//     {
//       fromChain: from.fromChain,
//       fromChainId: from.fromChainId,
//       tokenSymbol: from.tokenSymbol,
//       tokenAddress: from.fromTokenAddress,
//       toChain: to.toChain,
//       toChainId: to.toChainId,
//       bridge: bridge,
//       fromAddress,
//       tokenAmount,
//     },
//   );
//   return result.data;
// };
