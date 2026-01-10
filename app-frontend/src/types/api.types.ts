/**
 * API Types - Data structures matching the backend API
 */

// Category Types
export interface Category {
  _id: string
  name: string
  description?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  description?: string
}

export interface UpdateCategoryDto {
  name?: string
  description?: string
}

// Product Types
export interface Product {
  _id: string
  name: string
  description?: string
  price: number
  quantity: number
  categoryId: string | Category // Can be populated or just ID
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductDto {
  name: string
  description?: string
  price: number
  quantity: number
  categoryId: string
}

export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  quantity?: number
  categoryId?: string
}

// Query Parameters
export interface PaginationQuery {
  page?: number
  limit?: number
  search?: string
}

export interface DeleteQuery {
  hard?: boolean
}

// Response Types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPage: number
    totalCount: number
  }
}
