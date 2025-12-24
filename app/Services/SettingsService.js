'use strict'

const SettingRepository = use('App/Modules/Utilitarios/Repositories/SettingRepository')

class SettingsService {
  constructor() {
    this.settingRepository = new SettingRepository()
  }

  /**
   * Get setting value by name
   * @param {string} name - Setting name
   * @returns {Promise<string|null>} Setting value or null if not found
   */
  async getSettingValueByName(name) {
    const setting = await this.settingRepository.model
      .query()
      .where('name', name)
      .first()

    return setting ? setting.value : null
  }
}

module.exports = SettingsService

