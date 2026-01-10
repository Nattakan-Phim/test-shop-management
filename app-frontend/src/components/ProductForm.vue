<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Product, Category } from '@/types/api.types'
import { categoryService } from '@/services/category.service'

interface Props {
  product?: Product | null
}

interface SaveProductData {
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  categoryName: string
}

interface Emits {
  (e: 'save', data: SaveProductData): void
  (e: 'cancel'): void
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
  categoryId: ''
})

const errors = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: ''
})

// Load product data if editing
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value.name = newProduct.name
    formData.value.description = newProduct.description || ''
    formData.value.price = newProduct.price
    formData.value.stock = newProduct.quantity
    // Get categoryId as string
    if (typeof newProduct.categoryId === 'object' && newProduct.categoryId !== null) {
      formData.value.categoryId = newProduct.categoryId._id
    } else {
      formData.value.categoryId = newProduct.categoryId as string
    }
  } else {
    formData.value.name = ''
    formData.value.description = ''
    formData.value.price = 0
    formData.value.stock = 0
    formData.value.categoryId = ''
  }
}, { immediate: true })

const validateForm = () => {
  let isValid = true
  errors.value = { name: '', description: '', price: '', stock: '', categoryId: '' }

  if (!formData.value.name.trim()) {
    errors.value.name = 'Please enter product name'
    isValid = false
  }

  if (!formData.value.description.trim()) {
    errors.value.description = 'Please enter description'
    isValid = false
  }

  if (formData.value.price <= 0) {
    errors.value.price = 'Please enter a price greater than 0'
    isValid = false
  }

  if (!formData.value.categoryId || formData.value.categoryId === '') {
    errors.value.categoryId = 'Please select a category'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    const selectedCategory = categories.value.find(c => c._id === formData.value.categoryId)
    if (selectedCategory) {
      emit('save', {
        name: formData.value.name.trim(),
        description: formData.value.description.trim(),
        price: formData.value.price,
        stock: formData.value.stock,
        categoryId: formData.value.categoryId,
        categoryName: selectedCategory.name
      })
    }
  }
}

const handleCancel = () => {
  emit('cancel')
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
        <h3>{{ product ? 'Edit Product' : 'Add New Product' }}</h3>
        <button class="close-btn" @click="handleCancel">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="name" class="form-label">
            Product Name <span class="required">*</span>
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="form-input"
            :class="{ error: errors.name }"
            placeholder="Enter product name"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="description" class="form-label">
            Description <span class="required">*</span>
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            class="form-textarea"
            :class="{ error: errors.description }"
            placeholder="Enter product description"
            rows="3"
          ></textarea>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price" class="form-label">
              Price (Baht) <span class="required">*</span>
            </label>
            <input
              id="price"
              v-model.number="formData.price"
              type="number"
              min="0"
              step="0.01"
              class="form-input"
              :class="{ error: errors.price }"
              placeholder="0.00"
            />
            <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
          </div>

          <div class="form-group">
            <label for="stock" class="form-label">
              Stock Quantity <span class="optional">(optional)</span>
            </label>
            <input
              id="stock"
              v-model.number="formData.stock"
              type="number"
              min="0"
              class="form-input"
              :class="{ error: errors.stock }"
              placeholder="0"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="category" class="form-label">
            Category <span class="required">*</span>
          </label>
          <select
            id="category"
            v-model="formData.categoryId"
            class="form-select"
            :class="{ error: errors.categoryId }"
            :disabled="loadingCategories"
          >
            <option value="" disabled>{{ loadingCategories ? 'Loading categories...' : 'Select Category' }}</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
          <span v-if="errors.categoryId" class="error-message">{{ errors.categoryId }}</span>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="handleCancel">
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            {{ product ? 'Save Changes' : 'Add Product' }}
          </button>
        </div>
      </form>
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
}

.modal-header h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
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
  background: #f3f4f6;
  color: #1f2937;
}

.form {
  padding: 2rem;
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

.required {
  color: #ef4444;
}
.optional {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 400;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error,
.form-textarea.error,
.form-select.error {
  border-color: #ef4444;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select {
  cursor: pointer;
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Responsive */
@media (max-width: 576px) {
  .modal-content {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
