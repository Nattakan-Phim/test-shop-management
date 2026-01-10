<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Category } from '@/types/api.types'

interface Props {
  category: Category | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref({
  name: '',
  description: '',
  createdAt: ''
})

// Load category data
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    formData.value.name = newCategory.name
    formData.value.description = newCategory.description || ''
    formData.value.createdAt = new Date(newCategory.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}, { immediate: true })

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Category Details</h3>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="form">
        <div class="info-badge">
          <span class="info-icon">ℹ️</span>
          <span>View only mode - Fields cannot be edited</span>
        </div>

        <div class="form-group">
          <label for="id" class="form-label">
            Category ID
          </label>
          <div class="id-display">
            <span class="id-badge">#{{ category?._id.slice(-8) }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="name" class="form-label">
            Category Name
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
            rows="4"
            disabled
            readonly
          ></textarea>
        </div>

        <div class="form-group">
          <label for="createdAt" class="form-label">
            Created Date
          </label>
          <div class="date-display">
            <span class="date-icon">📅</span>
            <span>{{ formData.createdAt }}</span>
          </div>
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  min-height: 100px;
}

.id-display,
.date-display {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  font-size: 1rem;
  color: #374151;
  font-weight: 600;
}

.id-badge {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #4338ca;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: monospace;
  display: inline-block;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

.date-icon {
  font-size: 1.2rem;
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
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

  .form-actions {
    flex-direction: column;
  }

  .btn-primary {
    width: 100%;
  }
}
</style>
