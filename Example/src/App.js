import React, { useEffect, useState } from 'react';
import { SafeAreaView, Appearance, Modal, View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import { storeHelper, findColors } from './utils';
import WebView from './WebView';
import styles from './style';
import { COLOR_WHITE } from './constants';

const propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  websiteToken: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired,
  cwCookie: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar_url: PropTypes.string,
    email: PropTypes.string,
    identifier_hash: PropTypes.string,
  }),
  locale: PropTypes.string,
  colorScheme: PropTypes.oneOf(['dark', 'light', 'auto']),
  customAttributes: PropTypes.shape({}),
  closeModal: PropTypes.func,
};

const DooWidget = ({
  isModalVisible,
  baseUrl,
  websiteToken,
  user = {},
  locale = 'en',
  colorScheme = 'light',
  customAttributes = {},
  closeModal,
}) => {
  const [cwCookie, setCookie] = useState('');

  useEffect(() => {
    console.log('=== CNCT Widget Mounted ===');
    console.log('Modal Visible:', isModalVisible);
    console.log('Base URL:', baseUrl);
    console.log('Website Token:', websiteToken);
    console.log('User:', JSON.stringify(user));
    console.log('Locale:', locale);
  }, [isModalVisible, baseUrl, websiteToken, user, locale]);

  useEffect(() => {
    async function fetchData() {
      const value = await storeHelper.getCookie();
      console.log('Cookie fetched:', value);
      setCookie(value);
    }
    fetchData();
  }, []);
  const appColorScheme = Appearance.getColorScheme();

  const { headerBackgroundColor, mainBackgroundColor } = findColors({
    colorScheme,
    appColorScheme,
  });
  
  console.log('Rendering modal, visible:', isModalVisible);
  
  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeModal}>
      <SafeAreaView style={[styles.headerView, { backgroundColor: headerBackgroundColor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={{ fontSize: 24, color: '#666' }}>✕</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <SafeAreaView style={[styles.mainView, { backgroundColor: mainBackgroundColor }]}>
        <WebView
          websiteToken={websiteToken}
          cwCookie={cwCookie}
          user={user}
          baseUrl={baseUrl}
          locale={locale}
          colorScheme={colorScheme}
          customAttributes={customAttributes}
          closeModal={closeModal}
        />
      </SafeAreaView>
    </Modal>
  );
};

DooWidget.propTypes = propTypes;

export default DooWidget;
