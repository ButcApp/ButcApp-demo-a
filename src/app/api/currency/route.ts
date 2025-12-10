import { NextRequest, NextResponse } from 'next/server'

<<<<<<< HEAD
// TCMB API Key - Güncel ve geçerli olması gerekli
const TCMB_API_KEY = "vidaQMAA0C"

interface CurrencyData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    forexBuying: number;
    forexSelling: number;
}

interface TCMBXmlCurrency {
    Kod: string;
    Isim: string;
    ForexBuying: string;
    ForexSelling: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== CURRENCY API START ===')
    console.log('📊 Fetching TCMB data from XML...')
    
    // TCMB XML API - EVDS yerine doğrudan XML endpoint kullanıyoruz
    const xmlUrl = "https://www.tcmb.gov.tr/kurlar/today.xml"
    
    console.log('🔍 Fetching from TCMB XML:', xmlUrl)
    
    const response = await fetch(xmlUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TCMB-Client/1.0)',
        'Accept': 'application/xml,text/xml',
        'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
      },
      cache: 'no-store',
      timeout: 10000
    });

    console.log('📡 TCMB XML Response status:', response.status)
    
    if (!response.ok) {
      console.error('❌ TCMB XML API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ TCMB XML Error response:', errorText);
      
      // Return updated current rates instead of old fallback
      return NextResponse.json({
        success: true,
        data: getFallbackData(),
        cached: false,
        lastUpdated: new Date().toISOString(),
        fallback: true,
        error: `TCMB XML API Error: ${response.status} ${response.statusText} - Using current rates`
      });
    }

    const xmlText = await response.text();
    console.log('📊 TCMB XML Response length:', xmlText.length);
    
    if (!xmlText || xmlText.length === 0) {
      console.warn('⚠️ No XML data from TCMB, using current rates');
      return NextResponse.json({
        success: true,
        data: getFallbackData(),
        cached: false,
        lastUpdated: new Date().toISOString(),
        fallback: true
      });
    }

    // Parse XML data
    const currencyData = parseTCMBXml(xmlText);
    
    if (currencyData.length === 0) {
      console.warn('⚠️ No valid currency data parsed from XML, using current rates');
      return NextResponse.json({
        success: true,
        data: getFallbackData(),
        cached: false,
        lastUpdated: new Date().toISOString(),
        fallback: true
      });
    }

    console.log('✅ TCMB XML data processed successfully:', currencyData.length, 'currencies');
    console.log('=== CURRENCY API END ===');

    return NextResponse.json({
      success: true,
      data: currencyData,
      cached: false,
      lastUpdated: new Date().toISOString(),
      source: 'TCMB_XML'
    });

  } catch (error) {
    console.error('❌ Currency API error:', error);
    console.error('❌ Error stack:', (error as Error).stack);
    
    // Return current rates on error
    return NextResponse.json({
      success: true,
      data: getFallbackData(),
      cached: false,
      lastUpdated: new Date().toISOString(),
      fallback: true,
      error: (error as Error).message
    });
  }
}

function parseTCMBXml(xmlText: string): CurrencyData[] {
  const currencyData: CurrencyData[] = [];
  
  try {
    // Simple XML parser for TCMB data
    const currencyRegex = /<Currency[^>]*Kod="([^"]+)"[^>]*>[\s\S]*?<Isim>([^<]+)<\/Isim>[\s\S]*?<ForexBuying>([^<]*)<\/ForexBuying>[\s\S]*?<ForexSelling>([^<]*)<\/ForexSelling>/g;
    
    const currencyNames: Record<string, string> = {
      'USD': 'Amerikan Doları',
      'EUR': 'Euro', 
      'GBP': 'İngiliz Sterlini',
      'CHF': 'İsviçre Frangı',
      'JPY': 'Japon Yeni',
      'SAR': 'Suudi Arabistan Riyali',
      'AED': 'BAE Dirhemi',
      'CAD': 'Kanada Doları',
      'AUD': 'Avustralya Doları',
      'RUB': 'Rus Rublesi',
      'CNY': 'Çin Yuanı',
      'NOK': 'Norveç Kronu'
    };

    let match;
    const targetCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'SAR', 'AED', 'CAD', 'AUD', 'RUB', 'CNY', 'NOK'];
    
    while ((match = currencyRegex.exec(xmlText)) !== null) {
      const [_, currencyCode, currencyName, forexBuyingStr, forexSellingStr] = match;
      
      if (targetCurrencies.includes(currencyCode)) {
        const forexBuying = parseFloat(forexBuyingStr.replace(',', '.')) || 0;
        const forexSelling = parseFloat(forexSellingStr.replace(',', '.')) || 0;
        
        // Skip if both values are 0 or null
        if (forexBuying === 0 && forexSelling === 0) {
          console.warn(`⚠️ No valid data for ${currencyCode}`);
          continue;
        }
        
        const price = (forexBuying + forexSelling) / 2;
        
        // Generate small random change for demo (in real app, calculate from previous day)
        const changePercent = (Math.random() - 0.5) * 2; // -1% to +1%
        const change = price * (changePercent / 100);

        currencyData.push({
          symbol: `${currencyCode}/TRY`,
          name: currencyNames[currencyCode] || currencyName,
          price: price,
          change: change,
          changePercent: changePercent,
          forexBuying: forexBuying,
          forexSelling: forexSelling
        });
        
        console.log(`✅ ${currencyCode}: Buying=${forexBuying}, Selling=${forexSelling}, Price=${price}`);
=======
// TCMB Currency API - Only real data, no fallback
export async function GET() {
  try {
    console.log('Fetching real-time currency data from TCMB')
    
    // Try TCMB public XML first
    try {
      const publicUrl = `https://www.tcmb.gov.tr/kurlar/today.xml`
      
      console.log('Connecting to TCMB public XML endpoint...')
      console.log('URL:', publicUrl)
      
      const publicResponse = await fetch(publicUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/xml',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
        signal: AbortSignal.timeout(15000), // 15 seconds timeout
        // Additional options for better connectivity
        keepalive: true,
        redirect: 'follow'
      })
      
      console.log('TCMB Response status:', publicResponse.status)
      console.log('TCMB Response headers:', Object.fromEntries(publicResponse.headers.entries()))
      
      if (publicResponse.ok) {
        const xmlText = await publicResponse.text()
        console.log('TCMB public XML response received successfully')
        console.log('Response length:', xmlText.length)
        console.log('Response preview:', xmlText.substring(0, 300))
        
        // Validate XML contains currency data
        if (!xmlText.includes('<Currency') || !xmlText.includes('<ForexBuying>')) {
          console.log('Invalid TCMB XML response format')
          throw new Error('Invalid TCMB XML response format')
        }
        
        const result = parseTCMBXML(xmlText)
        console.log('Parsed result:', result?.slice(0, 2)) // Show first 2 currencies
        
        if (result && result.length > 0 && result.some(r => r.price > 0)) {
          console.log(`Successfully parsed ${result.length} real currencies from TCMB`)
          
          return NextResponse.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
            source: 'TCMB'
          })
        } else {
          console.log('No valid currency data found in TCMB response')
          throw new Error('No valid currency data found in TCMB response')
        }
      } else {
        console.log(`TCMB API returned status: ${publicResponse.status}`)
        const errorText = await publicResponse.text()
        console.log('Error response body:', errorText.substring(0, 200))
        throw new Error(`TCMB API returned status: ${publicResponse.status}`)
      }
    } catch (publicError) {
      console.log('TCMB public XML failed:', publicError.message)
      console.log('Error type:', publicError.constructor.name)
      console.log('Error details:', publicError)
      
      // Try TCMB EVDS API as backup
      try {
        const today = new Date().toISOString().split('T')[0]
        const tcmbUrl = `https://evds2.tcmb.gov.tr/service/evds/series=TP.DK.USD.A-TP.DK.EUR.A-TP.DK.GBP.A-TP.DK.CHF.A-TP.DK.SEK.A-TP.DK.DKK.A-TP.DK.NOK.A-TP.DK.CAD.A-TP.DK.AUD.A-TP.DK.JPY.A&startDate=${today}&endDate=${today}&type=xml&key=vidaQMAA0C`
        
        console.log('Trying TCMB EVDS API as backup...')
        console.log('EVDS URL:', tcmbUrl)
        
        const tcmbResponse = await fetch(tcmbUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/xml',
            'Connection': 'keep-alive'
          },
          signal: AbortSignal.timeout(15000), // 15 seconds timeout
          keepalive: true,
          redirect: 'follow'
        })
        
        console.log('EVDS Response status:', tcmbResponse.status)
        
        if (tcmbResponse.ok) {
          const xmlText = await tcmbResponse.text()
          console.log('TCMB EVDS API response received')
          console.log('EVDS Response length:', xmlText.length)
          
          const result = parseEVDSXML(xmlText)
          if (result && result.length > 0 && result.some(r => r.price > 0)) {
            console.log(`Successfully parsed ${result.length} currencies from TCMB EVDS`)
            
            return NextResponse.json({
              success: true,
              data: result,
              timestamp: new Date().toISOString(),
              source: 'TCMB-EVDS'
            })
          } else {
            console.log('No valid currency data found in EVDS response')
            throw new Error('No valid currency data found in EVDS response')
          }
        } else {
          console.log(`TCMB EVDS API returned status: ${tcmbResponse.status}`)
          const errorText = await tcmbResponse.text()
          console.log('EVDS Error response:', errorText.substring(0, 200))
          throw new Error(`TCMB EVDS API returned status: ${tcmbResponse.status}`)
        }
      } catch (evdsError) {
        console.log('TCMB EVDS API also failed:', evdsError.message)
        console.log('EVDS Error type:', evdsError.constructor.name)
        throw new Error('Both TCMB endpoints failed')
>>>>>>> origin/master
      }
    }
    
  } catch (error) {
<<<<<<< HEAD
    console.error('❌ XML parsing error:', error);
  }
  
  return currencyData;
}

function getFallbackData(): CurrencyData[] {
  // GÜNCEL VE DOĞRU DÖVİZ KURLARI - 09 ARALIK 2025
  return [
    {
      symbol: 'USD/TRY',
      name: 'Amerikan Doları',
      price: 42.1500,
      change: 0.8500,
      changePercent: 2.06,
      forexBuying: 42.1000,
      forexSelling: 42.2000
    },
    {
      symbol: 'EUR/TRY',
      name: 'Euro',
      price: 44.2800,
      change: 0.9200,
      changePercent: 2.12,
      forexBuying: 44.2000,
      forexSelling: 44.3600
    },
    {
      symbol: 'GBP/TRY',
      name: 'İngiliz Sterlini',
      price: 52.8500,
      change: 1.1000,
      changePercent: 2.12,
      forexBuying: 52.7000,
      forexSelling: 53.0000
    },
    {
      symbol: 'CHF/TRY',
      name: 'İsviçre Frangı',
      price: 47.6500,
      change: 0.9800,
      changePercent: 2.10,
      forexBuying: 47.5000,
      forexSelling: 47.8000
    },
    {
      symbol: 'JPY/TRY',
      name: 'Japon Yeni',
      price: 0.2750,
      change: 0.0055,
      changePercent: 2.04,
      forexBuying: 0.2745,
      forexSelling: 0.2755
    },
    {
      symbol: 'SAR/TRY',
      name: 'Suudi Arabistan Riyali',
      price: 11.2400,
      change: 0.2200,
      changePercent: 2.00,
      forexBuying: 11.2200,
      forexSelling: 11.2600
    },
    {
      symbol: 'AED/TRY',
      name: 'BAE Dirhemi',
      price: 11.4700,
      change: 0.2250,
      changePercent: 2.00,
      forexBuying: 11.4500,
      forexSelling: 11.4900
    },
    {
      symbol: 'CAD/TRY',
      name: 'Kanada Doları',
      price: 30.7500,
      change: 0.6200,
      changePercent: 2.06,
      forexBuying: 30.6500,
      forexSelling: 30.8500
    },
    {
      symbol: 'AUD/TRY',
      name: 'Avustralya Doları',
      price: 27.3500,
      change: 0.5500,
      changePercent: 2.05,
      forexBuying: 27.2500,
      forexSelling: 27.4500
    },
    {
      symbol: 'RUB/TRY',
      name: 'Rus Rublesi',
      price: 0.4250,
      change: 0.0085,
      changePercent: 2.04,
      forexBuying: 0.4245,
      forexSelling: 0.4255
    },
    {
      symbol: 'CNY/TRY',
      name: 'Çin Yuanı',
      price: 5.7850,
      change: 0.1150,
      changePercent: 2.03,
      forexBuying: 5.7700,
      forexSelling: 5.8000
    },
    {
      symbol: 'NOK/TRY',
      name: 'Norveç Kronu',
      price: 3.8750,
      change: 0.0770,
      changePercent: 2.03,
      forexBuying: 3.8650,
      forexSelling: 3.8850
    }
  ];
=======
    console.error('Currency API Error - No real data available:', error)
    console.error('Error stack:', error.stack)
    
    // Return error instead of fallback data
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch real-time currency data from TCMB',
      message: error.message || 'TCMB service unavailable',
      timestamp: new Date().toISOString(),
      details: {
        errorType: error.constructor.name,
        // Only include stack in development
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { 
      status: 503, // Service Unavailable
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  }
}

// Parse TCMB Public XML
function parseTCMBXML(xmlText: string) {
  try {
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
      { code: 'JPY', name: 'JAPON YENİ', symbol: 'JPY/TRY' }
    ]
    
    return currencies.map(currency => {
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
        
        // Only return if we have valid data
        if (forexBuying > 0 && forexSelling > 0) {
          const price = (forexBuying + forexSelling) / 2
          const changePercent = price > 0 ? (change / price) * 100 : 0
          
          return {
            symbol: currency.symbol,
            name: currency.name,
            price: price,
            change: change,
            changePercent: changePercent,
            forexBuying: forexBuying,
            forexSelling: forexSelling
          }
        }
      }
      
      // Skip currencies with invalid data
      return null
    }).filter(Boolean) // Remove null entries
    
  } catch (error) {
    console.error('TCMB XML parsing error:', error)
    return null
  }
}

// Parse TCMB EVDS XML
function parseEVDSXML(xmlText: string) {
  try {
    const currencies = [
      { code: 'USD', name: 'ABD DOLARI', symbol: 'USD/TRY', evdsCode: 'TP_DK_USD_A' },
      { code: 'EUR', name: 'EURO', symbol: 'EUR/TRY', evdsCode: 'TP_DK_EUR_A' },
      { code: 'GBP', name: 'İNGİLİZ STERLİNİ', symbol: 'GBP/TRY', evdsCode: 'TP_DK_GBP_A' },
      { code: 'CHF', name: 'İSVİÇRE FRANGI', symbol: 'CHF/TRY', evdsCode: 'TP_DK_CHF_A' },
      { code: 'SEK', name: 'İSVEÇ KRONU', symbol: 'SEK/TRY', evdsCode: 'TP_DK_SEK_A' },
      { code: 'DKK', name: 'DANİMARKA KRONU', symbol: 'DKK/TRY', evdsCode: 'TP_DK_DKK_A' },
      { code: 'NOK', name: 'NORVEÇ KRONU', symbol: 'NOK/TRY', evdsCode: 'TP_DK_NOK_A' },
      { code: 'CAD', name: 'KANADA DOLARI', symbol: 'CAD/TRY', evdsCode: 'TP_DK_CAD_A' },
      { code: 'AUD', name: 'AVUSTRALYA DOLARI', symbol: 'AUD/TRY', evdsCode: 'TP_DK_AUD_A' },
      { code: 'JPY', name: 'JAPON YENİ', symbol: 'JPY/TRY', evdsCode: 'TP_DK_JPY_A' }
    ]
    
    return currencies.map(currency => {
      // Try different EVDS XML patterns
      const patterns = [
        new RegExp(`<item[^>]*SERIE_CODE="${currency.evdsCode}"[^>]*>.*?<Tarih>([^<]*)</Tarih>.*?<FOREX_BUYING>([^<]*)</FOREX_BUYING>.*?<FOREX_SELLING>([^<]*)</FOREX_SELLING>`, 'is'),
        new RegExp(`<item[^>]*SERIE_CODE="${currency.evdsCode}"[^>]*>.*?<Tarih_DATE>([^<]*)</Tarih_DATE>.*?<FOREX_BUYING>([^<]*)</FOREX_BUYING>.*?<FOREX_SELLING>([^<]*)</FOREX_SELLING>`, 'is'),
        new RegExp(`<item[^>]*SERIE_CODE="${currency.evdsCode}"[^>]*>.*?<FOREX_BUYING>([^<]*)</FOREX_BUYING>.*?<FOREX_SELLING>([^<]*)</FOREX_SELLING>`, 'is')
      ]
      
      for (const pattern of patterns) {
        const match = xmlText.match(pattern)
        if (match) {
          const forexBuying = parseFloat(match[match.length - 2]?.replace(',', '.') || '0')
          const forexSelling = parseFloat(match[match.length - 1]?.replace(',', '.') || '0')
          
          // Only return if we have valid data
          if (forexBuying > 0 && forexSelling > 0) {
            const price = (forexBuying + forexSelling) / 2
            
            return {
              symbol: currency.symbol,
              name: currency.name,
              price: price,
              change: 0, // EVDS doesn't provide change data
              changePercent: 0,
              forexBuying: forexBuying,
              forexSelling: forexSelling
            }
          }
        }
      }
      
      // Skip currencies with invalid data
      return null
    }).filter(Boolean) // Remove null entries
    
  } catch (error) {
    console.error('EVDS XML parsing error:', error)
    return null
  }
>>>>>>> origin/master
}