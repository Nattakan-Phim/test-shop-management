/**
 * Category Service - API calls for category management
 */

import { api, type PaginatedResponse } from './api'
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  PaginationQuery,
  DeleteQuery,
} from '@/types/api.types'

export const categoryService = {
  /**
   * Get all categories with optional pagination and search
   * @param query - Pagination and search parameters
   * @returns Paginated list of categories
   */
  async getAll(query?: PaginationQuery): Promise<PaginatedResponse<Category>> {
    const params: Record<string, string | number> = {}
    if (query?.page) params.page = query.page
    if (query?.limit) params.limit = query.limit
    if (query?.search) params.search = query.search

    return api.get<PaginatedResponse<Category>>('/categories', params)
  },

  /**
   * Get a single category by ID
   * @param id - Category ID
   * @returns Category object
   */
  async getById(id: string): Promise<Category> {
    return api.get<Category>(`/category/${id}`)
  },

  /**
   * Create a new category
   * @param data - Category data
   * @returns Created category
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    return api.post<Category>('/category', data)
  },

  /**
   * Update an existing category
   * @param id - Category ID
   * @param data - Updated category data
   * @returns Updated category
   */
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return api.put<Category>(`/category/${id}`, data)
  },

  /**
   * Delete a category (soft or hard delete)
   * @param id - Category ID
   * @param query - Delete options (hard delete flag)
   * @returns Success message
   */
  async delete(id: string, query?: DeleteQuery): Promise<{ message: string }> {
    const params: Record<string, string | boolean> = {}
    if (query?.hard !== undefined) params.hard = query.hard

    return api.delete<{ message: string }>(`/category/${id}`, params)
  },
}
