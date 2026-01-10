<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { productService } from '@/services/product.service'
import { categoryService } from '@/services/category.service'
import type { Product, Category as ApiCategory } from '@/types/api.types'

const products = ref<Product[]>([])
const categories = ref<ApiCategory[]>([])
const loading = ref(false)

// Store total counts from pagination
const totalProducts = ref(0)
const totalCategories = ref(0)

// Computed stats from real data
const stats = computed(() => [
  {
    label: 'Total Products',
    value: totalProducts.value,
    icon: '📦',
    color: '#6366f1',
    trend: totalProducts.value > 10 ? '--' : '--',
    route: '/products'
  },
  {
    label: 'Categories',
    value: totalCategories.value,
    icon: '🏷️',
    color: '#8b5cf6',
    trend: totalCategories.value > 5 ? '--' : '--',
    route: '/categories'
  },
  {
    label: 'Inventory Value',
    value: formatPrice(products.value.reduce((sum, p) => sum + p.price * p.quantity, 0)),
    icon: '💰',
    color: '#10b981',
    trend: '+8%',
    route: '/products'
  },
  {
    label: 'Stock Remaining',
    value: products.value.reduce((sum, p) => sum + p.quantity, 0).toLocaleString('en-US'),
    icon: '📊',
    color: '#f59e0b',
    trend: '-2%',
    route: '/products'
  },
])

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const quickActions = ref([
  {
    title: 'Manage Products',
    description: 'Add, edit, delete products',
    icon: '📋',
    route: '/products',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: 'Manage Categories',
    description: 'Organize product categories',
    icon: '📁',
    route: '/categories',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: 'Sales Reports',
    description: 'View statistics and reports',
    icon: '📊',
    route: '/reports',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: 'System Settings',
    description: 'Customize functionality',
    icon: '⚙️',
    route: '/settings',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
])

// Get recent products (latest 5)
const recentProducts = computed(() => {
  return [...products.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

// Get category name from product
const getCategoryName = (product: Product): string => {
  if (typeof product.categoryId === 'object' && product.categoryId !== null) {
    return (product.categoryId as ApiCategory).name
  }
  const category = categories.value.find(c => c._id === product.categoryId)
  return category?.name || 'Unspecified'
}

// Fetch data from API with pagination
const fetchData = async () => {
  loading.value = true
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      productService.getAll({ page: 1, limit: 10 }),
      categoryService.getAll({ page: 1, limit: 100 })
    ])
    products.value = productsRes.data
    categories.value = categoriesRes.data
    totalProducts.value = productsRes.pagination.totalCount
    totalCategories.value = categoriesRes.pagination.totalCount
  } catch (err) {
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const getTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <AppLayout>
    <div class="home-page">
      <!-- Hero Section with Gradient Background -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">{{ getTimeOfDay() }}! 👋</h1>
            <p class="hero-subtitle">Welcome to Shop Management System</p>
          </div>
          <div class="hero-date">
            <span class="date-icon">📅</span>
            <span class="date-text">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading data...</p>
      </div>

      <template v-else>
        <!-- Stats Cards with Glassmorphism -->
        <section class="stats-section">
          <RouterLink
            v-for="stat in stats"
            :key="stat.label"
            :to="stat.route"
            class="stat-card-link"
          >
            <div class="stat-card" :style="{ '--accent-color': stat.color }">
              <div class="stat-header">
                <div class="stat-icon-wrapper">
                  <span class="stat-icon">{{ stat.icon }}</span>
                </div>
                <span class="stat-trend" :class="{ positive: stat.trend.startsWith('+'), negative: stat.trend.startsWith('-') }">
                  {{ stat.trend }}
                </span>
              </div>
              <div class="stat-body">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
              <div class="stat-bar"></div>
            </div>
          </RouterLink>
        </section>

        <!-- Quick Actions with Gradient Cards -->
        <!-- <section class="quick-actions-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">⚡</span>
              Quick Actions
            </h2>
            <p class="section-subtitle">Quickly access main features</p>
          </div>
          <div class="actions-grid">
            <RouterLink
              v-for="action in quickActions"
              :key="action.title"
              :to="action.route"
              class="action-card"
              :style="{ '--card-gradient': action.gradient }"
            >
              <div class="action-icon-wrapper">
                <span class="action-icon">{{ action.icon }}</span>
              </div>
              <div class="action-content">
                <h3 class="action-title">{{ action.title }}</h3>
                <p class="action-description">{{ action.description }}</p>
              </div>
              <div class="action-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </RouterLink>
          </div>
        </section> -->

        <!-- Recent Products with Modern Table -->
        <section class="recent-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">🆕</span>
              Recent Products
            </h2>
            <RouterLink to="/products" class="view-all-link">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </RouterLink>
          </div>

          <div v-if="recentProducts.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <p class="empty-text">No products in the system yet</p>
            <RouterLink to="/products" class="btn-add-product">Add First Product</RouterLink>
          </div>

          <div v-else class="table-wrapper">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in recentProducts" :key="product._id">
                  <td>
                    <span class="product-id">#{{ product._id.slice(-6) }}</span>
                  </td>
                  <td>
                    <div class="product-info">
                      <span class="product-name">{{ product.name }}</span>
                      <span class="product-desc">{{ product.description?.slice(0, 50) || '-' }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="category-tag">{{ getCategoryName(product) }}</span>
                  </td>
                  <td>
                    <span class="product-price">{{ formatPrice(product.price) }}</span>
                  </td>
                  <td>
                    <span class="stock-badge" :class="{ low: product.quantity < 15, medium: product.quantity >= 15 && product.quantity < 50, high: product.quantity >= 50 }">
                      <span class="stock-dot"></span>
                      {{ product.quantity }} units
                    </span>
                  </td>
                  <td>
                    <span class="date-text">{{ new Date(product.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.home-page {
  width: 100%;
}

/* Hero Section with Gradient */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.hero-date {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.date-icon {
  font-size: 1.5rem;
}

.date-text {
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  border: 5px solid #f3f4f6;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Stats Section with Glassmorphism */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card-link {
  text-decoration: none;
}

.stat-card {
  background: white;
  border-radius: 18px;
  padding: 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.stat-icon-wrapper {
  background: linear-gradient(135deg, var(--accent-color), var(--accent-color));
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 1.75rem;
  filter: brightness(1.2);
}

.stat-trend {
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  background: #f3f4f6;
  color: #6b7280;
}

.stat-trend.positive {
  background: #d1fae5;
  color: #059669;
}

.stat-trend.negative {
  background: #fee2e2;
  color: #dc2626;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.95rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), transparent);
  opacity: 0.5;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.title-icon {
  font-size: 1.75rem;
}

.section-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.view-all-link:hover {
  gap: 0.75rem;
  color: #764ba2;
}

/* Quick Actions with Gradient Cards */
.quick-actions-section {
  margin-bottom: 2.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.action-card {
  background: white;
  border-radius: 18px;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--card-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-card:hover::before {
  opacity: 1;
}

.action-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.action-card:hover .action-icon-wrapper {
  background: white;
}

.action-card:hover .action-title,
.action-card:hover .action-description,
.action-card:hover .action-arrow {
  color: white;
}

.action-icon-wrapper {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.action-icon {
  font-size: 1.75rem;
}

.action-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.action-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  transition: color 0.3s ease;
}

.action-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  transition: color 0.3s ease;
}

.action-arrow {
  color: #9ca3af;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

/* Modern Table */
.recent-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.modern-table thead {
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
}

.modern-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
}

.modern-table td {
  padding: 1.25rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
}

.modern-table tbody tr {
  transition: all 0.2s ease;
}

.modern-table tbody tr:hover {
  background: #f9fafb;
}

.modern-table tbody tr:last-child td {
  border-bottom: none;
}

.product-id {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 600;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.product-desc {
  font-size: 0.8rem;
  color: #9ca3af;
}

.category-tag {
  display: inline-block;
  padding: 0.4rem 0.85rem;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  color: #4338ca;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.product-price {
  font-weight: 700;
  color: #059669;
  font-size: 1rem;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
}

.stock-badge.low {
  background: #fee2e2;
  color: #dc2626;
}

.stock-badge.medium {
  background: #fef3c7;
  color: #d97706;
}

.stock-badge.high {
  background: #d1fae5;
  color: #059669;
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.btn-add-product {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-add-product:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2rem;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .table-wrapper {
    border-radius: 0;
  }

  .modern-table {
    font-size: 0.85rem;
  }

  .modern-table th,
  .modern-table td {
    padding: 0.75rem 0.875rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
