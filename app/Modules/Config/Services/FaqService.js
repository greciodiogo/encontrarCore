'use strict'

const Faq = use('App/Modules/Config/Models/Faq')
const TranslationHelper = use('App/Helpers/TranslationHelper')

class FaqService {
  /**
   * Get all active FAQs grouped by category
   * @param {string} locale - Language locale (pt or en)
   * @returns {Promise<Object>}
   */
  async getAllFaqs(locale = 'pt') {
    const faqs = await Faq.query()
      .where('is_active', true)
      .orderBy('category', 'asc')
      .orderBy('order', 'asc')
      .fetch()

    const faqsArray = faqs.toJSON()

    // Translate FAQs
    const translatedFaqs = faqsArray.map(faq => {
      return {
        id: faq.id,
        question: TranslationHelper.translateField(faq, 'question', locale),
        answer: TranslationHelper.translateField(faq, 'answer', locale),
        category: faq.category,
        order: faq.order
      }
    })

    // Group by category
    const grouped = translatedFaqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = []
      }
      acc[faq.category].push({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        order: faq.order
      })
      return acc
    }, {})

    return grouped
  }

  /**
   * Get FAQs by category
   * @param {string} category - Category name
   * @param {string} locale - Language locale (pt or en)
   * @returns {Promise<Array>}
   */
  async getFaqsByCategory(category, locale = 'pt') {
    const faqs = await Faq.query()
      .where('is_active', true)
      .where('category', category)
      .orderBy('order', 'asc')
      .fetch()

    const faqsArray = faqs.toJSON()

    return faqsArray.map(faq => ({
      id: faq.id,
      question: TranslationHelper.translateField(faq, 'question', locale),
      answer: TranslationHelper.translateField(faq, 'answer', locale),
      category: faq.category,
      order: faq.order
    }))
  }

  /**
   * Create a new FAQ
   * @param {Object} data - FAQ data
   * @returns {Promise<Object>}
   */
  async createFaq(data) {
    const faq = await Faq.create(data)
    return faq.toJSON()
  }

  /**
   * Update an existing FAQ
   * @param {number} id - FAQ ID
   * @param {Object} data - FAQ data
   * @returns {Promise<Object>}
   */
  async updateFaq(id, data) {
    const faq = await Faq.findOrFail(id)
    faq.merge(data)
    await faq.save()
    return faq.toJSON()
  }

  /**
   * Delete a FAQ
   * @param {number} id - FAQ ID
   * @returns {Promise<boolean>}
   */
  async deleteFaq(id) {
    const faq = await Faq.findOrFail(id)
    await faq.delete()
    return true
  }

  /**
   * Get all categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    const faqs = await Faq.query()
      .where('is_active', true)
      .select('category')
      .groupBy('category')
      .fetch()

    return faqs.toJSON().map(f => f.category)
  }
}

module.exports = new FaqService()
