<script setup lang="ts">
interface Props {
  title: string
  message: string
  itemName?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="handleCancel">✕</button>
      </div>

      <div class="modal-body">
        <div class="warning-icon">
          <span>⚠️</span>
        </div>

        <p class="message">{{ message }}</p>

        <div v-if="itemName" class="item-name">
          <strong>{{ itemName }}</strong>
        </div>

        <p class="sub-message">This action cannot be undone.</p>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="handleCancel">
          Cancel
        </button>
        <button type="button" class="btn-delete" @click="handleConfirm">
          Delete
        </button>
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
  max-width: 450px;
  width: 100%;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  color: #1f2937;
  margin: 0;
  font-weight: 600;
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

.modal-body {
  padding: 2rem;
  text-align: center;
}

.warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

.message {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.item-name {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.sub-message {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 0 2rem 2rem 2rem;
}

.btn-cancel,
.btn-delete {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-delete {
  background: #dc2626;
  color: white;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
}

.btn-delete:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
}

/* Responsive */
@media (max-width: 576px) {
  .modal-content {
    max-width: 100%;
    margin: 0;
    border-radius: 12px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-delete {
    width: 100%;
  }
}
</style>
