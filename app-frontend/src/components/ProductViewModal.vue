<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Product, Category } from '@/types/api.types'
import { categoryService } from '@/services/category.service'

interface Props {
  product: Product | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Fetch categories from API
const categories = ref<Category[]>([])
const loadingCategories = ref(false)

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await categoryService.getAll({ page: 1, limit: 100 })
    categories.value = response.data
  } catch (err) {
    console.error('Error fetching categories:', err)
  } finally {
    loadingCategories.value = false
  }
}

const formData = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '',
  categoryName: ''
})

// Load product data
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value.name = newProduct.name
    formData.value.description = newProduct.description || ''
    formData.value.price = newProduct.price
    formData.value.stock = newProduct.quantity

    // Get categoryId and name
    if (typeof newProduct.categoryId === 'object' && newProduct.categoryId !== null) {
      formData.value.categoryId = newProduct.categoryId._id
      formData.value.categoryName = newProduct.categoryId.name
    } else {
      formData.value.categoryId = newProduct.categoryId as string
      const category = categories.value.find(c => c._id === newProduct.categoryId)
      formData.value.categoryName = category?.name || ''
    }
  }
}, { immediate: true })

const handleClose = () => {
  emit('close')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
  }).format(price)
}

// Load categories on mount
onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Product Details</h3>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="form">
        <div class="info-badge">
          <span class="info-icon">ℹ️</span>
          <span>View only mode - Fields cannot be edited</span>
        </div>

        <div class="form-group">
          <label for="name" class="form-label">
            Product Name
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="form-input"
            disabled
            readonly
          />
        </div>

        <div class="form-group">
          <label for="description" class="form-label">
            Description
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            class="form-textarea"
            rows="3"
            disabled
            readonly
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price" class="form-label">
              Price
            </label>
            <div class="price-display">
              {{ formatPrice(formData.price) }}
            </div>
          </div>

          <div class="form-group">
            <label for="stock" class="form-label">
              Stock Quantity
            </label>
            <div class="stock-display">
              <span class="stock-badge" :class="{ low: formData.stock < 15 }">
                {{ formData.stock }} units
              </span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="category" class="form-label">
            Category
          </label>
          <input
            id="category"
            v-model="formData.categoryName"
            type="text"
            class="form-input"
            disabled
            readonly
          />
        </div>

        <div class="form-actions">
          <button type="button" class="btn-primary" @click="handleClose">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.modal-header h3 {
  font-size: 1.5rem;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.form {
  padding: 2rem;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.info-icon {
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.price-display,
.stock-display {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  font-size: 1rem;
  color: #374151;
  font-weight: 600;
}

.price-display {
  color: #059669;
}

.stock-badge {
  background: #d1fae5;
  color: #059669;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
}

.stock-badge.low {
  background: #fee2e2;
  color: #dc2626;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary {
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 576px) {
  .modal-content {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-header {
    border-radius: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary {
    width: 100%;
  }
}
</style>
