import { NextRequest, NextResponse } from 'next/server'

<<<<<<< HEAD
interface HistoricalPriceData {
  date: string
  price: number
  symbol: string
  type: 'currency' | 'crypto'
  source: string
=======
interface HistoricalItem {
  symbol: string
  name: string
  price: number
  type: 'currency' | 'crypto'
  timestamp: string
}

const CRYPTO_ICONS: Record<string, string> = {
  'BTC': 'text-orange-500',
  'ETH': 'text-blue-500',
  'BNB': 'text-yellow-500',
  'SOL': 'text-purple-500',
  'XRP': 'text-gray-600',
  'ADA': 'text-blue-600',
  'DOGE': 'text-amber-500',
  'DOT': 'text-pink-500',
  'MATIC': 'text-purple-600',
  'AVAX': 'text-red-500'
}

async function fetchCurrencyHistoricalData(date: string) {
  try {
    const [year, month, day] = date.split('-').map(Number)
    let checkDate = new Date(year, month - 1, day)
    
    console.log(`Fetching TCMB data for date: ${date}, checkDate: ${checkDate.toDateString()}`)
    
    // Find previous working day (not weekend)
    while (true) {
      const dayOfWeek = checkDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        break
      }
      checkDate.setDate(checkDate.getDate() - 1)
      
      // Safety check: don't go back more than 30 days
      const daysDiff = Math.floor((new Date(year, month - 1, day).getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff > 30) {
        console.warn(`No working day found within 30 days of ${date}`)
        return null
      }
    }
    
    const tcmbDate = `${checkDate.getDate().toString().padStart(2, '0')}${String(checkDate.getMonth() + 1).padStart(2, '0')}${checkDate.getFullYear()}`
    const url = `https://www.tcmb.gov.tr/kurlar/${year}${String(checkDate.getMonth() + 1).padStart(2, '0')}/${tcmbDate}.xml`
    
    console.log(`TCMB URL: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000) // 10 seconds timeout
    })
    
    console.log(`TCMB Response status: ${response.status}`)
    
    if (!response.ok) {
      console.warn(`TCMB API failed with status: ${response.status}`)
      return null
    }
    
    const xmlText = await response.text()
    console.log(`TCMB XML length: ${xmlText.length} characters`)
    
    if (xmlText.length < 100) {
      console.warn(`TCMB XML too short, likely error page: ${xmlText.substring(0, 200)}`)
      return null
    }
    
    const currencies = [
      { code: 'USD', name: 'ABD DOLARI', symbol: 'USD/TRY' },
      { code: 'EUR', name: 'EURO', symbol: 'EUR/TRY' },
      { code: 'GBP', name: 'İNGİLİZ STERLİNİ', symbol: 'GBP/TRY' },
      { code: 'CHF', name: 'İSVİÇRE FRANGI', symbol: 'CHF/TRY' },
      { code: 'SEK', name: 'İSVEÇ KRONU', symbol: 'SEK/TRY' },
      { code: 'DKK', name: 'DANİMARKA KRONU', symbol: 'DKK/TRY' },
      { code: 'NOK', name: 'NORVEÇ KRONU', symbol: 'NOK/TRY' },
      { code: 'CAD', name: 'KANADA DOLARI', symbol: 'CAD/TRY' },
      { code: 'AUD', name: 'AVUSTRALYA DOLARI', symbol: 'AUD/TRY' },
      { code: 'JPY', name: 'JAPON YENİ', symbol: 'JPY/TRY' },
      { code: 'KWD', name: 'KUVEYT DİNARI', symbol: 'KWD/TRY' },
      { code: 'SAR', name: 'SUUDİ ARABİSTAN RİYALİ', symbol: 'SAR/TRY' },
      { code: 'BGN', name: 'BULGAR LEVASI', symbol: 'BGN/TRY' },
      { code: 'RON', name: 'RUMEN LEYİ', symbol: 'RON/TRY' },
      { code: 'RUB', name: 'RUS RUBLESİ', symbol: 'RUB/TRY' },
      { code: 'CNY', name: 'ÇİN YUANI', symbol: 'CNY/TRY' },
      { code: 'PKR', name: 'PAKİSTAN RUPİSİ', symbol: 'PKR/TRY' },
      { code: 'QAR', name: 'KATAR RİYALİ', symbol: 'QAR/TRY' },
      { code: 'AZN', name: 'AZERBAYCAN MANATI', symbol: 'AZN/TRY' }
    ]
    
    const result = currencies.map(currency => {
      const forexBuyingPattern = new RegExp(`<Currency[^>]*Kod="${currency.code}"[^>]*>.*?<ForexBuying>([^<]*)</ForexBuying>`, 'is')
      const forexSellingPattern = new RegExp(`<Currency[^>]*Kod="${currency.code}"[^>]*>.*?<ForexSelling>([^<]*)</ForexSelling>`, 'is')
      const changePattern = new RegExp(`<Currency[^>]*Kod="${currency.code}"[^>]*>.*?<Change>([^<]*)</Change>`, 'is')
      
      const forexBuyingMatch = xmlText.match(forexBuyingPattern)
      const forexSellingMatch = xmlText.match(forexSellingPattern)
      const changeMatch = xmlText.match(changePattern)
      
      if (forexBuyingMatch && forexSellingMatch) {
        const forexBuying = parseFloat(forexBuyingMatch[1]?.replace(',', '.') || '0')
        const forexSelling = parseFloat(forexSellingMatch[1]?.replace(',', '.') || '0')
        const change = parseFloat(changeMatch?.[1]?.replace(',', '.') || '0')
        
        const price = (forexBuying + forexSelling) / 2
        const changePercent = price > 0 ? (change / price) * 100 : 0
        
        console.log(`Parsed ${currency.code}: Buy=${forexBuying}, Sell=${forexSelling}, Price=${price}`)
        
        return {
          symbol: currency.symbol,
          name: currency.name,
          price: price || 0,
          type: 'currency' as const,
          timestamp: new Date(date).toISOString()
        }
      } else {
        console.warn(`Could not parse ${currency.code} from TCMB XML`)
      }
      
      return null
    }).filter(currency => currency && currency.price > 0)
    
    console.log(`Successfully parsed ${result.length} currencies from TCMB`)
    return result.length > 0 ? result : null
  } catch (error) {
    console.error('Currency historical fetch error:', error)
    return null
  }
}

async function fetchCryptoHistoricalData(date: string, cryptoId?: string) {
  try {
    const apiKey = process.env.COINMARKETCAP_API_KEY
    
    if (!apiKey || apiKey === 'your_coinmarketcap_api_key_here') {
      console.warn('CoinMarketCap API key not configured')
      return null
    }

    // Convert date to timestamp (start of day)
    const targetDate = new Date(date)
    const timestamp = Math.floor(targetDate.getTime() / 1000)
    
    // Map crypto IDs to CoinMarketCap symbols
    const cryptoMap: Record<string, string> = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'binancecoin': 'BNB',
      'solana': 'SOL',
      'cardano': 'ADA'
    }
    
    const symbol = cryptoMap[cryptoId || 'bitcoin'] || 'BTC'
    
    // CoinMarketCap historical endpoint
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical?symbol=${symbol}&time_start=${timestamp}&time_end=${timestamp + 86400}&convert=USD`
    
    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000) // 10 seconds timeout
    })
    
    if (!response.ok) {
      console.warn(`CoinMarketCap API failed for ${symbol} on ${date}, status: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    
    if (data.status.error_code !== 0) {
      console.warn(`CoinMarketCap API error: ${data.status.error_message}`)
      return null
    }
    
    // Extract the price from the historical data
    const quotes = data.data[symbol]
    if (!quotes || !quotes.quote || !quotes.quote.USD) {
      console.warn(`No price data found for ${symbol} on ${date}`)
      return null
    }
    
    const price = quotes.quote.USD.price
    const cryptoName = cryptoId === 'ethereum' ? 'Ethereum' : 
                     cryptoId === 'binancecoin' ? 'Binance Coin' :
                     cryptoId === 'solana' ? 'Solana' :
                     cryptoId === 'cardano' ? 'Cardano' :
                     cryptoId?.charAt(0).toUpperCase() + cryptoId?.slice(1) || 'Bitcoin'
    
    return {
      symbol: symbol,
      name: cryptoName,
      price: price,
      type: 'crypto' as const,
      timestamp: new Date(date).toISOString()
    }
  } catch (error) {
    console.error('Error fetching crypto historical data:', error)
    return null
  }
>>>>>>> origin/master
}

export async function GET(request: NextRequest) {
  try {
<<<<<<< HEAD
    console.log('=== HISTORICAL PRICE API START ===')
    
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const type = searchParams.get('type') as 'currency' | 'crypto'
    const currencyCode = searchParams.get('currencyCode')
    const cryptoId = searchParams.get('cryptoId')
    
    console.log('📅 Historical price request:', { date, type, currencyCode, cryptoId })
    
    if (!date || !type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: date and type'
      }, { status: 400 })
    }

    // Handle currency historical data
    if (type === 'currency') {
      const symbol = currencyCode || searchParams.get('symbol')
      if (!symbol) {
        return NextResponse.json({
          success: false,
          error: 'Missing currency code or symbol'
        }, { status: 400 })
      }

      // For currency, we'll use TCMB historical XML API
      const historicalPrice = await getHistoricalCurrencyPrice(symbol, date)
      
      if (historicalPrice) {
        return NextResponse.json({
          success: true,
          data: {
            date: date,
            symbol: `${symbol}/TRY`,
            price: historicalPrice,
            type: 'currency',
            source: 'TCMB_HISTORICAL'
          }
        })
      } else {
        return NextResponse.json({
          success: false,
          error: `Historical currency data not available for ${symbol} on ${date}`
        })
      }
    }
    
    // Handle crypto historical data
    if (type === 'crypto') {
      const cryptoSymbol = cryptoId || currencyCode
      if (!cryptoSymbol) {
        return NextResponse.json({
          success: false,
          error: 'Missing crypto ID or currency code'
        }, { status: 400 })
      }

      // For crypto, we'll use CoinGecko API (free tier)
      const historicalPrice = await getHistoricalCryptoPrice(cryptoSymbol, date)
      
      if (historicalPrice) {
        return NextResponse.json({
          success: true,
          data: {
            date: date,
            symbol: cryptoSymbol.toUpperCase(),
            price: historicalPrice,
            type: 'crypto',
            source: 'COINGECKO'
          }
        })
      } else {
        return NextResponse.json({
          success: false,
          error: `Historical crypto data not available for ${cryptoSymbol} on ${date}`
        })
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid type specified'
    }, { status: 400 })

  } catch (error) {
    console.error('❌ Historical Price API error:', error)
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 })
  }
}

async function getHistoricalCurrencyPrice(symbol: string, date: string): Promise<number | null> {
  try {
    // Convert date format from YYYY-MM-DD to DD-MM-YYYY for TCMB
    const [year, month, day] = date.split('-')
    const tcmbDate = `${day}-${month}-${year}`
    
    // TCMB historical XML URL
    const xmlUrl = `https://www.tcmb.gov.tr/kurlar/${year}${month}/${day}${month}${year}.xml`
    
    console.log('🔍 Fetching historical currency data from:', xmlUrl)
    
    const response = await fetch(xmlUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TCMB-Client/1.0)',
        'Accept': 'application/xml,text/xml',
      },
      cache: 'no-store',
      timeout: 10000
    })

    if (!response.ok) {
      console.warn(`⚠️ TCMB historical API error: ${response.status} for date ${date}`)
      return null
    }

    const xmlText = await response.text()
    
    // Parse XML for the specific currency
    const currencyRegex = new RegExp(
      `<Currency[^>]*Kod="${symbol}"[^>]*>[\\s\\S]*?<ForexBuying>([^<]*)</ForexBuying>[\\s\\S]*?<ForexSelling>([^<]*)</ForexSelling>`,
      'g'
    )
    
    const match = currencyRegex.exec(xmlText)
    
    if (match) {
      const forexBuying = parseFloat(match[1].replace(',', '.')) || 0
      const forexSelling = parseFloat(match[2].replace(',', '.')) || 0
      
      if (forexBuying > 0 && forexSelling > 0) {
        const price = (forexBuying + forexSelling) / 2
        console.log(`✅ Historical ${symbol} price for ${date}: ${price}`)
        return price
      }
    }
    
    console.warn(`⚠️ No valid data found for ${symbol} on ${date}`)
    return null
    
  } catch (error) {
    console.error(`❌ Error fetching historical currency price for ${symbol}:`, error)
    return null
  }
}

async function getHistoricalCryptoPrice(symbol: string, date: string): Promise<number | null> {
  try {
    // Convert date to timestamp for CoinGecko API
    const targetDate = new Date(date)
    const timestamp = Math.floor(targetDate.getTime() / 1000)
    
    // Map common crypto symbols to CoinGecko IDs
    const cryptoMap: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'SOL': 'solana',
      'XRP': 'ripple',
      'ADA': 'cardano',
      'DOGE': 'dogecoin',
      'DOT': 'polkadot',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'USDT': 'tether',
      'USDC': 'usd-coin',
      'BUSD': 'binance-usd',
      'SHIB': 'shiba-inu',
      'LTC': 'litecoin',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'ATOM': 'cosmos',
      'XLM': 'stellar',
      'VET': 'vechain'
    }
    
    const coinId = cryptoMap[symbol.toUpperCase()] || symbol.toLowerCase()
    
    // CoinGecko historical price API - Use YYYY-MM-DD format
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${date}`
    
    console.log('🔍 Fetching historical crypto data from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Crypto-Client/1.0)',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      timeout: 10000
    })

    if (!response.ok) {
      console.warn(`⚠️ CoinGecko API error: ${response.status} for ${symbol} on ${date}`)
      return null
    }

    const data = await response.json()
    
    if (data && data.market_data && data.market_data.current_price && data.market_data.current_price.usd) {
      const price = data.market_data.current_price.usd
      console.log(`✅ Historical ${symbol} price for ${date}: $${price}`)
      return price
    }
    
    console.warn(`⚠️ No price data found for ${symbol} on ${date}`)
    return null
    
  } catch (error) {
    console.error(`❌ Error fetching historical crypto price for ${symbol}:`, error)
    return null
  }
=======
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const cryptoId = searchParams.get('cryptoId')
    const type = searchParams.get('type') as 'currency' | 'crypto' | undefined
    
    console.log(`Historical API called with: date=${date}, cryptoId=${cryptoId}, type=${type}`)
    
    if (!date) {
      return NextResponse.json({
        success: false,
        error: 'Date parameter is required'
      }, { status: 400 })
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      }, { status: 400 })
    }
    
    // Don't allow future dates
    const inputDate = new Date(date)
    const today = new Date()
    if (inputDate > today) {
      return NextResponse.json({
        success: false,
        error: 'Date cannot be in future'
      }, { status: 400 })
    }
    
    let result: HistoricalItem[] = []
    
    if (type === 'crypto' || cryptoId) {
      // Fetch crypto data using CoinMarketCap
      console.log(`Fetching crypto historical data for ${cryptoId || 'bitcoin'} on ${date}`)
      
      const cryptoData = await fetchCryptoHistoricalData(date, cryptoId)
      if (cryptoData) {
        return NextResponse.json({
          success: true,
          data: [cryptoData],
          date: date,
          type: 'crypto',
          cryptoId: cryptoId,
          timestamp: new Date().toISOString()
        })
      } else {
        console.warn(`No crypto data found for ${cryptoId || 'bitcoin'} on ${date}`)
        return NextResponse.json({
          success: false,
          error: `No historical crypto data available for ${cryptoId || 'bitcoin'} on ${date}. CoinMarketCap API may not have data for this date or API key is missing.`,
          date: date,
          type: 'crypto',
          cryptoId: cryptoId,
          timestamp: new Date().toISOString()
        }, { status: 404 })
      }
    } else {
      // Fetch currency data
      console.log(`Fetching currency historical data for ${date}`)
      const currencyData = await fetchCurrencyHistoricalData(date)
      if (currencyData) {
        result = currencyData
        console.log(`Currency data found: ${result.length} currencies`)
        return NextResponse.json({
          success: true,
          data: result,
          date: date,
          type: 'currency',
          timestamp: new Date().toISOString()
        })
      } else {
        console.log(`No currency data found for ${date}`)
        return NextResponse.json({
          success: false,
          error: `No historical currency data available for ${date}. TCMB API may not have data for this date.`,
          date: date,
          type: 'currency',
          timestamp: new Date().toISOString()
        }, { status: 404 })
      }
    }
    
  } catch (error) {
    console.error('Historical API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch historical data',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
>>>>>>> origin/master
}