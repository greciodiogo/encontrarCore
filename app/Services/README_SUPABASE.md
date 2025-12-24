# LocalFilesService - Integração com Supabase

Este serviço migra a funcionalidade de upload e gestão de ficheiros do NestJS para AdonisJS 4.1.0, utilizando Supabase Storage.

## 📦 Dependências Instaladas

- `sharp` - Processamento de imagens
- `@supabase/supabase-js` - Cliente Supabase

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu ficheiro `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-key
SUPABASE_BUCKET=uploads
```

### 2. Configuração do Supabase

O arquivo `config/supabase.js` já está criado e configurado para ler essas variáveis.

## 📁 Estrutura de Arquivos Criados

```
app/
├── Services/
│   ├── LocalFilesService.js          # Serviço principal
│   ├── SettingsService.js           # Serviço para buscar configurações
│   ├── LocalFilesService.example.js  # Exemplos de uso
│   └── README_SUPABASE.md           # Esta documentação
config/
└── supabase.js                       # Configuração do Supabase
```

## 🚀 Uso

### Exemplo Básico em um Controller

```javascript
const LocalFilesService = use('App/Services/LocalFilesService')

class UploadController {
  async uploadPhoto({ request, response }) {
    const file = request.file('photo', {
      types: ['image'],
      size: '20mb'
    })

    const localFilesService = new LocalFilesService()
    
    // Salvar foto
    const { path, mimeType } = await localFilesService.savePhoto(file)
    
    // Criar thumbnail
    const thumbnailPath = await localFilesService.createPhotoThumbnail(file)
    
    return response.ok({ path, thumbnailPath, mimeType })
  }
}
```

## 📚 Métodos Disponíveis

### `getPhoto(path: string): Promise<Blob | null>`
Baixa uma foto do Supabase Storage.

**Parâmetros:**
- `path` - Caminho do ficheiro no storage

**Retorna:** Blob do ficheiro ou `null` se houver erro

---

### `listAllFiles(): Promise<string[]>`
Lista todos os ficheiros das pastas `uploads` e `thumbnails`.

**Retorna:** Array de caminhos dos ficheiros

---

### `savePhoto(file: Object): Promise<{path: string, mimeType: string}>`
Salva uma foto no Supabase Storage, convertendo para JPEG de alta qualidade.

**Parâmetros:**
- `file` - Objeto de ficheiro (AdonisJS File ou objeto com `buffer` e `originalname`/`clientName`)

**Retorna:** Objeto com `path` e `mimeType`

**Características:**
- Converte automaticamente para JPEG
- Qualidade 100%
- Auto-rotação baseada em EXIF
- Fundo branco para transparências

---

### `createPhotoThumbnail(file: Object): Promise<string>`
Cria uma thumbnail da foto.

**Parâmetros:**
- `file` - Objeto de ficheiro (AdonisJS File ou objeto com `buffer` e `originalname`/`clientName`)

**Retorna:** Caminho da thumbnail

**Características:**
- Tamanho configurável via setting "Thumbnail size" (padrão: 200px)
- Qualidade 80%
- Formato JPEG
- Fundo branco para transparências

---

### `createPhotoPlaceholder(file: Object): Promise<string>`
Cria um placeholder em base64 da foto.

**Parâmetros:**
- `file` - Objeto de ficheiro (AdonisJS File ou objeto com `buffer` e `originalname`/`clientName`)

**Retorna:** String base64 data URL

---

## 🔧 Configuração de Settings

O serviço utiliza o `SettingsService` para buscar configurações da base de dados.

### Setting Necessário

Para que o `createPhotoThumbnail` funcione corretamente, certifique-se de ter um setting na tabela `settings`:

```sql
INSERT INTO settings (name, value) VALUES ('Thumbnail size', '200');
```

Se o setting não existir, será usado o valor padrão de 200px.

## 📝 Notas Importantes

1. **Formato de Ficheiro**: O serviço suporta tanto objetos File do AdonisJS quanto objetos simples com `buffer` e `originalname`/`clientName`.

2. **Bucket**: O bucket padrão é `uploads`, mas pode ser alterado via variável de ambiente `SUPABASE_BUCKET`.

3. **Estrutura de Pastas**:
   - `uploads/` - Fotos originais
   - `thumbnails/` - Thumbnails geradas
   - `originals/` - Ficheiros originais (usado no placeholder)

4. **Processamento de Imagens**: Todas as imagens são convertidas para JPEG com fundo branco para garantir consistência.

## ⚠️ Requisitos

- Node.js >= 18.17.0 (recomendado >= 20.0.0)
- Conta Supabase configurada
- Bucket criado no Supabase Storage

## 🔍 Troubleshooting

### Erro: "Upload failed"
- Verifique se as credenciais do Supabase estão corretas
- Confirme que o bucket existe e tem as permissões corretas
- Verifique se o tamanho do ficheiro não excede os limites

### Erro: "File buffer not found"
- Certifique-se de que o ficheiro foi enviado corretamente
- Verifique se está usando `request.file()` no controller

### Thumbnail não está sendo criada
- Verifique se existe o setting "Thumbnail size" na base de dados
- Confirme que o Sharp está instalado corretamente

