import { useNavigation } from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, TouchableOpacity} from 'react-native';
import {Text, View} from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {Svg, Circle, Text as SvgText} from 'react-native-svg';
// import { View } from 'react-native-reanimated/lib/typescript/Animated';
const {BigNumber} = require('bignumber.js');
const PendingTxComponent = ({
  txQuoteInfo,
  formattedPercent,
  formattedCountdown,
  normalAmount,
  calculatePercentage,
}) => {
  return (
    <View>
      <Svg height="300" width="300">
        <Circle
          cx="150"
          cy="150"
          r="147"
          stroke="#fff"
          strokeWidth="4"
          fill="transparent"
        />
        <Circle
          cx="150"
          cy="150"
          r="120"
          stroke="#fff"
          strokeWidth="8"
          fill="transparent"
        />
        <Circle
          cx="150"
          cy="150"
          r="99"
          stroke="#fff"
          strokeWidth="4"
          fill="transparent"
        />
        <Circle
          cx="150"
          cy="150"
          r="120"
          stroke="#000"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={[calculatePercentage, 256]}
          strokeDashoffset="0"
        />
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily="Unbounded-Medium"
          fontSize="48"
          fill="#fff">
          {formattedPercent}
        </SvgText>
      </Svg>
      <View style={{justifyContent: 'center', marginTop: '10%'}}>
        <Text
          style={{
            fontFamily: 'Unbounded-Medium',
            fontSize: 16,
            textAlign: 'center',
            color: '#fff',
          }}>
          TRANSACTION IS PENDING
        </Text>
        <Text
          style={{
            fontFamily: 'Unbounded-Medium',
            fontSize: 16,
            textAlign: 'center',
            marginTop: 10,
            color: '#fff',
          }}>
          Time remaining: {formattedCountdown}
        </Text>
        <Text
          style={{
            fontFamily: 'Unbounded-Medium',
            fontSize: 12,
            textAlign: 'center',
            marginTop: '20%',
            color: '#949494',
          }}>
          {normalAmount} {txQuoteInfo?.estimation.dstChainTokenOut.name} {'\n'}
          are on the way
        </Text>
      </View>
    </View>
  );
};
const SuccessTxComponent = ({txQuoteInfo, tokenInfo, normalAmount}) => {
  const navigation = useNavigation();
  return (
    <View style={{width: '100%'}}>
      <Svg height="295" width="295"></Svg>
      <View style={{justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: 'Unbounded-Bold',
            fontSize: 24,
            textAlign: 'center',
            marginTop: 24,
            color: '#fff',
          }}>
          IT’S A SUCCESS!
        </Text>
        <Text
          style={{
            fontFamily: 'Unbounded-Medium',
            fontSize: 14,
            textAlign: 'center',
            marginTop: 24,
            color: '#949494',
          }}>
          You have successfully bought {normalAmount}{' '}
          {txQuoteInfo?.estimation.dstChainTokenOut.name}
        </Text>
      </View>
      <View style={{marginTop: 24}}>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LinearGradient
            colors={['#000', '#191919', '#fff']} // Replace with your desired gradient colors
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{height: 2, width: '80%'}} // Adjust the height and width as needed
          />
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            marginVertical: '5%',
            paddingHorizontal: '8%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Montreal-Medium',
                alignSelf: 'flex-start',
                color: '#fff',
              }}>
              Entry Price:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Unbounded-Medium',
                alignSelf: 'flex-end',
                color: '#fff',
              }}>
              ${tokenInfo?.current_price}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Montreal-Medium',
                alignSelf: 'flex-start',
                color: '#fff',
              }}>
              Estimated Fees:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Unbounded-Medium',
                alignSelf: 'flex-end',
                color: '#fff',
              }}>
              $0.01
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Montreal-Medium',
                alignSelf: 'flex-start',
                color: '#fff',
              }}>
              Transaction will take:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Unbounded-Medium',
                alignSelf: 'flex-end',
                color: '#fff',
              }}>
              {' '}
              {txQuoteInfo?.order?.approximateFulfillmentDelay || '...'}s
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LinearGradient
            colors={['#fff', '#191919', '#000']} // Replace with your desired gradient colors
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{height: 2, width: '80%'}} // Adjust the height and width as needed
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          height: 50,
          marginTop: 24,
          backgroundColor: 'white',
          width: '98%',
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
        onPress={() => navigation.navigate('Portfolio')}>
        <Text
          style={{
            fontSize: 14,
            letterSpacing: 0.2,
            fontFamily: 'Unbounded-Bold',
            color: '#000',
            textAlign: 'center',
          }}>
          CONFIRM
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const PendingTxStatusPage = ({route, navigation}) => {
  const {state, tokenInfo, signature} = route.params;
  const txQuoteInfo = state;

  const [countdown, setCountdown] = useState(
    txQuoteInfo?.order?.approximateFulfillmentDelay,
  );
  useEffect(() => {
    const timer = setInterval(() => {
      // Decrement countdown every second until it reaches 0
      setCountdown(prevCountdown =>
        prevCountdown > 0 ? prevCountdown - 1 : 0,
      );
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  const calculatePercentage = () => {
    const totalDuration = txQuoteInfo?.order.approximateFulfillmentDelay;
    const circumference = 2 * Math.PI * 40; // 40 is the radius of the circle
    return (countdown / totalDuration) * circumference;
  };
  const {width, height} = Dimensions.get('window');
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const weiAmount = new BigNumber(
    txQuoteInfo?.estimation.dstChainTokenOut.amount,
  );
  const percent =
    ((txQuoteInfo?.order.approximateFulfillmentDelay - countdown) /
      txQuoteInfo?.order.approximateFulfillmentDelay) *
    100;
  const formattedPercent = Math.round(percent) + '%';
  const normalAmount = weiAmount
    .div(10 ** txQuoteInfo?.estimation.dstChainTokenOut.decimals)
    .toNumber();
  // {
  console.log(tokenInfo);
  // }
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        paddingBottom: 80,
        flex: 1,
        height,
        width,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {formattedPercent === '100%' ? (
        <SuccessTxComponent
          txQuoteInfo={txQuoteInfo}
          normalAmount={normalAmount}
          tokenInfo={tokenInfo}
        />
      ) : (
        <PendingTxComponent
          txQuoteInfo={txQuoteInfo}
          normalAmount={normalAmount}
          formattedPercent={formattedPercent}
          formattedCountdown={formatTime(countdown)}
          calculatePercentage={calculatePercentage()}
        />
      )}
    </SafeAreaView>
  );
};

export default PendingTxStatusPage;
