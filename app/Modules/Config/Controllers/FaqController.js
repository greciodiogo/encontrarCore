'use strict'

const FaqService = use('App/Modules/Config/Services/FaqService')

class FaqController {
  /**
   * Get all FAQs grouped by category
   * GET /api/faqs
   */
  async index({ request, response }) {
    try {
      const locale = request.locale || 'pt'
      const faqs = await FaqService.getAllFaqs(locale)

      return response.status(200).json({
        success: true,
        data: faqs
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error fetching FAQs',
        error: error.message
      })
    }
  }

  /**
   * Get FAQs by category
   * GET /api/faqs/:category
   */
  async getByCategory({ params, request, response }) {
    try {
      const { category } = params
      const locale = request.locale || 'pt'
      const faqs = await FaqService.getFaqsByCategory(category, locale)

      return response.status(200).json({
        success: true,
        data: faqs
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error fetching FAQs',
        error: error.message
      })
    }
  }

  /**
   * Get all categories
   * GET /api/faqs/categories/list
   */
  async getCategories({ response }) {
    try {
      const categories = await FaqService.getCategories()

      return response.status(200).json({
        success: true,
        data: categories
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error fetching categories',
        error: error.message
      })
    }
  }

  /**
   * Create a new FAQ (Admin only)
   * POST /api/faqs
   */
  async store({ request, response }) {
    try {
      const data = request.only([
        'question',
        'answer',
        'question_en',
        'answer_en',
        'category',
        'order',
        'is_active'
      ])

      const faq = await FaqService.createFaq(data)

      return response.status(201).json({
        success: true,
        data: faq,
        message: 'FAQ created successfully'
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error creating FAQ',
        error: error.message
      })
    }
  }

  /**
   * Update an existing FAQ (Admin only)
   * PUT /api/faqs/:id
   */
  async update({ params, request, response }) {
    try {
      const { id } = params
      const data = request.only([
        'question',
        'answer',
        'question_en',
        'answer_en',
        'category',
        'order',
        'is_active'
      ])

      const faq = await FaqService.updateFaq(id, data)

      return response.status(200).json({
        success: true,
        data: faq,
        message: 'FAQ updated successfully'
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error updating FAQ',
        error: error.message
      })
    }
  }

  /**
   * Delete a FAQ (Admin only)
   * DELETE /api/faqs/:id
   */
  async destroy({ params, response }) {
    try {
      const { id } = params
      await FaqService.deleteFaq(id)

      return response.status(200).json({
        success: true,
        message: 'FAQ deleted successfully'
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error deleting FAQ',
        error: error.message
      })
    }
  }
}

module.exports = FaqController
