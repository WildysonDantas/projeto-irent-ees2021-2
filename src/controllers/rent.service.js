const bcrypt = require('bcryptjs');
const https = require('https');
// eslint-disable-next-line no-unused-vars
class RentService {
  constructor(Rent) {
    this.Rent = Rent;
  }

  //Todos os alugueis
  get () {
    try {
      return this.Rent.find();
    } catch (error) {
      return new Error(error);
    }
  }

  //Todos os Aluguei Ativos
  getActives () {
    try {
      return this.Rent.find({active: true});
    } catch (error) {
      return new Error(error);
    }
  }

  //Todos os Aluguei Ativos
  getInactives () {
    try {
      return this.Rent.find({active: false});
    } catch (error) {
      return new Error(error);
    }
  }

 async isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }

  async getHouseByIdAnotherApi(rent, house){

    const url = 'https://api-gatewayirent.herokuapp.com/immobile/imovel/'+house;

    console.log(url);
    let p = new Promise((resolve, reject) => {
    const response =  https.get(url, (res) => {
      console.log('statusCode:', res.statusCode);
        
      let data = '';
      res.on('data', (chunk) => {
          data = data + chunk.toString();
      });

      res.on('end', () => {
          const body = JSON.parse(data);
          body.statusCode = res.statusCode;
          resolve(body);
          console.log('promisse');
      });
  
      }).on('error', (e) => {
        reject.error(e);
      });

      response.end();
    });

    return await p;
  }
  

  async getById (id) {

   

    try {
      let p = new Promise((resolve, reject) => {
        
        try{
          const resp =  this.Rent.findById(id);
          resolve(resp);
        }catch(err){
          reject.log(err);
        }

      });

      let resp = await p;

      if(Object.values(resp).length > 0 ){
        console.log('algo');
        try {
          const house = await this.getHouseByIdAnotherApi('wildyson', resp._idHouse);
          //resp.house =[house];
          //resp['house'] =house;
          let c ={
            house: house,
            rent: resp
          }

          return c;

        
          
        } catch (error) {

          console.log(error);
        }
        
        return resp;
      }

      return resp;
      
     

    } catch (err) {
      return new Error(err);
    }
  }

  async getByIdRenter (id) {
    try {
      return await this.Rent.find({_idRenter: id}).exec();
    } catch (err) {
      return new Error(err);
    }
  }

  async getByIdTenant (id) {
    try {
      return await this.Rent.find({_idTenant: id}).exec();
    } catch (err) {
      return new Error(err);
    }
  }
  //Todos os alugies da casa
  async getByIdHouse (id) {
    try {
      return await this.Rent.find({_idHouse: id}).exec();
    } catch (err) {
      return new Error(err);
    }
  }

   //Retorna o aluguel ativo da casa
   async getByIdHouseActive (id) {
    try {
      return await this.Rent.find({_idHouse: id, active: 1}).exec();
    } catch (err) {
      return new Error(err);
    }
  }

  //Salvando Aluguel
  async create (rentOBJ) {
    //console.log(rentOBJ);
    try {
      const rent = new this.Rent(rentOBJ);
     // console.log(rentObj);
      console.log(rent);
     
      return await rent.save();
    } catch (err) {
      return new Error(err);
    }
  }

  async update (id, rentOBJ) {
    //console.log(rentOBJ);
    try {
      const rent = new this.Rent(rentOBJ);
      console.log(rent);
      //console.log(rentObj);
      return await this.Rent.findOneAndUpdate({ _id: id }, rentOBJ);
    } catch (err) {
      console.log("Ocorreu um erro ao atualizar as informações de aluguel")
      return new Error(err);
    }
  }

  /**
   * 
   * Fechar Aluguel
   */

   async closeRent (id) {
    //console.log(rentOBJ);
    try {
      return await this.Rent.findOneAndUpdate({ _id: id }, {active: false});
    } catch (err) {
      console.log("Ocorreu um erro ao fechar aluguel")
      return new Error(err);
    }
  }

  //Removendo Aluguel

  async remove (id) {
    try {
      await this.Rent.deleteOne({ _id: id });
    } catch (err) {
      console.log("Ocorreu um erro ao remover aluguel")
      return new Error(err);
    }
  }
}

module.exports = RentService;
