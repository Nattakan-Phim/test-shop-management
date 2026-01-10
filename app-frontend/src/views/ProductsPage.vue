<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import ProductForm from '@/components/ProductForm.vue'
import ProductViewModal from '@/components/ProductViewModal.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { productService } from '@/services/product.service'
import type { Product, Category } from '@/types/api.types'

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const showForm = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref<Product | null>(null)
const viewingProduct = ref<Product | null>(null)
const deletingProduct = ref<Product | null>(null)

// Pagination state
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)
const totalCount = ref(0)

// Helper to get category name from product
const getCategoryName = (product: Product): string => {
  if (typeof product.categoryId === 'object' && product.categoryId !== null) {
    return (product.categoryId as Category).name
  }
  return ''
}

// Helper to get category ID string
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCategoryId = (product: Product): string => {
  if (typeof product.categoryId === 'object' && product.categoryId !== null) {
    return (product.categoryId as Category)._id
  }
  return product.categoryId as string
}

// Fetch products from API
const fetchProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await productService.getAll({
      page: currentPage.value,
      limit: pageSize.value
    })
    products.value = response.data
    totalPages.value = response.pagination.totalPage
    totalCount.value = response.pagination.totalCount
  } catch (err) {
    error.value = 'Failed to load product data'
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchProducts()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchProducts()
  }
}

const openAddForm = () => {
  editingProduct.value = null
  showForm.value = true
}

const openEditForm = (product: Product) => {
  editingProduct.value = { ...product }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingProduct.value = null
}

const saveProduct = async (productData: { name: string; description: string; price: number; stock: number; categoryId: string; categoryName: string }) => {
  loading.value = true
  error.value = null
  try {
    const apiData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      quantity: productData.stock, // Convert stock to quantity for API
      categoryId: productData.categoryId
    }

    if (editingProduct.value) {
      // Update existing product
      await productService.update(editingProduct.value._id, apiData)
    } else {
      // Create new product
      await productService.create(apiData)
    }
    await fetchProducts()
    closeForm()
  } catch (err) {
    error.value = 'Failed to save data'
    console.error('Error saving product:', err)
  } finally {
    loading.value = false
  }
}

const openDeleteModal = (product: Product) => {
  deletingProduct.value = { ...product }
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingProduct.value = null
}

const confirmDelete = async () => {
  if (!deletingProduct.value) return

  loading.value = true
  error.value = null
  try {
    await productService.delete(deletingProduct.value._id)
    await fetchProducts()
    closeDeleteModal()
  } catch (err) {
    error.value = 'Failed to delete data'
    console.error('Error deleting product:', err)
  } finally {
    loading.value = false
  }
}

const viewProduct = (product: Product) => {
  viewingProduct.value = { ...product }
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingProduct.value = null
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
  }).format(price)
}

// Load products on mount
onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <AppLayout>
    <div class="products-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">
            <span class="title-icon">📦</span>
            Manage Products
          </h2>
          <p class="page-subtitle">Add, edit, and manage products in the system</p>
        </div>
        <button class="btn-primary" @click="openAddForm">
          <span>➕</span>
          Add New Product
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-box">
          <span class="stat-icon">📊</span>
          <div>
            <div class="stat-value">{{ totalCount }}</div>
            <div class="stat-label">Total Products</div>
          </div>
        </div>
        <div class="stat-box">
          <span class="stat-icon">📈</span>
          <div>
            <div class="stat-value">{{ products.reduce((sum, p) => sum + p.quantity, 0) }}</div>
            <div class="stat-label">Stock on This Page</div>
          </div>
        </div>
        <div class="stat-box">
          <span class="stat-icon">💰</span>
          <div>
            <div class="stat-value">{{ formatPrice(products.reduce((sum, p) => sum + p.price * p.quantity, 0)) }}</div>
            <div class="stat-label">Value on This Page</div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-banner">
        ⚠️ {{ error }}
        <button @click="fetchProducts" class="retry-btn">Try Again</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading data...</p>
      </div>

      <!-- Table -->
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product._id">
              <td class="id-cell">#{{ product._id.slice(-6) }}</td>
              <td class="name-cell">{{ product.name }}</td>
              <td>
                <span class="category-badge">{{ getCategoryName(product) }}</span>
              </td>
              <td class="price-cell">{{ formatPrice(product.price) }}</td>
              <td>
                <span class="stock-badge" :class="{ low: product.quantity < 15 }">
                  {{ product.quantity }} units
                </span>
              </td>
              <td class="description-cell">{{ product.description || '-' }}</td>
              <td class="actions-cell">
                <button class="btn-action view" @click="viewProduct(product)" title="View Details">
                  👁️
                </button>
                <button class="btn-action edit" @click="openEditForm(product)" title="Edit">
                  ✏️
                </button>
                <button class="btn-action delete" @click="openDeleteModal(product)" title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="products.length === 0" class="empty-state">
          <span class="empty-icon">📭</span>
          <p>No products yet</p>
          <button class="btn-primary" @click="openAddForm">Add First Product</button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            ← Previous
          </button>

          <div class="pagination-numbers">
            <button
              v-for="page in totalPages"
              :key="page"
              class="pagination-number"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            Next →
          </button>
        </div>
      </div>

      <!-- Form Modal -->
      <ProductForm
        v-if="showForm"
        :product="editingProduct"
        @save="saveProduct"
        @cancel="closeForm"
      />

      <!-- View Modal -->
      <ProductViewModal
        v-if="showViewModal"
        :product="viewingProduct"
        @close="closeViewModal"
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmDeleteModal
        v-if="showDeleteModal"
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        :item-name="deletingProduct?.name"
        @confirm="confirmDelete"
        @cancel="closeDeleteModal"
      />
    </div>
  </AppLayout>
</template>

<style scoped>
.products-page {
  width: 100%;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.75rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.title-icon {
  font-size: 1.75rem;
}

.page-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Buttons */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 12px;
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

/* Table */
.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: #f9fafb;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table tbody tr {
  transition: background 0.2s ease;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.id-cell {
  color: #6b7280;
  font-family: monospace;
  font-weight: 600;
}

.name-cell {
  font-weight: 600;
  color: #1f2937;
}

.price-cell {
  color: #059669;
  font-weight: 600;
}

.description-cell {
  color: #6b7280;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.btn-action {
  background: #f3f4f6;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-action:hover {
  transform: scale(1.1);
}

.btn-action.view:hover {
  background: #dbeafe;
}

.btn-action.edit:hover {
  background: #fef3c7;
}

.btn-action.delete:hover {
  background: #fee2e2;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

/* Error Banner */
.error-banner {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(220, 38, 38, 0.1);
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #b91c1c;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #6b7280;
  font-size: 1rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  background: white;
  border: 2px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  background: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
  background: white;
  border: 2px solid #e5e7eb;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s ease;
}

.pagination-number:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f3f4f6;
}

.pagination-number.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .table-container {
    overflow-x: auto;
  }

  .data-table {
    min-width: 800px;
  }

  .error-banner {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination {
    flex-direction: column;
  }

  .pagination-numbers {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
