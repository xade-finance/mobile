import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import {
  listOfWallet,
  particleConnectExecuteTxSameChain,
} from '../../utils/particleConnectSDK';
import {getQuoteFromLifi} from '../../utils/DLNTradeApi';
import {
  connectWitParticleConnect,
  initializedParticleConnect,
} from '../../utils/particleConnectSDK';
import {
  getAllSupportedChainsFromSwing,
  getApprovalCallDataFromSwing,
  getQuoteFromSwing,
  getTxCallDataFromSwing,
} from '../../utils/SwingCrossDepositsApi';
import LottieView from 'lottie-react-native';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import {useDispatch, useSelector} from 'react-redux';
import {Image} from 'react-native';
const CrossChainModal = ({modalVisible, setModalVisible, value}) => {
  // renders
  const [address, setAddress] = useState(false);
  const [assets, setAssets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);
  const [step, setStep] = useState('wallet');
  const [walletType, setWalletType] = useState('wallet');
  const [assetType, setAssetType] = useState(false);
  const [supportedChains, setSupportedChains] = useState([]);
  const evmInfo = useSelector(x => x.portfolio.evmInfo);

  const connectWithSelectedWallet = async walletType => {
    setWalletLoading(true);
    setWalletType(walletType);
    initializedParticleConnect();
    const address = await connectWitParticleConnect(walletType);
    if (address) {
      const supportedNetwork = await getAllSupportedChainsFromSwing();
      setSupportedChains(supportedNetwork);
      setAddress(address);
      setWalletLoading(false);
    }
    setWalletLoading(false);
  };
  const executeSwapFlow = async asset => {
    if (asset?.estimated_balance > value) {
      setAssetType(asset?.asset?.name);
      setAssetLoading(true);
      let usdcToTokenValue =
        (1 / asset?.price)?.toFixed(asset?.contracts_balances[0]?.decimals) *
        Math.pow(10, asset?.contracts_balances[0]?.decimals) *
        value;
      if (asset?.contracts_balances[0]?.chainId !== '137') {
        const destinationChain = supportedChains.filter(
          x => x?.id === asset?.contracts_balances[0]?.chainId,
        );
        console.log('destination', destinationChain);
        //calculation to check usd to btc

        console.log(
          'usdc value....',
          asset?.price,
          1 / asset?.price,
          value.toFixed(asset?.contracts_balances[0]?.decimals),
          Math.pow(10, asset?.contracts_balances[0]?.decimals),
          usdcToTokenValue,
        );
        const quote = await getQuoteFromSwing(
          {
            fromChain: destinationChain[0]?.slug,
            tokenSymbol: asset?.asset?.symbol,
            fromTokenAddress: asset?.contracts_balances[0]?.address,
            fromChainId: destinationChain[0]?.id,
          },
          {
            toChain: 'polygon',
            toTokenSymbol: 'USDC',
            toChainId: '137',
            toTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
          },
          address,
          evmInfo?.smartAccount,
          usdcToTokenValue,
        );
        // console.log('value usd.....', JSON.stringify(quote));
        let bestQuoteTokenOutRoute = quote.routes?.map(x =>
          parseInt(x?.quote?.amount),
        );
        console.log('bestQuoteTokenOutRoute...', bestQuoteTokenOutRoute);
        bestQuoteTokenOutRoute = Math.max(...bestQuoteTokenOutRoute);
        console.log('bestQuoteTokenOutRoute...', bestQuoteTokenOutRoute);
        bestQuoteTokenOutRoute = quote.routes.filter(
          x => parseInt(x?.quote?.amount) === bestQuoteTokenOutRoute,
        );
        if (
          asset?.contracts_balances[0]?.address ===
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        ) {
          const executeTransaction = await getTxCallDataFromSwing(
            {
              fromChain: destinationChain[0]?.slug,
              tokenSymbol: asset?.asset?.symbol,
              fromTokenAddress: '0x0000000000000000000000000000000000000000',
              fromChainId: destinationChain[0]?.id,
            },
            {
              toChain: 'polygon',
              toTokenSymbol: 'USDC',
              toChainId: '137',
              toTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
            },
            {
              bridge: bestQuoteTokenOutRoute[0]?.route[0]?.bridge,
              tokenAddress:
                bestQuoteTokenOutRoute[0]?.route[0]?.bridgeTokenAddress,
              tokenName: bestQuoteTokenOutRoute[0]?.route[0]?.name,
              part: bestQuoteTokenOutRoute[0]?.route[0]?.part,
            },
            address,
            evmInfo?.smartAccount,
            usdcToTokenValue,
          );
          console.log('Tx to be signed......', executeTransaction);
        } else {
          const approval = await getApprovalCallDataFromSwing(
            {
              fromChain: destinationChain[0]?.slug,
              tokenSymbol: asset?.asset?.symbol,
              fromTokenAddress: asset?.contracts_balances[0]?.address,
              fromChainId: destinationChain[0]?.id,
            },
            {
              toChain: 'polygon',
              toTokenSymbol: 'USDC',
              toChainId: '137',
              toTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
            },
            address,
            bestQuoteTokenOutRoute[0]?.quote?.integration,
            usdcToTokenValue,
          );
          if (approval) {
            const executeTransaction = await getTxCallDataFromSwing(
              {
                fromChain: destinationChain[0]?.slug,
                tokenSymbol: asset?.asset?.symbol,
                fromTokenAddress: asset?.contracts_balances[0]?.address,
                fromChainId: destinationChain[0]?.id,
              },
              {
                toChain: 'polygon',
                toTokenSymbol: 'USDC',
                toChainId: '137',
                toTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
              },
              {
                bridge: bestQuoteTokenOutRoute[0]?.route[0]?.bridge,
                tokenAddress:
                  bestQuoteTokenOutRoute[0]?.route[0]?.bridgeTokenAddress,
                tokenName: bestQuoteTokenOutRoute[0]?.route[0]?.name,
                part: bestQuoteTokenOutRoute[0]?.route[0]?.part,
              },
              address,
              evmInfo?.smartAccount,
              usdcToTokenValue,
            );
            console.log('Tx to be signed......', approval, executeTransaction);
          }
          console.log(
            'bestQuoteTokenOutRoute...',
            approval,
            bestQuoteTokenOutRoute,
          );
        }
      } else {
        console.log('executing same chain.....');
        const sameChainQuotes = await getQuoteFromLifi(
          asset?.contracts_balances[0]?.chainId,
          '137',
          asset?.contracts_balances[0]?.address ===
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : asset?.contracts_balances[0]?.address,
          '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
          usdcToTokenValue,
          address,
        );
        if (sameChainQuotes?.data?.transactionRequest) {
          await particleConnectExecuteTxSameChain(
            walletType,
            address,
            asset?.contracts_balances[0]?.address ===
              '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              ? '0x0000000000000000000000000000000000000000'
              : asset?.contracts_balances[0]?.address,
            sameChainQuotes?.data?.transactionRequest,
            usdcToTokenValue,
          );
        }
      }
    }
    setAssetLoading(false);
  };
  useEffect(() => {
    const ws = new W3CWebSocket(
      'wss://portfolio-api-wss-fgpupeioaa-uc.a.run.app',
    );
    if (address) {
      ws.onopen = () => {
        const payload = {
          type: 'wallet',
          authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99',
          payload: {
            wallet: address,
            interval: 15,
          },
        };

        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = event => {
        const parsedValue = JSON.parse(event?.data)?.assets;
        setAssets(parsedValue);
        setStep('asset');
      };

      ws.onerror = event => {
        console.error('WebSocket error:', event);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
    return () => {
      ws.close();
    };
  }, [address]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      {/* background: #1E1E1ECC;
       */}
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {backgroundColor: isLoading ? '#000' : '#1E1E1EF2'},
          ]}>
          <View
            style={{
              height: 6,
              width: '20%',
              backgroundColor: '#000',
              borderRadius: 12,
              alignSelf: 'center',
              opacity: 0.7,
            }}
          />
          <Text
            style={{
              marginTop: 12,
              marginBottom: 12,
              color: 'white',
              fontFamily: `NeueMontreal-Bold`,
              fontSize: 20,
              lineHeight: 24,
            }}>
            {step === 'wallet' ? `Choose your wallet` : `Choose your asset`}
          </Text>
          {isLoading && (
            <View
              style={{
                justifyContent: 'center',
                height: '80%',
                width: '100%',
                backgroundColor: isLoading ? '#000' : '#fff',
              }}>
              <LottieView
                source={require('../../../assets/lottie/iosLottieLoader.json')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                }}
                autoPlay
                loop
              />
            </View>
          )}
          {!isLoading && step === 'wallet' && (
            <View style={styles.listWrap}>
              {listOfWallet.map((wallets, i) => {
                return (
                  <Pressable
                    key={i}
                    style={{
                      width: '100%',
                      padding: 12,
                      //   marginBottom: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={async () =>
                      connectWithSelectedWallet(wallets?.name)
                    }>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 40,
                          backgroundColor: '#393939',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={{uri: wallets?.url}}
                          style={{
                            width: 24,
                            height: 24,
                            alignSelf: 'center',
                            justifyContent: 'center',
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: `NeueMontreal-Semibold`,
                          fontSize: 16,
                          lineHeight: 19.2,
                          marginLeft: 8,
                        }}>
                        {wallets?.name}
                      </Text>
                    </View>
                    {walletType === wallets?.name && walletLoading ? (
                      <ActivityIndicator size={16} color="#fff" />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          )}
          {!isLoading && step === 'asset' && (
            <View style={styles.listWrap}>
              {assets.map((asset, i) => {
                return (
                  <Pressable
                    key={i}
                    style={{
                      width: '100%',
                      padding: 12,
                      //   marginBottom: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={async () => await executeSwapFlow(asset)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '70%',
                      }}>
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 40,
                          backgroundColor: '#393939',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={{uri: asset?.asset?.logo}}
                          style={{
                            width: 24,
                            height: 24,
                            alignSelf: 'center',
                            justifyContent: 'center',
                          }}
                        />
                      </View>
                      <View>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: 'white',
                            fontFamily: `NeueMontreal-SemiBold`,
                            fontSize: 16,
                            lineHeight: 19.2,
                            marginLeft: 8,
                            maxWidth: '100%',
                          }}>
                          {asset?.asset?.name}
                        </Text>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: `NeueMontreal-Medium`,
                            fontSize: 16,
                            lineHeight: 19.2,
                            marginLeft: 8,
                            maxWidth: '100%',
                          }}>
                          {asset?.token_balance}
                          {asset?.asset?.symbol}
                        </Text>
                      </View>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: `NeueMontreal-Medium`,
                          fontSize: 16,
                          lineHeight: 19.2,
                          marginLeft: 8,
                        }}>
                        $ {asset?.estimated_balance?.toFixed(2)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // Align modal at the bottom
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    // height: '90%', // Make modal take full width at the bottom
    backgroundColor: '#fff',
    borderTopRightRadius: 16, // Only round the top corners
    borderTopLeftRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listWrap: {
    // flexDirection: 'row', // Align items in a row
    // flexWrap: 'wrap', // Allow items to wrap to the next line
    // justifyContent: 'center', // Align items to the start of the container
    // padding: 8, // Add some padding around the container
    marginTop: '4%',
  },
});

export default CrossChainModal;
