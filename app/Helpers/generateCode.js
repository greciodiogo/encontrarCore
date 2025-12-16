module.exports = async => {
  return new Promise((resolve, reject) => {        
        const securityCode = Math.floor(100000 + Math.random() * 900000); // gerar numero de 6 digitos
        resolve(`${securityCode}`); 
  });
};
 