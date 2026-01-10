/**
 * Product Service - API calls for product management
 */

import { api, type PaginatedResponse } from './api'
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  PaginationQuery,
  DeleteQuery,
} from '@/types/api.types'

export const productService = {
  /**
   * Get all products with optional pagination and search
   * @param query - Pagination and search parameters
   * @returns Paginated list of products
   */
  async getAll(query?: PaginationQuery): Promise<PaginatedResponse<Product>> {
    const params: Record<string, string | number> = {}
    if (query?.page) params.page = query.page
    if (query?.limit) params.limit = query.limit
    if (query?.search) params.search = query.search

    return api.get<PaginatedResponse<Product>>('/products', params)
  },

  /**
   * Get a single product by ID
   * @param id - Product ID
   * @returns Product object with populated category
   */
  async getById(id: string): Promise<Product> {
    return api.get<Product>(`/product/${id}`)
  },

  /**
   * Create a new product
   * @param data - Product data
   * @returns Created product
   */
  async create(data: CreateProductDto): Promise<Product> {
    return api.post<Product>('/product', data)
  },

  /**
   * Update an existing product
   * @param id - Product ID
   * @param data - Updated product data
   * @returns Updated product
   */
  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return api.put<Product>(`/product/${id}`, data)
  },

  /**
   * Delete a product (soft or hard delete)
   * @param id - Product ID
   * @param query - Delete options (hard delete flag)
   * @returns Success message
   */
  async delete(id: string, query?: DeleteQuery): Promise<{ message: string }> {
    const params: Record<string, string | boolean> = {}
    if (query?.hard !== undefined) params.hard = query.hard

    return api.delete<{ message: string }>(`/product/${id}`, params)
  },
}
