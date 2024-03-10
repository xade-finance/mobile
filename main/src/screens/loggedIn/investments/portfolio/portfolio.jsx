import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import LineChart from '../../../../component/charts/LineChart';
import styles from '../investment-styles';
import {POINTS_KEY} from '@env';
import {useDispatch, useSelector} from 'react-redux';
import {getCryptoHoldingForAddressFromMobula} from '../../../../store/actions/portfolio';
import {getCryptoHoldingForAddress} from '../../../../utils/cryptoWalletApi';
import MyInvestmentItemCard from '../tradeCollection/myInvestmentItemCard'; // Assuming this is the path to your component
import {useFocusEffect} from '@react-navigation/native';
import {getSmartAccountAddress} from '../../../../utils/particleCoreSDK';
const Portfolio = ({navigation}) => {
  const dispatch = useDispatch();
  // const [holdings, setHoldings] = useState(null);
  const holdings = useSelector(x => x.portfolio.holdings);
  console.log('Holdings Porfolio Page', holdings);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const addPoints = async () => {
    try {
      const address = global.withAuth
        ? global.loginAccount.scw
        : global.connectAccount.publicAddress;
      // const address = ''

      const inputValue = {
        userId: address,
        // userId: address.toLowerCase(),
        transactionAmount: 0,
        key: POINTS_KEY,
      };
      const response = await fetch('https://refer.xade.finance/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': POINTS_KEY,
        },
        body: JSON.stringify(inputValue),
      });
      const data = await response.json();
      if (data.points > 0) return data.points.toFixed(0).toLocaleString();
      else return 0;
    } catch (err) {
      console.error(err);
    }
  };
  const [points, setPoints] = useState('...');
  // useEffect(() => {
  async function logic() {
    const _points = await addPoints();
    global.points = _points;
    setPoints(_points);
  }
  // });

  // useEffect(() => {
  //   async function init() {
  //     try {
  //       const eoaAddress = await getUserAddressFromAuthCoreSDK();
  //       console.log('Data from API coin........', eoaAddress, data);
  //       const smartAccount = await getSmartAccountAddress(eoaAddress);
  //       const data = await getCryptoHoldingForAddress(smartAccount);

  //       // fetch selected coin contract address
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   init();
  // }, []);
  const onFocusFunction = async () => {
    console.log('firred balnce holding');
    dispatch(getCryptoHoldingForAddressFromMobula());
    await logic();
  };
  useFocusEffect(
    useCallback(() => {
      onFocusFunction();
      return () => {
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
  );
  console.log('Holdings', JSON.stringify(holdings));

  const extractUSDCBalanceOnPolygon = holdings => {
    // Check if holdings or holdings.assets is not defined
    if (!holdings || !holdings.assets) {
      return '0'; // Return a default value indicating that the balance couldn't be extracted
    }

    const usdcAsset = holdings.assets.find(
      asset =>
        asset.asset.symbol === 'USDC' &&
        asset.cross_chain_balances.Polygon &&
        asset.cross_chain_balances.Polygon.address.toLowerCase() ===
          '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359'.toLowerCase(),
    );

    // Check if the USDC asset on Polygon was found
    if (!usdcAsset) {
      return '0'; // Return a default value if the USDC asset isn't found
    }
    console.log(
      'balance......',
      usdcAsset.cross_chain_balances.Polygon.balance,
    );
    // Assuming the balance is directly available on usdcAsset (or adapt based on actual structure)
    return usdcAsset.cross_chain_balances.Polygon.balance || 0;
  };

  // Extract the USDC balance
  const usdcBalance = extractUSDCBalanceOnPolygon(holdings);
  console.log('usd balance....', usdcBalance);

  return (
    <SafeAreaView style={{backgroundColor: '#000', flex: 1}}>
      <View
        style={{
          marginTop: '8%',
          marginBottom: '2%',
          marginLeft: '5%',
          marginRight: '5%', // Added marginRight to ensure space is maintained from the right edge
          flexDirection: 'row',
          justifyContent: 'space-between', // This line positions items on opposite ends
        }}>
        <Text
          style={{fontFamily: 'Unbounded-Medium', color: '#fff', fontSize: 20}}>
          PORTFOLIO
        </Text>
        <TouchableOpacity onPress={() => navigation.push('TransactionHistory')}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709493378/x8e21kt9laz3hblka91g.png',
            }} // Replace with your image URI
            style={{
              width: 40,
              height: 40,
              bottom: 3,
            }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginTop: '8%',
          }}>
          <Text style={styles.portfolioHead}>Portfolio Value</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <LineChart />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 8,
            }}>
            <View
              style={{
                flex: 1,
                height: 1,
                marginLeft: '5%',
                marginRight: '5%',
                backgroundColor: '#292929',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              marginTop: '3%',
              marginRight: '5%',
              marginLeft: '3%',
              marginBottom: '3%',
            }}>
            <Text
              style={{
                fontFamily: 'Montreal-Medium',
                color: '#fff',
                fontSize: 16,
              }}>
              Cash Balance
            </Text>
            <Text
              style={{
                fontFamily: 'Unbounded-Medium',
                color: '#fff',
                fontSize: 16,
              }}>
              ${Number(usdcBalance).toFixed(2).toLocaleString('en-US')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 72,
              width: '95%',
              margin: '5%',
              borderRadius: 20,
              backgroundColor: '#121212',
              padding: 16,
              overflow: 'hidden',
            }}>
            <Image
              source={{
                uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709489668/f2gqkcuheacirjnusuz9.png',
              }} // Replace with your image URI
              style={{
                width: 40,
                height: 40,
                marginRight: 12,
              }}
            />
            <View
              style={
                {
                  // This container can hold additional styling if necessary for text layout
                }
              }>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#121212',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#fff',
                    fontFamily: 'Montreal-Medium',
                  }}>
                  You have{' '}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#fff',
                    fontFamily: 'Montreal-Bold',
                    textShadowColor: '#C68DFF',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10,
                  }}>
                  {points}{' '}
                </Text>
                <Text style={{fontSize: 16, color: '#fff'}}>coins</Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: '#9C9C9C',
                  fontFamily: 'Montreal-Medium',
                }}>
                Xade Coins can be redeemed{' '}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: '#787878', // Assuming you want white text color
              textAlign: 'left', // Aligns text to the left
              alignSelf: 'flex-start', // Aligns the Text component to the start of the flex container
              width: '75%', // Match the width of your other content for consistency
              paddingLeft: 30,
              marginTop: '2%',
              marginBottom: '2%', // Optional: if you want some space from the left edge
            }}>
            My Investments
          </Text>

          {!holdings || !holdings.assets ? (
            <View
              style={{
                flex: 1,
                backgroundColor: '#000',
                width: '100%',
                paddingBottom: '50%',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Unbounded-Medium',
                  justifyContent: 'center',
                  marginTop: '10%',
                }}>
                No data available...
              </Text>
            </View>
          ) : (
            <View
              style={{
                width: '90%',
                backgroundColor: '#000',
                paddingBottom: '30%',
              }}>
              <FlatList
                data={holdings.assets.filter(item => item.token_balance > 0)}
                keyExtractor={item => item.asset.id} // Use a unique property of each asset as the key
                renderItem={({item}) => (
                  <MyInvestmentItemCard
                    navigation={navigation}
                    item={{
                      ...item.asset, // Assuming the structure matches what MyInvestmentItemCard expects
                      balance: item.token_balance, // Adapt properties as needed
                      current_price: item.price,
                      unrealized_pnl: item.price_change_percentage_24h, // Example
                      image: item.asset.logo,
                    }}
                  />
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          navigation.push('Ramper');
        }}
        style={{
          position: 'absolute', // Positions the button over the content
          bottom: 60, // Distance from the bottom of the screen
          width: '95%',
          height: 56, // Button height
          borderRadius: 28, // Circular button
          backgroundColor: '#FFF', // Button color
          justifyContent: 'center', // Center the icon or text inside the button
          alignItems: 'center', // Center the icon or text inside the button
          shadowColor: '#C68DFF', // Shadow for the button
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 5, // Elevation for Android
        }}>
        {/* Add Icon or Text inside the TouchableOpacity as needed */}
        <Text
          style={{color: '#000', fontSize: 16, fontFamily: 'Unbounded-Medium'}}>
          ADD FUNDS
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Portfolio;
