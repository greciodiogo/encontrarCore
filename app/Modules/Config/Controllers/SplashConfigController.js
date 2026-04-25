'use strict';

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class SplashConfigController {
  /**
   * Retorna configuração da animação de splash
   * GET /api/config/splash-animation
   */
  async getSplashAnimation({ response }) {
    try {
      // Configuração pode vir de:
      // 1. Banco de dados (para controle via dashboard)
      // 2. Arquivo de configuração
      // 3. Variáveis de ambiente

      // Por enquanto, configuração estática
      // TODO: Mover para banco de dados quando tiver dashboard
      
      const config = {
        version: '1.0.0',
        url: 'https://api.encontrarshopping.com/static/animations/splash_v1.0.0.json',
        checksum: await this._calculateChecksum(),
        enabled: true,
        // Metadados opcionais
        metadata: {
          fileSize: 475000, // bytes
          duration: 3000, // ms
          lastUpdated: new Date().toISOString(),
        },
        // Opcional: diferentes animações por plataforma
        platforms: {
          android: {
            url: 'https://api.encontrarshopping.com/static/animations/splash_android_v1.0.0.json',
            minVersion: '1.0.0', // Versão mínima do app que suporta
          },
          ios: {
            url: 'https://api.encontrarshopping.com/static/animations/splash_ios_v1.0.0.json',
            minVersion: '1.0.0',
          }
        }
      };

      return response.json(config);
    } catch (error) {
      console.error('[SPLASH CONFIG] Erro ao carregar configuração:', error);
      
      return response.status(500).json({
        error: 'Failed to load splash configuration',
        message: error.message,
      });
    }
  }

  /**
   * Serve o arquivo JSON da animação
   * GET /static/animations/:filename
   */
  async serveAnimation({ params, response }) {
    try {
      const { filename } = params;
      
      // Validação de segurança: apenas arquivos .json
      if (!filename.endsWith('.json')) {
        return response.status(400).json({
          error: 'Invalid file type',
        });
      }

      // Caminho do arquivo
      // TODO: Ajustar caminho conforme estrutura do projeto
      const filePath = path.join(
        __dirname,
        '../../../public/animations',
        filename
      );

      // Verifica se arquivo existe
      try {
        await fs.access(filePath);
      } catch {
        return response.status(404).json({
          error: 'Animation file not found',
        });
      }

      // Lê e retorna o arquivo
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      return response
        .header('Content-Type', 'application/json')
        .header('Cache-Control', 'public, max-age=86400') // Cache de 24h
        .send(fileContent);
        
    } catch (error) {
      console.error('[SPLASH CONFIG] Erro ao servir animação:', error);
      
      return response.status(500).json({
        error: 'Failed to serve animation',
        message: error.message,
      });
    }
  }

  /**
   * Calcula checksum MD5 do arquivo de animação
   * @private
   */
  async _calculateChecksum() {
    try {
      // TODO: Ajustar caminho conforme estrutura do projeto
      const filePath = path.join(
        __dirname,
        '../../../public/animations/splash_v1.0.0.json'
      );

      const fileContent = await fs.readFile(filePath, 'utf-8');
      const hash = crypto.createHash('md5').update(fileContent).digest('hex');
      
      return hash;
    } catch (error) {
      console.error('[SPLASH CONFIG] Erro ao calcular checksum:', error);
      return null;
    }
  }

  /**
   * Upload de nova animação (para dashboard futuro)
   * POST /api/config/splash-animation/upload
   */
  async uploadAnimation({ request, response }) {
    try {
      // TODO: Implementar quando tiver dashboard
      // 1. Validar arquivo JSON
      // 2. Validar estrutura Lottie
      // 3. Salvar arquivo
      // 4. Atualizar configuração no banco
      // 5. Gerar novo checksum
      
      return response.status(501).json({
        message: 'Upload endpoint not implemented yet',
      });
    } catch (error) {
      return response.status(500).json({
        error: 'Failed to upload animation',
        message: error.message,
      });
    }
  }
}

module.exports = SplashConfigController;
