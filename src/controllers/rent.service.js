const bcrypt = require('bcryptjs');

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

  async getById (id) {
    try {
      return await this.Rent.findById(id);
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
