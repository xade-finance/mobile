import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';

import AuthTextInput from '../../component/Input/AuthTextInputs';

import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
// import {Image} from 'react-native-svg';

export const SingleCouponItem = ({onSelect, info, isSelected}) => {
  return (
    <Pressable
      onPress={onSelect}
      style={[styles.container, isSelected ? styles.selectedItem : null]}>
      <Image source={{uri: info?.vouchersImg}} style={styles.image} />
      <Text numberOfLines={1} style={styles.brandName}>
        {info?.brand}
      </Text>
    </Pressable>
  );
};
const CouponModal = ({modalVisible, setModalVisible, value}) => {
  // renders

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState();
  const {height} = Dimensions.get('window');

  const giftCards = useSelector(x => x.offRamp.giftCards);
  const [qty, setQty] = useState(1);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        {selected ? (
          <View style={[styles.modalView, {backgroundColor: '#1D1D1D'}]}>
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
            <Pressable
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-between',
                marginTop: '2%',
              }}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: selected?.vouchersImg}}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 100,
                    backgroundColor: 'white',
                  }}
                />
                <Text
                  style={{
                    fontSize: 24,
                    color: '#fff',
                    fontWeight: 500,
                    textAlign: 'center',
                    fontFamily: 'NeueMontreal-Medium',
                    marginTop: 12,
                  }}>
                  {selected?.brand}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 14,
                    color: '#fff',
                    fontWeight: 500,
                    textAlign: 'center',
                    fontFamily: 'NeueMontreal-Medium',
                    marginTop: 20,
                  }}>
                  {`Amazon Gift Cards are redeemable towards the purchase of millions of eligible goods and services provided by Amazon.com Services LLC and its affiliates on www.amazon.com`}
                </Text> */}
              </View>
            </Pressable>
            <View style={{marginBottom: 12}}>
              <AuthTextInput
                value={qty}
                onChange={x => setQty(x)}
                placeholder="How many to purchase..."
                width={'100%'}
                backgroundColor={'#000000'}
              />
            </View>
            <TouchableOpacity
              style={{
                height: 45,
                width: '100%',
                borderRadius: 30,
                marginBottom: 16,
              }}
              onPress={async () => {
                navigation.push('Portfolio');
                setModalVisible(false);
              }} // Open modal on press
            >
              <LinearGradient
                useAngle={true}
                angle={150}
                colors={['#fff', '#fff']}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'NeueMontreal-Medium',
                  }}>
                  PURCHASE NOW
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              styles.modalView,
              {
                minHeight: height * 0.45,
                maxHeight: height * 0.8,
                backgroundColor: '#1D1D1D',
              },
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
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  marginTop: 12,
                  color: 'white',
                  fontFamily: `NeueMontreal-Bold`,
                  fontSize: 20,
                  lineHeight: 24,
                  padding: 8,
                }}>
                Select the gift card
              </Text>
            </View>
          </View>
        )}
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
    backgroundColor: '#1D1D1D',
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
  wrapContainer: {
    flexDirection: 'row', // Align items in a row
    flexWrap: 'wrap', // Allow items to wrap to the next line
    //justifyContent: 'center', // Align items to the start of the container
    padding: 8, // Add some padding around the container
    marginTop: '2%',
  },
  container: {
    width: '25%',
    aspectRatio: 1, // Ensure a square aspect ratio for each item
    marginRight: '5%',
    marginVertical: '5%',
    alignItems: 'center',
    backgroundColor: '#131313', // Background color of the item
    borderRadius: 8, // Rounded corners
    padding: 10, // Padding inside the item
    elevation: 2, // Elevation for Android shadow
    shadowColor: '#000', // Shadow color for iOS shadow
    shadowOffset: {width: 0, height: 2}, // Shadow offset for iOS shadow
    shadowOpacity: 0.2, // Shadow opacity for iOS shadow
    shadowRadius: 2, // Shadow radius for iOS shadow,
    borderWidth: 1,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 100,
    alignSelf: 'center',
  },
  brandName: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    fontFamily: 'NeueMontreal-Medium',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '100%', // Adjust maximum width as needed
  },
  selectedItem: {
    borderColor: '#ffffff', // Change border color for selected item
  },
});

export default CouponModal;
