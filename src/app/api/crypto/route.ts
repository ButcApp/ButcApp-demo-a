import { NextRequest, NextResponse } from 'next/server'

<<<<<<< HEAD
// Mock crypto data - In production, this would fetch from a real API
const mockCryptoData = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 43250.00,
    change: 1250.00,
    changePercent: 2.98,
    volume: '28.5B',
    marketCap: '845.2B',
    icon: '₿'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2280.50,
    change: 45.20,
    changePercent: 2.02,
    volume: '15.2B',
    marketCap: '273.8B',
    icon: 'Ξ'
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    price: 315.80,
    change: 8.40,
    changePercent: 2.73,
    volume: '1.2B',
    marketCap: '48.5B',
    icon: 'B'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 98.45,
    change: 3.25,
    changePercent: 3.41,
    volume: '2.8B',
    marketCap: '42.1B',
    icon: 'S'
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 0.6250,
    change: 0.0150,
    changePercent: 2.46,
    volume: '1.5B',
    marketCap: '33.8B',
    icon: 'X'
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.5850,
    change: 0.0120,
    changePercent: 2.09,
    volume: '425M',
    marketCap: '20.6B',
    icon: 'A'
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.0850,
    change: 0.0025,
    changePercent: 3.03,
    volume: '680M',
    marketCap: '12.1B',
    icon: 'D'
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    price: 7.85,
    change: 0.18,
    changePercent: 2.34,
    volume: '320M',
    marketCap: '9.8B',
    icon: 'P'
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    price: 0.9250,
    change: 0.0180,
    changePercent: 1.99,
    volume: '285M',
    marketCap: '8.6B',
    icon: 'M'
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 38.50,
    change: 0.95,
    changePercent: 2.53,
    volume: '420M',
    marketCap: '14.2B',
    icon: 'A'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    price: 1.0000,
    change: 0.0000,
    changePercent: 0.00,
    volume: '45.2B',
    marketCap: '91.5B',
    icon: '₮'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    price: 1.0000,
    change: 0.0000,
    changePercent: 0.00,
    volume: '8.5B',
    marketCap: '24.8B',
    icon: '$'
  }
]

export async function GET(request: NextRequest) {
  try {
    console.log('=== CRYPTO API START ===')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('✅ Crypto data fetched successfully:', mockCryptoData.length, 'items')
    console.log('=== CRYPTO API END ===')

    return NextResponse.json({
      success: true,
      data: mockCryptoData,
      cached: false,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Crypto API error:', error)
=======
interface CryptoItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  icon?: string
}

interface FreeCryptoAPIResponse {
  status: string
  symbols: Array<{
    symbol: string
    last: string
    last_btc: string
    lowest: string
    highest: string
    date: string
    daily_change_percentage: string
    source_exchange: string
  }>
  loaded_time: number
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
  'AVAX': 'text-red-500',
  'SHIB': 'text-orange-600',
  'LTC': 'text-gray-500',
  'LINK': 'text-blue-400',
  'UNI': 'text-pink-400',
  'ATOM': 'text-indigo-500',
  'FIL': 'text-blue-600',
  'CRO': 'text-blue-700',
  'VET': 'text-green-600',
  'TRX': 'text-red-600',
  'XLM': 'text-purple-400',
  'AAVE': 'text-purple-700',
  'MKR': 'text-green-500',
  'COMP': 'text-yellow-600',
  'SUSHI': 'text-pink-500',
  'CRV': 'text-red-500',
  'YFI': 'text-blue-800',
  'SNX': 'text-indigo-600',
  'REN': 'text-green-400',
  'ZRX': 'text-purple-500',
  'BAND': 'text-blue-500',
  'UMA': 'text-orange-600',
  'BAL': 'text-yellow-500',
  '1INCH': 'text-cyan-500'
}

async function fetchCryptoData(): Promise<CryptoItem[]> {
  // FreeCryptoAPI anahtarı
  const apiKey = process.env.FREECRYPTOAPI_API_KEY || '6lfnrxu8889pmxri1y7v'
  
  console.log('Using FreeCryptoAPI key:', apiKey.substring(0, 10) + '...')

  try {
    // FreeCryptoAPI - popüler kripto paralar
    const symbols = 'BTC+ETH+BNB+SOL+XRP+ADA+DOGE+DOT+MATIC+AVAX+SHIB+LTC+LINK+UNI+ATOM+XLM+VET+TRX+USDT+USDC+BUSD'
    
    const response = await fetch(`https://api.freecryptoapi.com/v1/getData?token=${apiKey}&symbol=${symbols}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10 seconds timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: FreeCryptoAPIResponse = await response.json()
    
    if (data.status !== 'success') {
      throw new Error(`FreeCryptoAPI error: Failed to fetch data`)
    }

    console.log('✅ Successfully fetched real crypto data from FreeCryptoAPI')
    
    // Kripto para isimlerini eşleştir
    const cryptoNames: Record<string, string> = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum', 
      'BNB': 'Binance Coin',
      'SOL': 'Solana',
      'XRP': 'Ripple',
      'ADA': 'Cardano',
      'DOGE': 'Dogecoin',
      'DOT': 'Polkadot',
      'MATIC': 'Polygon',
      'AVAX': 'Avalanche',
      'SHIB': 'Shiba Inu',
      'LTC': 'Litecoin',
      'LINK': 'Chainlink',
      'UNI': 'Uniswap',
      'ATOM': 'Cosmos',
      'XLM': 'Stellar',
      'VET': 'VeChain',
      'TRX': 'TRON',
      'USDT': 'Tether',
      'USDC': 'USD Coin',
      'BUSD': 'Binance USD'
    }
    
    return data.symbols.map(crypto => {
      const price = parseFloat(crypto.last)
      const changePercent = parseFloat(crypto.daily_change_percentage)
      const change = price * (changePercent / 100)
      
      return {
        symbol: crypto.symbol,
        name: cryptoNames[crypto.symbol] || crypto.symbol,
        price: price,
        change: change,
        changePercent: changePercent,
        volume: 'N/A', // FreeCryptoAPI volume sağlamıyor
        marketCap: 'N/A', // FreeCryptoAPI market cap sağlamıyor
        icon: CRYPTO_ICONS[crypto.symbol] || 'text-gray-500'
      }
    })
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    // Hata durumunda boş dizi döndür, mock veri kullanma
    throw new Error(`Failed to fetch crypto data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function GET(request: NextRequest) {
  try {
    const cryptoData = await fetchCryptoData()
    
    return NextResponse.json({
      success: true,
      data: cryptoData,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Crypto API error:', error)
>>>>>>> origin/master
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch crypto data',
<<<<<<< HEAD
      details: (error as Error).message
=======
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
>>>>>>> origin/master
    }, { status: 500 })
  }
}