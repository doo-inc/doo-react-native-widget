import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Linking, View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { isJsonString, storeHelper, generateScripts, getMessage } from './utils';
const propTypes = {
  websiteToken: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired,
  cwCookie: PropTypes.string,
  colorScheme: PropTypes.oneOf(['light', 'dark', 'auto']),
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar_url: PropTypes.string,
    email: PropTypes.string,
    identifier_hash: PropTypes.string,
  }),
  locale: PropTypes.string,
  customAttributes: PropTypes.shape({}),
  closeModal: PropTypes.func,
};

const WebViewComponent = ({
  baseUrl,
  websiteToken,
  cwCookie,
  locale,
  colorScheme,
  user,
  customAttributes,
  closeModal,
}) => {
  const [currentUrl, setCurrentUrl] = React.useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = React.useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);
  
  // Memoize widgetUrl to prevent unnecessary re-renders
  const widgetUrl = useMemo(() => {
    let url = `${baseUrl}/widget?website_token=${websiteToken}&locale=${locale}`;
    if (cwCookie) {
      url = `${url}&cw_conversation=${cwCookie}`;
    }
    return url;
  }, [baseUrl, websiteToken, locale, cwCookie]);
  
  // Memoize injected JavaScript
  const injectedJavaScript = useMemo(() => {
    return generateScripts({
      user,
      locale,
      customAttributes,
      colorScheme,
    });
  }, [user, locale, customAttributes, colorScheme]);
  
  useEffect(() => {
    console.log('=== WebView Component Mounted ===');
    console.log('Widget URL:', widgetUrl);
    console.log('Injected JavaScript length:', injectedJavaScript?.length || 0);
    
    // Safety timeout: force hide loading after 10 seconds
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached, forcing loading to false');
      setLoading(false);
    }, 10000);
    
    return () => clearTimeout(loadingTimeout);
  }, [widgetUrl, injectedJavaScript]);

  const onShouldStartLoadWithRequest = (request) => {
    const isMessageView = currentUrl && currentUrl.includes('#/messages');
    const isAttachmentUrl = !widgetUrl.includes(request.url);
    // Open the attachments only in the external browser
    const shouldRedirectToBrowser = isMessageView && isAttachmentUrl;
    if (shouldRedirectToBrowser) {
      Linking.openURL(request.url);
      return false;
    }

    return true;
  };

  const handleWebViewNavigationStateChange = (newNavState) => {
    setCurrentUrl(newNavState.url);
  };

  const renderLoadingComponent = () => {
    console.log('Rendering loading component, loading state:', loading);
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading widget...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: widgetUrl,
        }}
        onMessage={(event) => {
          const { data } = event.nativeEvent;
          console.log('WebView message received:', data);
          const message = getMessage(data);
          if (isJsonString(message)) {
            const parsedMessage = JSON.parse(message);
            console.log('Parsed message:', parsedMessage);
            const { event: eventType, type } = parsedMessage;
            if (eventType === 'loaded') {
              console.log('Widget loaded event received!');
              setLoading(false);
              setInitialLoadComplete(true);
              const {
                config: { authToken },
              } = parsedMessage;
              storeHelper.storeCookie(authToken);
            }
            if (type === 'close-widget') {
              closeModal();
            }
          }
        }}
        scalesPageToFit
        useWebKit
        sharedCookiesEnabled
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.WebViewStyle}
        injectedJavaScript={injectedJavaScript}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onLoadStart={(syntheticEvent) => {
          console.log('WebView: Load started, initialLoadComplete:', initialLoadComplete);
          if (!initialLoadComplete) {
            setLoading(true);
            console.log('Loading state set to: true');
          }
        }}
        onLoadProgress={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('WebView: Loading progress:', nativeEvent.progress);
          // Don't set loading to true here - it causes issues with reloads
        }}
        onLoadEnd={(syntheticEvent) => {
          console.log('WebView: Load ended, initialLoadComplete:', initialLoadComplete);
          if (!initialLoadComplete) {
            setLoading(false);
            console.log('Loading state set to: false');
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView ERROR:', nativeEvent);
          setError(`Error: ${nativeEvent.description || 'Unknown error'}`);
          setLoading(false);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP ERROR:', nativeEvent.statusCode, nativeEvent.url);
          setError(`HTTP Error ${nativeEvent.statusCode}`);
        }}
        scrollEnabled
      />
      {loading && renderLoadingComponent()}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorUrl}>URL: {widgetUrl}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  webViewContainer: {
    flex: 1,
  },
  WebViewStyle: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffebee',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ef5350',
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorUrl: {
    fontSize: 10,
    color: '#666',
  },
});

WebViewComponent.propTypes = propTypes;
export default WebViewComponent;
