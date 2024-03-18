import React, {useCallback, useEffect, useRef, useState} from 'react';
// import * as React from 'react'
import {LineChart} from 'react-native-wagmi-charts';
import {
  PanResponder,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../screens/loggedIn/investments/investment-styles';
import {getHistoricalData} from '../../utils/cryptoMarketsApi';
import {useFocusEffect} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
export default InteractiveChart;

function InteractiveChart({assetName}) {
  const dispatch = useDispatch();
  const [divisionResult, setDivisionResult] = useState(0);
  const [currentPrice, setcurrentPrice] = useState(0);
  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };

  const [priceList, setPriceList] = useState([]);
  const now = new Date();
  const genesis = new Date(now.getFullYear(), 0, 1); // Start of the current year
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
  );
  const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
  const timeframes = [
    {label: 'LIVE', value: '1M', timestamp: oneMinuteAgo.getTime()},
    {label: '1H', value: '1H', timestamp: oneHourAgo.getTime()},
    {label: '1D', value: '1D', timestamp: oneDayAgo.getTime()},
    {label: '7D', value: '7D', timestamp: sevenDaysAgo.getTime()},
    {label: '30D', value: '30D', timestamp: thirtyDaysAgo.getTime()},
    {label: '1Y', value: '1Y', timestamp: oneYearAgo.getTime()},
    {label: 'All', value: '', timestamp: genesis.getTime()},
  ];
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  useEffect(() => {
    const selectedTimeframeObject = timeframes.find(
      timeframe => timeframe.value === selectedTimeframe,
    );
    const from = selectedTimeframeObject
      ? selectedTimeframeObject.timestamp
      : null;
    async function init() {
      if (from === null) return; // Early exit if timestamp is not found
      try {
        console.log('change date fire', assetName, from);
        const data = await getHistoricalData(assetName, from);
        const historicalPriceXYPair = data.price_history.map(entry => {
          return {timestamp: entry[0], value: entry[1]};
        });
        console.log(
          'change date fire',
          selectedTimeframe,
          historicalPriceXYPair.length,
        );
        setPriceList(historicalPriceXYPair);
        setcurrentPrice(data?.price_history[0][1]);
      } catch (e) {
        console.log(e);
      }
    }
    init();
  }, [selectedTimeframe]);

  useFocusEffect(
    useCallback(async () => {
      async function initialHistoryFetch() {
        try {
          const selectedTimeframeObject = timeframes.find(
            timeframe => timeframe.value === selectedTimeframe,
          );
          const from = selectedTimeframeObject
            ? selectedTimeframeObject.timestamp
            : null;

          const data = await getHistoricalData(assetName, from);
          const historicalPriceXYPair = data.price_history.map(entry => {
            return {timestamp: entry[0], value: entry[1]};
          });
          setPriceList(historicalPriceXYPair);
          console.log('change focus fire', historicalPriceXYPair.length);
          // Extracting the price part
          setcurrentPrice(data?.price_history[0][1]);
        } catch (e) {
          console.log(e);
        }
      }
      await initialHistoryFetch();
      return () => {
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
  );

  // The currently selected X coordinate position
  const [priceChange, setpriceChange] = useState(0); // The currently selected X coordinate position

  useEffect(() => {
    if (priceList.length > 1) {
      const result =
        ((priceList[priceList.length - 1] - priceList[0]) /
          priceList[priceList.length - 1]) *
        100;
      const test = priceList[priceList.length - 1] - priceList[0];
      setDivisionResult(result);
      setpriceChange(test); // Use the correct function name for setting state
    }
  }, [priceList]);

  return (
    <View
      style={{
        backgroundColor: '#000',
        alignItems: 'stretch',
      }}>
      <View style={styles.portfoioPriceContainer}>
        <Text style={styles.stockPrice}>
          $
          {Number(currentPrice || '0')
            .toFixed(2)
            .toLocaleString('en-US')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center', // Vertically center
            justifyContent: 'center',
            marginTop: '1%',
          }}>
          <Text
            style={{
              color: divisionResult < 0 ? '#FF5050' : '#ADFF6C',
              fontFamily: 'Unbounded-Medium',
              fontSize: 14,
              textAlign: 'center',
            }}>
            $
            {Number(priceChange || 0)
              .toFixed(2)
              .toLocaleString('en-US')}{' '}
            (
            {Number(divisionResult || 0)
              .toFixed(2)
              .toLocaleString('en-US')}
            %)
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: apx(750),
          height: apx(500),
          alignSelf: 'stretch',
        }}>
        {priceList.length > 0 ? (
          <GestureHandlerRootView>
            <LineChart.Provider data={priceList}>
              <LineChart width={apx(750)} height={apx(500)}>
                <LineChart.Path color="white">
                  <LineChart.Gradient />
                </LineChart.Path>
                <LineChart.Tooltip
                  textStyle={{
                    backgroundColor: 'black',
                    borderRadius: 4,
                    color: 'white',
                    fontSize: 18,
                    padding: 4,
                  }}
                />

                <LineChart.CursorCrosshair />
              </LineChart>
            </LineChart.Provider>
          </GestureHandlerRootView>
        ) : null}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: apx(20),
        }}>
        {timeframes.map(timeframe => (
          <TouchableOpacity
            key={timeframe.value}
            style={{
              padding: apx(15),
              backgroundColor:
                selectedTimeframe === timeframe.value
                  ? '#343434'
                  : 'transparent',
              borderRadius: apx(20),
            }}
            onPress={() => {
              const options = {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              };
              // ReactNativeHapticFeedback.trigger('impactHeavy', options);
              setSelectedTimeframe(timeframe.value);
            }}>
            <Text
              style={{
                color:
                  selectedTimeframe === timeframe.value ? '#FFF' : '#787878',
              }}>
              {timeframe.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
