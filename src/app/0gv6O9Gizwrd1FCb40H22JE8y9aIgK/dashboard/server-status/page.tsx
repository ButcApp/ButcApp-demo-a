'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
<<<<<<< HEAD
import { Activity, Cpu, HardDrive, MemoryStick, CheckCircle, AlertTriangle, XCircle, Zap, Database, Globe, Clock, Users, FileText, TrendingUp, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AdminAuthContext'

interface SystemInfo {
  status: string
  timestamp: string
  uptime: number
  memory: {
    total: number
    used: number
    free: number
    active: number
    heapUsed: number
    heapTotal: number
  }
  nodeVersion: string
  platform: string
  arch: string
  environment: string
  nextVersion: string
  cpu: {
    count: number
    usage: number
    loadAverage: string
  }
  database: {
    status: string
    provider: string
  }
  apis: {
    users: {
      status: string
      lastCheck: string
    }
    posts: {
      status: string
      lastCheck: string
    }
    categories: {
      status: string
      lastCheck: string
    }
    realtimeStats: {
      status: string
      lastCheck: string
    }
  }
=======
import { Cpu, HardDrive, MemoryStick, Activity } from 'lucide-react'

interface SystemInfo {
  cpu: { usage: number }
  memory: { total: number; used: number; free: number; active: number }
  disk: { size: number; used: number; available: number; percentage: number }
  timestamp: string
>>>>>>> origin/master
}

export default function ServerStatusPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
<<<<<<< HEAD
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const { isAuthenticated, user, token } = useAuth()
=======
>>>>>>> origin/master
  const router = useRouter()

  const fetchSystemInfo = async () => {
    try {
<<<<<<< HEAD
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('adminToken') || 
                   document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1]
      
      if (!token) {
        console.log('❌ Server Status: Token bulunamadı, fetch iptal ediliyor')
        router.push('/0gv6O9Gizwrd1FCb40H22JE8y9aIgK/login')
        return
      }
      
      console.log('📡 Server Status: Token bulundu, fetch başlatılıyor...')
      console.log('📡 Server Status: Token:', token.substring(0, 20) + '...')
      
      const response = await fetch('/0gv6O9Gizwrd1FCb40H22JE8y9aIgK/api/system-status', {
=======
      console.log('🔍 Server Status: Fetch başlıyor...')
      
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('adminToken')
      console.log('🔑 Server Status: Token durumu:', token ? 'mevcut' : 'yok')
      
      if (!token) {
        console.log('❌ Server Status: Token yok, login sayfasına yönlendiriliyor...')
        router.push('/0gv6O9Gizwrd1FCb40H22JE8y9aIgK/login')
        return
      }

      console.log('📡 Server Status: API isteği gönderiliyor...')
      console.log('📡 Server Status: Token:', token.substring(0, 20) + '...')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/0gv6O9Gizwrd1FCb40H22JE8y9aIgK/api/system-status`, {
>>>>>>> origin/master
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })
<<<<<<< HEAD
      
      console.log('📡 Server Status: API yanıtı status:', response.status)
      console.log('📡 Server Status: API yanıtı headers:', response.headers)
      
=======

      console.log('📡 Server Status: API yanıtı status:', response.status)
      console.log('📡 Server Status: API yanıtı headers:', response.headers)

>>>>>>> origin/master
      if (!response.ok) {
        const errorText = await response.text()
        console.log('❌ Server Status: API hata yanıtı:', errorText)
        
        if (response.status === 401) {
          console.log('🔄 Server Status: 401 hatası, token siliniyor...')
          localStorage.removeItem('adminToken')
<<<<<<< HEAD
=======
          localStorage.removeItem('adminUser')
>>>>>>> origin/master
          router.push('/0gv6O9Gizwrd1FCb40H22JE8y9aIgK/login')
          return
        }
        
        throw new Error(`API Hatası: ${response.status} - ${errorText}`)
      }
<<<<<<< HEAD
      
      const data = await response.json()
      console.log('✅ Server Status: API verisi alındı:', data)
      
      setSystemInfo(data.data)
      setLastUpdate(new Date())
      setError(null)
      
    } catch (err) {
      console.error('❌ Server Status: Fetch hatası:', err)
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
=======

      const data = await response.json()
      console.log('✅ Server Status: API verisi alındı:', data)
      setSystemInfo(data)
      setError(null)
      setLoading(false)
    } catch (err) {
      console.error('❌ Server Status: Fetch hatası:', err)
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
>>>>>>> origin/master
      setLoading(false)
    }
  }

  useEffect(() => {
<<<<<<< HEAD
    console.log('Server Status Page Debug:', {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      userId: user?.id
    })
    
    if (!isAuthenticated) {
      console.log('❌ Server Status: Not authenticated, redirecting to login')
      router.push('/0gv6O9Gizwrd1FCb40H22JE8y9aIgK/login')
      return
    }
    
=======
>>>>>>> origin/master
    console.log('🚀 Server Status: Component mount edildi')
    fetchSystemInfo()
    
    const interval = setInterval(fetchSystemInfo, 5000)
    console.log('⏰ Server Status: Interval ayarlandı (5 saniye)')
<<<<<<< HEAD
    
=======

>>>>>>> origin/master
    return () => {
      console.log('🛑 Server Status: Component unmount edildi, interval temizleniyor')
      clearInterval(interval)
    }
<<<<<<< HEAD
  }, [router, isAuthenticated])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) {
      return `${days}g ${hours}s ${minutes}d`
    } else if (hours > 0) {
      return `${hours}s ${minutes}d`
    } else {
      return `${minutes}d`
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p className="mt-4 text-muted-foreground">Yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  if (loading && !systemInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
=======
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 animate-pulse" />
            <span>Yükleniyor...</span>
          </div>
>>>>>>> origin/master
        </div>
      </div>
    )
  }

  if (error) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-500" />
          <p className="mt-4 text-red-600">{error}</p>
          <button
            onClick={fetchSystemInfo}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tekrar Dene
=======
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
          <p className="text-destructive">Hata: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Sayfayı Yenile
>>>>>>> origin/master
          </button>
        </div>
      </div>
    )
  }

<<<<<<< HEAD
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Sunucu Durumu
            </h1>
            <p className="text-muted-foreground">
              Sistem durumu ve performans metrikleri
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdate && (
              <div className="text-sm text-muted-foreground">
                Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
              </div>
            )}
            <button
              onClick={fetchSystemInfo}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Yenile
            </button>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sunucu Durumu</CardTitle>
            <div className={`text-sm font-medium ${getStatusColor(systemInfo?.status || 'unknown')}`}>
              {systemInfo?.status?.toUpperCase() || 'BİLİNMEYOR'}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemInfo?.status || 'unknown')}
              <span className="text-lg font-semibold">
                {systemInfo?.status === 'active' ? 'Sağlıklı' : 'Bilinmeyor'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {systemInfo?.status === 'active' 
                ? 'Tüm sistemler çalışır durumda' 
                : 'Bazı sistemlerde sorun olabilir'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Çalışma Süresi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemInfo?.uptime ? formatUptime(systemInfo.uptime) : 'Bilinmiyor'}
            </div>
            <p className="text-xs text-muted-foreground">
              Sunucunun çalışma süresi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistem Versiyonu</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Node.js:</span>
                <span className="text-sm font-medium">{systemInfo?.nodeVersion || 'Bilinmiyor'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next.js:</span>
                <span className="text-sm font-medium">{systemInfo?.nextVersion || 'Bilinmiyor'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Platform:</span>
                <span className="text-sm font-medium">{systemInfo?.platform || 'Bilinmiyor'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
=======
  if (!systemInfo) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-muted-foreground">
          Sistem bilgileri mevcut değil
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sunucu Durumu</h1>
          <p className="text-muted-foreground">
            Son güncelleme: {new Date(systemInfo.timestamp).toLocaleString('tr-TR')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
>>>>>>> origin/master
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Kullanımı</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
<<<<<<< HEAD
              <div className="text-2xl font-bold">{systemInfo?.cpu?.usage || 0}%</div>
              <Progress value={systemInfo?.cpu?.usage || 0} className="w-full" />
              <p className="text-xs text-muted-foreground">
                İşlemci yükü
              </p>
=======
              <div className="text-2xl font-bold">{systemInfo.cpu.usage}%</div>
              <Progress value={systemInfo.cpu.usage} className="w-full" />
              <p className="text-xs text-muted-foreground">İşlemci yükü</p>
>>>>>>> origin/master
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bellek Kullanımı</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
<<<<<<< HEAD
              <div className="text-2xl font-bold">{systemInfo?.memory?.active || 0}%</div>
              <Progress value={systemInfo?.memory?.active || 0} className="w-full" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Toplam: {systemInfo?.memory?.total || 0} GB</p>
                <p>Kullanılan: {systemInfo?.memory?.used || 0} GB</p>
                <p>Boşta: {systemInfo?.memory?.free || 0} GB</p>
                <p>Heap: {systemInfo?.memory?.heapUsed || 0} MB / {systemInfo?.memory?.heapTotal || 0} MB</p>
=======
              <div className="text-2xl font-bold">{systemInfo.memory.active}%</div>
              <Progress value={systemInfo.memory.active} className="w-full" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Toplam: {systemInfo.memory.total} GB</p>
                <p>Kullanılan: {systemInfo.memory.used} GB</p>
                <p>Boş: {systemInfo.memory.free} GB</p>
>>>>>>> origin/master
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Kullanımı</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
<<<<<<< HEAD
              <div className="text-2xl font-bold">85%</div>
              <Progress value={85} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Toplam: 256 GB
              </p>
=======
              <div className="text-2xl font-bold">{systemInfo.disk.percentage}%</div>
              <Progress value={systemInfo.disk.percentage} className="w-full" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Toplam: {systemInfo.disk.size} GB</p>
                <p>Kullanılan: {systemInfo.disk.used} GB</p>
                <p>Boş: {systemInfo.disk.available} GB</p>
              </div>
>>>>>>> origin/master
            </div>
          </CardContent>
        </Card>
      </div>

<<<<<<< HEAD
      {/* Database Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veritabanı</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`text-sm font-medium ${getStatusColor(systemInfo?.database?.status || 'unknown')}`}>
                  {systemInfo?.database?.status?.toUpperCase() || 'BİLİNMEYOR'}
                </div>
                {getStatusIcon(systemInfo?.database?.status || 'unknown')}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {systemInfo?.database?.provider || 'Bilinmiyor'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Son Kontrol</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {systemInfo?.apis?.users?.lastCheck ? new Date(systemInfo.apis.users.lastCheck).toLocaleString('tr-TR') : 'Bilinmiyor'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanıcılar API</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`text-sm font-medium ${getStatusColor(systemInfo?.apis?.users?.status || 'unknown')}`}>
                  {systemInfo?.apis?.users?.status?.toUpperCase() || 'BİLİNMEYOR'}
                </div>
                {getStatusIcon(systemInfo?.apis?.users?.status || 'unknown')}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Son kontrol: {systemInfo?.apis?.users?.lastCheck ? new Date(systemInfo.apis.users.lastCheck).toLocaleString('tr-TR') : 'Bilinmiyor'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yazılar API</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`text-sm font-medium ${getStatusColor(systemInfo?.apis?.posts?.status || 'unknown')}`}>
                  {systemInfo?.apis?.posts?.status?.toUpperCase() || 'BİLİNMEYOR'}
                </div>
                {getStatusIcon(systemInfo?.apis?.posts?.status || 'unknown')}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Son kontrol: {systemInfo?.apis?.posts?.lastCheck ? new Date(systemInfo.apis.posts.lastCheck).toLocaleString('tr-TR') : 'Bilinmiyor'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriler API</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`text-sm font-medium ${getStatusColor(systemInfo?.apis?.categories?.status || 'unknown')}`}>
                  {systemInfo?.apis?.categories?.status?.toUpperCase() || 'BİLİNMEYOR'}
                </div>
                {getStatusIcon(systemInfo?.apis?.categories?.status || 'unknown')}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Son kontrol: {systemInfo?.apis?.categories?.lastCheck ? new Date(systemInfo.apis.categories.lastCheck).toLocaleString('tr-TR') : 'Bilinmiyor'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Stats</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`text-sm font-medium ${getStatusColor(systemInfo?.apis?.realtimeStats?.status || 'unknown')}`}>
                  {systemInfo?.apis?.realtimeStats?.status?.toUpperCase() || 'BİLİNMEYOR'}
                </div>
                {getStatusIcon(systemInfo?.apis?.realtimeStats?.status || 'unknown')}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Son kontrol: {systemInfo?.apis?.realtimeStats?.lastCheck ? new Date(systemInfo.apis.realtimeStats.lastCheck).toLocaleString('tr-TR') : 'Bilinmiyor'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ortam Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Platform:</span>
              <span className="font-medium ml-2">{systemInfo?.platform || 'Bilinmiyor'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Mimari:</span>
              <span className="font-medium ml-2">{systemInfo?.arch || 'Bilinmiyor'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Ortam:</span>
              <span className="font-medium ml-2">{systemInfo?.environment || 'Bilinmiyor'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Saat Dil:</span>
              <span className="font-medium ml-2">UTC</span>
=======
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sistem Detayları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">CPU Performansı</h4>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  Mevcut Yük: <span className="font-mono">{systemInfo.cpu.usage}%</span>
                </p>
                <p className="text-muted-foreground">
                  Durum: <span className={systemInfo.cpu.usage > 80 ? 'text-destructive' : 'text-green-600'}>
                    {systemInfo.cpu.usage > 80 ? 'Yüksek' : 'Normal'}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-primary">Bellek Durumu</h4>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  Kullanım: <span className="font-mono">{systemInfo.memory.used}/{systemInfo.memory.total} GB</span>
                </p>
                <p className="text-muted-foreground">
                  Durum: <span className={systemInfo.memory.active > 80 ? 'text-destructive' : 'text-green-600'}>
                    {systemInfo.memory.active > 80 ? 'Kritik' : 'Normal'}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-primary">Disk Durumu</h4>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  Kullanım: <span className="font-mono">{systemInfo.disk.used}/{systemInfo.disk.size} GB</span>
                </p>
                <p className="text-muted-foreground">
                  Durum: <span className={systemInfo.disk.percentage > 80 ? 'text-destructive' : 'text-green-600'}>
                    {systemInfo.disk.percentage > 80 ? 'Düşük Alan' : 'Normal'}
                  </span>
                </p>
              </div>
>>>>>>> origin/master
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}