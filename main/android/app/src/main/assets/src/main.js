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
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
function initOnReady() {
  var datafeedUrl = 'https://demo-feed-data.tradingview.com';
  var customDataUrl = getParameterByName('dataUrl');
  if (customDataUrl !== '') {
    datafeedUrl = customDataUrl.startsWith('https://')
      ? customDataUrl
      : `https://${customDataUrl}`;
  }
  var widget = (window.tvWidget = new TradingView.widget({
    // debug: true, // uncomment this line to see Library errors and warnings in the console
    fullscreen: false,
    symbol: 'Bitfinex:BTC/USD',
    interval: '1D',
    container: 'tv_chart_container',
    //	BEWARE: no trailing slash is expected in feed URL
    // datafeed: Datafeed,
    datafeed: new Datafeeds.UDFCompatibleDatafeed(datafeedUrl, undefined, {
      maxResponseLength: 1000,
      expectedOrder: 'latestFirst',
    }),
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
      'paneProperties.background': '#000000',
      'paneProperties.backgroundType': 'solid',
      'mainSeriesProperties.style': 8,
      // 'mainSeriesProperties.statusViewStyle.symbolTextSource':
      //   'long-description',
    },
  }));
  widget.activeChart().clearMarks();
  window.tvWidget.onChartReady(() => {
    let crosshairValue;
    const crosshairMovedHandler = params => {
      crosshairValue = params;
    };

    // This is not working
    widget
      .activeChart()
      .crossHairMoved()
      .subscribe(null, crosshairMovedHandler);

    // And this is not working too (and I tried them separately, also not working)
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
  // widget.subscribe('mouse_down', event => {
  //   console.log(event);
  // window.ReactNativeWebView.postMessage(
  //   JSON.stringify({
  //     data: event,
  //     eventType: 'mouse_down',
  //   }),
  // );
  // });
  window.frames[0].focus();
}

window.addEventListener('DOMContentLoaded', initOnReady, false);
