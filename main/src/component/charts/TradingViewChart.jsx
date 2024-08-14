import React, { useRef } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0" />
    <script type="text/javascript" src="charting_library/charting_library.standalone.js"></script>
    <script type="text/javascript" src="datafeeds/udf/dist/bundle.js"></script>
    <script type="text/javascript">
      let params = new URL(document.location).searchParams;
      let height = params.get('height');
      let width = params.get('width');
      console.log('height.......', height, width);
      function getParameterByName(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
          results = regex.exec(location.search);
        return results === null
          ? ''
          : decodeURIComponent(results[1].replace(/\\+/g, ' '));
      }
      function initOnReady() {
        var datafeedUrl = 'https://demo-feed-data.tradingview.com';
        var customDataUrl = getParameterByName('dataUrl');
        if (customDataUrl !== '') {
          datafeedUrl = customDataUrl.startsWith('https://')
            ? customDataUrl
            : \`https://\${customDataUrl}\`;
        }
        var widget = (window.tvWidget = new TradingView.widget({
          fullscreen: false,
          symbol: 'AAPL',
          interval: '1M',
          container: 'tv_chart_container',
          datafeed: new Datafeeds.UDFCompatibleDatafeed(
            datafeedUrl,
            undefined,
            {
              maxResponseLength: 1000,
              expectedOrder: 'latestFirst',
            },
          ),
          library_path: 'charting_library/',
          locale: getParameterByName('lang') || 'en',
          disabled_features: [
            'use_localstorage_for_settings',
            'left_toolbar',
            'context_menus',
            'adaptive_logo',
            'edit_buttons_in_legend',
            'header_widget',
            'legend_widget',
            'timeframes_toolbar',
            'timezone_menu',
            'border_around_the_chart',
            'go_to_date',
            'scales_date_format',
            'scales_time_hours_format',
            'timezone_menu',
            'cropped_tick_marks',
            'end_of_period_timescale_marks',
          ],
          width: width,
          enabled_features: [],
          charts_storage_url: 'https://saveload.tradingview.com',
          charts_storage_api_version: '1.1',
          client_id: 'tradingview.com',
          user_id: 'public_user_id',
          height: height,
          theme: 'dark',
          overrides: {
            'paneProperties.vertGridProperties.color': '#000000',
            'paneProperties.horzGridProperties.color': '#000000',
            'mainSeriesProperties.style': 1,
            'paneProperties.background': '#000000',
            'paneProperties.backgroundType': 'solid',
            'mainSeriesProperties.style': 8,
          },
        }));
        widget.activeChart().clearMarks();
        window.tvWidget.onChartReady(() => {
          let crosshairValue;
          const crosshairMovedHandler = params => {
            crosshairValue = params;
          };

          console.log(TradingView.version());

          widget
            .activeChart()
            .crossHairMoved()
            .subscribe(null, crosshairMovedHandler);

          widget.subscribe('mouse_down', () => {
            const mouseUpHandler = () => {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  data: crosshairValue,
                  eventType: 'mouse_down',
                }),
              );
              widget.unsubscribe('mouse_up', mouseUpHandler);
            };

            widget.subscribe('mouse_up', mouseUpHandler);
          });
        });
        window.frames[0].focus();
      }

      window.addEventListener('DOMContentLoaded', initOnReady, false);
    </script>
  </head>
  <body style="margin: 0px">
    <div id="tv_chart_container"></div>
  </body>
</html>
`;

export const TradingViewChart = ({ height, width }) => {
  return (
    <View style={{ width, height }}>
      <WebView
        ref={r => (this.webref = r)}
        style={{ flex: 1 }}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={event => {
          console.log(JSON.parse(event?.nativeEvent.data));
        }}
        allowFileAccessFromFileURLs={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        onShouldStartLoadWithRequest={() => true}
      />
    </View>
  );
};