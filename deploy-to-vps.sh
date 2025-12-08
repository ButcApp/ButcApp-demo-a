#!/bin/bash

<<<<<<< HEAD
# ButcApp.com VPS Deployment Script (pnpm version)
=======
# ButcApp.com VPS Deployment Script
>>>>>>> e24e41a09e2ad6015452c7d5548a957a3c4fec4d

echo "🚀 ButcApp.com VPS deployment başlatılıyor..."

# VPS bilgileri
VPS_IP="5.133.102.196"
VPS_USER="root"
VPS_DIR="/var/www/butcapp"

echo "📍 VPS IP: $VPS_IP"
echo "👤 Kullanıcı: $VPS_USER"
echo "📁 Dizin: $VPS_DIR"
echo ""

# VPS'e bağlan ve hazırlık yap
echo "🔧 VPS hazırlanıyor..."
ssh $VPS_USER@$VPS_IP << 'EOF'
# Proje dizini oluştur
mkdir -p /var/www/butcapp

# Eski dosyaları yedekle (varsa)
if [ -d "/var/www/butcapp/old" ]; then
    rm -rf /var/www/butcapp/old
fi
if [ -d "/var/www/butcapp/src" ]; then
    mv /var/www/butcapp /var/www/butcapp/old
    mkdir -p /var/www/butcapp
fi

echo "✅ VPS hazırlığı tamamlandı"
EOF

# Environment variables oluştur
echo "📝 Environment variables oluşturuluyor..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /var/www/butcapp

# .env dosyası oluştur
cat > .env << 'ENVEOF'
DATABASE_URL=file:/var/www/butcapp/db/custom.db
JWT_SECRET=butcapp-secret-key-change-in-production-2024
NEXT_PUBLIC_API_URL=https://butcapp.com
NODE_ENV=production
PORT=3000
ENVEOF

echo "✅ Environment variables oluşturuldu"
EOF

# Projeyi GitHub'dan kopyala
echo "📦 Proje VPS'e kopyalanıyor..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /var/www/butcapp

# Git ile projeyi klonla
git clone https://github.com/ButcApp/ButcApp-demo-a.git .

echo "✅ Proje kopyalandı"
EOF

# Kurulum ve başlatma
echo "🔧 Kurulum yapılıyor..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /var/www/butcapp

# Node.js versiyonunu kontrol et
echo "🔍 Node.js versiyonu:"
node --version
<<<<<<< HEAD

# pnpm kur (yoksa)
if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm kuruluyor..."
    npm install -g pnpm
fi

echo "🔍 pnpm versiyonu:"
pnpm --version

# Dependencies kur
echo "📦 Dependencies kuruluyor..."
pnpm install

# Veritabanı kurulumu
echo "🗄️ Veritabanı kuruluyor..."
pnpm db:push

# Build et
echo "🔨 Proje build ediliyor..."
pnpm build
=======
npm --version

# Dependencies kur
echo "📦 Dependencies kuruluyor..."
npm install

# Veritabanı kurulumu
echo "🗄️ Veritabanı kuruluyor..."
npm run db:push

# Build et
echo "🔨 Proje build ediliyor..."
npm run build
>>>>>>> e24e41a09e2ad6015452c7d5548a957a3c4fec4d

# PM2 ile başlat
echo "🚀 Uygulama başlatılıyor..."
pm2 stop butcapp 2>/dev/null || true
<<<<<<< HEAD
pm2 start pnpm --name "butcapp" -- start
=======
pm2 start npm --name "butcapp" -- start
>>>>>>> e24e41a09e2ad6015452c7d5548a957a3c4fec4d
pm2 save

echo "✅ Kurulum tamamlandı"
EOF

echo ""
echo "🎉 ButcApp.com deployment tamamlandı!"
echo "🌐 Uygulamanız: https://butcapp.com"
echo "🔧 Admin panel: https://butcapp.com/0gv6O9Gizwrd1FCb40H22JE8y9aIgK/login"
echo ""
echo "📋 Test bilgileri:"
echo "👤 Kullanıcı: ampulpatlatan"
echo "🔑 Şifre: [şifreniz]"
echo ""
echo "🔧 VPS kontrol komutları:"
echo "ssh root@5.133.102.196"
echo "pm2 status     # Uygulama durumu"
echo "pm2 logs butcapp  # Logları görüntüle"
echo "pm2 restart butcapp  # Yeniden başlat"
echo ""
echo "🌐 Browser test:"
echo "curl -I http://localhost:3000"