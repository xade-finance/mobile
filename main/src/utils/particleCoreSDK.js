import {PROJECT_ID, CLIENT_KEY} from '@env';
import {PolygonMumbai} from '@particle-network/chains';
import * as particleAuth from '@particle-network/rn-auth';
import {Env, ParticleInfo} from '@particle-network/rn-auth';
import * as particleAuthCore from '@particle-network/rn-auth-core';
import * as particleAA from '@particle-network/rn-aa';
import {
  LoginType,
  SocialLoginPrompt,
  SupportAuthType,
} from '@particle-network/rn-auth';
import Web3 from 'web3';
const projectId = PROJECT_ID;
const clientKey = CLIENT_KEY;
// Get your project id and client from dashboard,
// https://dashboard.particle.network/
const accountName = particleAuth.AccountName.BICONOMY_V1();
const biconomyApiKeys = {
  1: 'your ethereum mainnet key',
  5: 'your ethereum goerli key',
  137: 'your polygon mainnet key',
  80001: 'hYZIwIsf2.e18c790b-cafb-4c4e-a438-0289fc25dba1',
};

export const initializedAuthCore = () => {
  ParticleInfo.projectId = projectId; // your project id
  ParticleInfo.clientKey = clientKey; // your client key
  if (ParticleInfo.projectId === '' || ParticleInfo.clientKey === '') {
    throw new Error(
      'You need set project info, get your project id and client from dashboard, https://dashboard.particle.network',
    );
  }
  const chainInfo = PolygonMumbai;
  const env = Env.Dev;
  particleAuth.init(chainInfo, env);
  particleAuth.setModalPresentStyle(
    particleAuth.iOSModalPresentStyle.FullScreen,
  );
  particleAuth.setAppearance(particleAuth.Appearance.Dark);
  particleAuthCore.init();
  console.log('init auth core....');
  particleAA.init(accountName, biconomyApiKeys);
  console.log('init AA sdk.....');
};
export const getAuthCoreProvider = loginType => {
  const provider = new particleAuthCore.ParticleAuthCoreProvider({
    projectId,
    clientKey,
    loginType,
  });
  // @ts-ignore
  const web3 = new Web3(provider);
  return web3;
};
export const connectWithAuthCore = async () => {
  const supportAuthType = [SupportAuthType.Phone, SupportAuthType.Email];
  const result = await particleAuthCore.connect(
    LoginType.Email,
    null,
    supportAuthType,
    SocialLoginPrompt.SelectAccount,
    {
      projectName: 'Xade Finance',
      description: 'Welcome to login',
      imagePath: 'https://connect.particle.network/icons/512.png',
    },
  );
  if (result.status) {
    const userInfo = result.data;
    console.log('connect', userInfo);
    return userInfo;
  } else {
    const error = result.data;
    console.log('connect', error);
    return 0;
  }
};
export const isLoggedIn = async () => {
  try {
    const result = await particleAuthCore.isConnected();
    return result;
  } catch (error) {
    return 0;
  }
};
export const getUserInfoFromAuthCore = async () => {
  try {
    const result = await particleAuthCore.getUserInfo();
    return result;
  } catch (error) {
    return 0;
  }
};
export const getUserAddressFromAuthCoreSDK = async () => {
  try {
    const result = await particleAuthCore.evm.getAddress();
    return result;
  } catch (error) {
    return 0;
  }
};
export const getSmartAccountAddress = async eoaAddress => {
  try {
    const smartAccountParam = {
      name: accountName.name,
      version: accountName.version,
      ownerAddress: eoaAddress,
    };
    const result = await particleAuth.EvmService.getSmartAccount([
      smartAccountParam,
    ]);
    const smartAccountAddress = result[0]?.smartAccountAddress;
    console.log('smartAccountAddress', result);
    return smartAccountAddress;
  } catch (error) {
    console.log('error in scw', error);
  }
};
export const depolyAAAndGetSCAddress = async () => {
  const eoaAddress = await getUserAddressFromAuthCoreSDK();
  const result = await particleAA.isDeploy(eoaAddress);
  console.log('AA Deployed result', eoaAddress, result);
  if (result.status) {
    const isDeploy = result.data;
    console.log('isDeploy result', isDeploy);
    const scw = await getSmartAccountAddress(eoaAddress);
    console.log('scw address........', scw);
    let isAAModeEnable = await particleAA.isAAModeEnable();
    console.log('is enabled result', eoaAddress, isAAModeEnable);
    if (!isAAModeEnable) particleAA.enableAAMode();
    console.log('is enabled after result', scw, eoaAddress, isAAModeEnable);
    return scw;
  } else {
    const error = result.data;
    console.log('isDeploy result', error);
    return 0;
  }
};
