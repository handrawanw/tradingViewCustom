import pairs from './pairs'
var rp = require('request-promise').defaults({json: true})
const api_root = 'https://min-api.cryptocompare.com'
const history = {}

export default {
	history: history,

  getBars: function(symbolInfo, resolution, from, to, first, limit) {
	  var split_symbol = symbolInfo.name.split(/[:/]/)
		const url = resolution === 'D' ? '/data/histoday' : resolution >= 60 ? '/data/histohour' : '/data/histominute'
		const qs = {
        e: pairs[split_symbol[0] + "/" + split_symbol[1]],
				fsym: split_symbol[0],
				tsym: split_symbol[1],
				toTs:  to ? to : '',
				limit: limit ? limit : 2000, 
				// aggregate: 1//resolution 
			}
		// console.log({qs})
      return rp({
              url: `${api_root}${url}`,
              qs,
          })
          .then(data => {
              // console.log({data})
			if (data.Response && data.Response === 'Error') {
				// console.log('CryptoCompare API error:',data.Message)
				return []
			}
			if (data.Data.length) {
				// close: 16148.46
				// high: 16148.46
				// isBarClosed: true
				// isLastBar: false
				// low: 16142.01
				// open: 16142.01
				// time: 1605327720000
				// volume: 2.93

				// console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
				// var bars = data.Data.map(el => {
				// 	return {
				// 		time: el.time * 1000, //TradingView requires bar time in ms
				// 		low: el.low,
				// 		high: el.high,
				// 		open: el.open,
				// 		close: el.close,
				// 		volume: el.volumefrom 
				// 	}
				// });
				var bars=[],times=[1605327720000,1505327720000,1506327720000,1508327720000],randomValue=[100,1000,10000,100000];
				while(bars.length<100){
					bars.push({
						close: randomValue[Math.ceil(Math.random()*randomValue.length-1)],
						high: randomValue[Math.ceil(Math.random()*randomValue.length-1)],
						isBarClosed: true,
						isLastBar: false,
						low: randomValue[Math.ceil(Math.random()*randomValue.length-1)],
						open: randomValue[Math.ceil(Math.random()*randomValue.length-1)],
						time: times[Math.ceil(Math.random()*times.length-1)],
						volume: randomValue[Math.ceil(Math.random()*randomValue.length-1)],
					});
				}
				
        if (first) {
          var lastBar = bars[bars.length - 1]
          history[symbolInfo.name] = {lastBar: lastBar}
		}
		console.log("bars");
		console.log(bars);
				return bars;
			} else {
				return []
			}
		})
  }
}
