<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { label: 'สินค้าทั้งหมด', value: 1250, icon: '📦', color: '#6366f1' },
  { label: 'หมวดหมู่', value: 24, icon: '🏷️', color: '#8b5cf6' },
  { label: 'ยอดขายวันนี้', value: '฿15,890', icon: '💰', color: '#10b981' },
  { label: 'ออเดอร์ใหม่', value: 48, icon: '🛒', color: '#f59e0b' },
])

const quickActions = ref([
  { title: 'จัดการสินค้า', description: 'เพิ่ม แก้ไข ลบสินค้า', icon: '📋', route: '/products' },
  { title: 'จัดการหมวดหมู่', description: 'จัดระเบียบหมวดหมู่สินค้า', icon: '📁', route: '/categories' },
  { title: 'รายงานยอดขาย', description: 'ดูสถิติและรายงาน', icon: '📊', route: '/reports' },
  { title: 'ตั้งค่าระบบ', description: 'ปรับแต่งการทำงาน', icon: '⚙️', route: '/settings' },
])

const recentProducts = ref([
  { id: 1, name: 'iPhone 15 Pro Max', category: 'สมาร์ทโฟน', price: 48900, stock: 25 },
  { id: 2, name: 'MacBook Pro 14"', category: 'แล็ปท็อป', price: 69900, stock: 12 },
  { id: 3, name: 'AirPods Pro 2', category: 'หูฟัง', price: 8990, stock: 50 },
  { id: 4, name: 'iPad Air', category: 'แท็บเล็ต', price: 24900, stock: 18 },
  { id: 5, name: 'Apple Watch Ultra', category: 'สมาร์ทวอทช์', price: 31900, stock: 8 },
])

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(price)
}
</script>

<template>
  <div class="home-page">
    <!-- Header Section -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🏪</span>
          <h1>Shop Management</h1>
        </div>
        <nav class="nav-menu">
          <a href="#" class="nav-link active">หน้าแรก</a>
          <a href="#" class="nav-link">สินค้า</a>
          <a href="#" class="nav-link">หมวดหมู่</a>
          <a href="#" class="nav-link">รายงาน</a>
        </nav>
        <div class="user-menu">
          <span class="user-avatar">👤</span>
          <span class="user-name">Admin</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-text">
          <h2>ยินดีต้อนรับกลับมา! 👋</h2>
          <p>นี่คือภาพรวมของร้านค้าของคุณในวันนี้</p>
        </div>
        <div class="date-display">
          <span class="date-icon">📅</span>
          <span>{{ new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="stats-section">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stat-card"
          :style="{ '--accent-color': stat.color }"
        >
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-info">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions-section">
        <h3 class="section-title">
          <span class="title-icon">⚡</span>
          การดำเนินการด่วน
        </h3>
        <div class="actions-grid">
          <div
            v-for="action in quickActions"
            :key="action.title"
            class="action-card"
          >
            <div class="action-icon">{{ action.icon }}</div>
            <div class="action-content">
              <h4>{{ action.title }}</h4>
              <p>{{ action.description }}</p>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </div>
      </section>

      <!-- Recent Products -->
      <section class="recent-section">
        <h3 class="section-title">
          <span class="title-icon">🆕</span>
          สินค้าล่าสุด
        </h3>
        <div class="products-table-wrapper">
          <table class="products-table">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่</th>
                <th>ราคา</th>
                <th>คงเหลือ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in recentProducts" :key="product.id">
                <td class="product-id">#{{ product.id }}</td>
                <td class="product-name">{{ product.name }}</td>
                <td>
                  <span class="category-badge">{{ product.category }}</span>
                </td>
                <td class="product-price">{{ formatPrice(product.price) }}</td>
                <td>
                  <span
                    class="stock-badge"
                    :class="{ low: product.stock < 15 }"
                  >
                    {{ product.stock }} ชิ้น
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon" title="ดู">👁️</button>
                  <button class="btn-icon" title="แก้ไข">✏️</button>
                  <button class="btn-icon delete" title="ลบ">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2026 Shop Management System. Made with ❤️ using Vue.js</p>
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Styles */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
}

.logo h1 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.nav-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  color: white;
}

.user-avatar {
  font-size: 1.25rem;
}

.user-name {
  font-weight: 500;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.welcome-text h2 {
  font-size: 1.75rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.welcome-text p {
  color: #6b7280;
  font-size: 1rem;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
}

.date-icon {
  font-size: 1.25rem;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid var(--accent-color);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 1rem;
  border-radius: 12px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Section Title */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 1.25rem;
}

.title-icon {
  font-size: 1.5rem;
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.action-card {
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.action-card:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateX(5px);
}

.action-card:hover .action-content h4,
.action-card:hover .action-content p,
.action-card:hover .action-arrow {
  color: white;
}

.action-icon {
  font-size: 2rem;
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 10px;
}

.action-content {
  flex: 1;
}

.action-content h4 {
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.action-content p {
  font-size: 0.85rem;
  color: #6b7280;
  transition: color 0.3s ease;
}

.action-arrow {
  font-size: 1.25rem;
  color: #9ca3af;
  transition: color 0.3s ease;
}

/* Recent Products Table */
.recent-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.products-table-wrapper {
  overflow-x: auto;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.products-table th {
  background: #f9fafb;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.products-table tbody tr {
  transition: background 0.2s ease;
}

.products-table tbody tr:hover {
  background: #f9fafb;
}

.product-id {
  color: #6b7280;
  font-family: monospace;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
}

.product-price {
  color: #059669;
  font-weight: 600;
}

.category-badge {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #4338ca;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.stock-badge {
  background: #d1fae5;
  color: #059669;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.stock-badge.low {
  background: #fee2e2;
  color: #dc2626;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: #f3f4f6;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-icon:hover {
  background: #e5e7eb;
  transform: scale(1.1);
}

.btn-icon.delete:hover {
  background: #fee2e2;
}

/* Footer */
.footer {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }

  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .main-content {
    padding: 1rem;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style>
