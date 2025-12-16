 
module.exports = (array) => { 
  return ordenarPorExpirationTime(array);
};



/**
 * Função que ordena um array de objetos pela data contida no campo expirationTime
 * @param {Array} array - Array de objetos a ser ordenado
 * @returns {Array} - Array ordenado pela data de expirationTime
 */
function ordenarPorExpirationTime(array) {
    return array.sort((a, b) => {
      // Converte as strings de data para objetos Date para comparação correta
      // O formato esperado é "DD/MM/YYYY HH:MM:SS"
      const dataA = converterParaDate(a.expirationTime);
      const dataB = converterParaDate(b.expirationTime);
      
      // Retorna a comparação entre as datas
      return dataA - dataB;
    });
  }
  
  /**
   * Função auxiliar para converter uma string de data no formato DD/MM/YYYY HH:MM:SS para um objeto Date
   * @param {string} dataString - String de data no formato "DD/MM/YYYY HH:MM:SS"
   * @returns {Date} - Objeto Date correspondente
   */
  function converterParaDate(dataString) {
    // Divide a string em partes de data e hora
    const [dataParte, horaParte] = dataString.split(' ');
    
    // Divide a parte da data em dia, mês e ano
    const [dia, mes, ano] = dataParte.split('/');
    
    // Divide a parte da hora em horas, minutos e segundos
    let horas = 0, minutos = 0, segundos = 0;
    if (horaParte) {
      [horas, minutos, segundos] = horaParte.split(':');
    }
    
    // Cria o objeto Date (mês em JavaScript é base 0, então subtraímos 1)
    return new Date(ano, mes - 1, dia, horas, minutos, segundos);
  }
  
  // Exemplo de uso:
  // const arrayOrdenado = ordenarPorExpirationTime(meuArrayDeObjetos);
  // console.log(arrayOrdenado);
   