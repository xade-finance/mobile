import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {ImageAssets} from '../../../../../assets';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import '@ethersproject/shims';
import {useDispatch, useSelector} from 'react-redux';
import {getBestDLNCrossSwapRate} from '../../../../store/actions/market';
import {useFocusEffect} from '@react-navigation/native';
import {ethers} from 'ethers';
import {
  confirmDLNTransaction,
  getDLNTradeCreateBuyOrderTxn,
} from '../../../../utils/DLNTradeApi';
import {displayNotification} from '../../../../utils/NotifeeSetup';
const idToChain = {
  btc: {
    tokenAddress: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    chain: 'polygon',
    decimal: '18',
  },
  eth: {
    tokenAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    chain: 'polygon',
  },
  matic: {
    tokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    chain: 'polygon',
  },
};
const PendingTxStatusPage = ({route, navigation}) => {
  //   const txQuoteInfo = route.params.state;
  const txQuoteInfo = {
    estimation: {
      srcChainTokenIn: {
        address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        chainId: 137,
        decimals: 6,
        name: 'USD Coin',
        symbol: 'USDC',
        amount: '1000000',
        approximateOperatingExpense: '889937',
        mutatedWithOperatingExpense: false,
      },
      dstChainTokenOut: {
        address: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
        chainId: 56,
        decimals: 18,
        name: 'BTCB Token',
        symbol: 'BTCB',
        amount: '1601934437524',
        recommendedAmount: '1588405839425',
        maxTheoreticalAmount: '1613413752590',
      },
      costsDetails: [
        {
          chain: '137',
          tokenIn: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
          tokenOut: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
          amountIn: '1000000',
          amountOut: '999600',
          type: 'DlnProtocolFee',
          payload: {feeAmount: '400', feeBps: '4'},
        },
        {
          chain: '56',
          tokenIn: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          tokenOut: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          amountIn: '999600000000000000',
          amountOut: '999200160000000000',
          type: 'TakerMargin',
          payload: {feeAmount: '399840000000000', feeBps: '4'},
        },
        {
          chain: '56',
          tokenIn: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          tokenOut: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          amountIn: '999200160000000000',
          amountOut: '109262991824830256',
          type: 'EstimatedOperatingExpenses',
          payload: {feeAmount: '889937168175169744'},
        },
        {
          chain: '56',
          tokenIn: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          tokenOut: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
          amountIn: '109262991824830256',
          amountOut: '1613413752590',
          type: 'AfterSwap',
        },
        {
          chain: '56',
          tokenIn: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
          tokenOut: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
          amountIn: '1613413752590',
          amountOut: '1588405839425',
          type: 'AfterSwapEstimatedSlippage',
          payload: {
            feeAmount: '25007913165',
            feeBps: '155',
            estimatedPriceDropBps: '155',
          },
        },
      ],
      recommendedSlippage: 1.55,
    },
    tx: {
      data: '0xb930370100000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000018e1a7fef7d00000000000000000000000000000000000000000000000000000000000003400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003800000000000000000000000003c499c542cef5e3811e1192ce70d8cc03d5c335900000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000174fabbac94000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000040042bf6f5bf12819e49336ac19bcb982919e600000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000000147130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000140040042bf6f5bf12819e49336ac19bcb982919e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000140040042bf6f5bf12819e49336ac19bcb982919e6000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041010400000051940d000000000000000000000000000000000041a65dd471010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      to: '0xeF4fB24aD0916217251F553c0596F8Edc630EB66',
      value: '500000000000000000',
    },
    order: {approximateFulfillmentDelay: 6},
    orderId:
      '0x39bd1fb15349b03010a80264e3ed9df698aa82ce5552e9191dc3ad01b728ea96',
    fixFee: '500000000000000000',
    userPoints: 0.59,
  };
  const [status, setStatus] = useState('pending');
  console.log('txQuoteInfo.......', status, txQuoteInfo);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        paddingBottom: 80,
        flex: 1,
      }}></SafeAreaView>
  );
};

export default PendingTxStatusPage;
