const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { check, validationResult, cookie } = require('express-validator');
const RentService = require('../controllers/rent.service');
const Rent = require('../models/rent.model');


const rentService = new RentService(Rent);


// Verificar se objeto esta vazio
function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

// Registro de alugueis
router.post(
  '/register',
  [
    check('_idRenter', 'O id do locador da casa é obrigatorio').exists(),
    check('_idTenant', 'O id do inquilino é obrigatorio').exists(),
    check('_idHouse', 'O id da casa é obrigatorio').exists(),
    check('numPeoples', 'O numero de inquilinos é obrigatório').exists(),
    check('numPeoples', 'O numero de inquilinos deve ser no mimimo 1').isInt({ min: 1}),
    check('startRent', 'A data do começo do aluguel é obrigatorio').exists(),
    check('startRent', 'A data está no formato invalido').isDate(),
    check('price', 'O preço do aluguel é obrigatorio').exists(),
    check('price', 'O valor minimo de aluguel é 10 reais').isInt({ min: 10}),


  ],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ errors: errors.array() });
    }
   
    try {
      const { startRent, price, numPeoples, _idRenter, _idTenant, _idHouse } = req.body;

      const ac = await rentService.getByIdHouseActive(_idHouse);
      
      if(ac.length > 0){
        return res.status(404).json(
          { message: 'Essa casa ja possui um aluguel ativo',
            success: false,
          }
        );
      }

      var p = {
        startRent: startRent,
        _idRenter : _idRenter,
        _idTenant:  _idTenant,
        numPeoples: numPeoples ,
        _idHouse: _idHouse,
        price: price
      }
    
      await rentService.create(p);
     
      return res.status(201).json({success: true, message: "Aluguel criado com sucesso!" });;
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "Ocorreu um erro ao registrar esse aluguel", success: false});;
    }
  },
);


/**
* Listar Alugueis por ID
*/
router.get(
  '/getById', 
  [check('id', 'O id do aluguel é obrigatorio').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      const { id } = req.body;
      const r = await rentService.getById(id);
      
      if(isEmpty(r)){
        res.status(404).json(
          { message: 'Aluguel não encontrado',
            success: false,
          }
        );
      }
      return res.status(200).json({ data: r, success: true});
      
      
    } catch (err) {
      console.log(err);
      return res.sendStatus(401);
    }
  }
);

/**
* Listar Alugueis por locador
*/
router.get(
  '/getByIdRenter', 
  [check('id', 'O id do locador é obrigatorio').exists()],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      const { id } = req.body;
      const r = await rentService.getByIdRenter(id);
      
      if(r.length == 0){
        //retorna resposta 204 sem conteudo
       return  res.status(404).json(
          { message: 'Aluguel não encontrado',
            success: false,
          }
        );
      }

      return res.status(200).json({ data: r, success: true});
      
      
    } catch (err) {
      console.log(err);
      return res.sendStatus(401);
    }
  }
);


/**
* Listar Alugueis por Inquilino
*/
router.get(
  '/getByIdTenant', 
  [check('id', 'O id do inquilino é obrigatorio').exists()],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      const { id } = req.body;
      const r = await rentService.getByIdTenant(id);
      
      if(r.length == 0){
        return res.status(404).json(
          { message: 'Aluguel não encontrado',
            success: false,
          }
        );
      }
      return res.status(200).json({ data: r, success: true});
      
      
    } catch (err) {
      console.log(err);
      return res.sendStatus(401);
    }
  }
);

/**
* Listar Alugueis da Casa
*/
router.get(
  '/getByIdHouse', 
  [check('id', 'O id da casa é obrigatorio').exists()],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      const { id } = req.body;
      const r = await rentService.getByIdHouse(id);
      
      if(r.length == 0){
        return res.status(404).json(
          { message: 'Aluguel não encontrado',
            success: false,
          }
        );
      }
      return res.status(200).json({ data: r, success: true});
      
      
    } catch (err) {
      console.log(err);
      return res.sendStatus(401);
    }
  }
);

/**
* Listar Todos os Alugueis
*/
router.get('/', async (req, res) => {
   
    try{
     
      const r = await rentService.get();
      if(r.length == 0){
        return res.status(404).json(
          { message: 'Nenhum aluguel foi encontrado',
            success: false,
          }
        );
      }
      return res.status(200).json({ data: r, success: true});
      
      
    } catch (err) {
      console.log(err);
      return res.sendStatus(401);
    }
  }
);

/**
* Listar Todos os Alugueis Ativos
*/
router.get('/actives', async (req, res) => {
   
  try{
   
    const r = await rentService.getActives();
    if(r.length == 0){
      return res.status(404).json(
        { message: 'Nenhum aluguel foi encontrado',
          success: false,
        }
      );
    }
    return res.status(200).json({ data: r, success: true});
    
    
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
}
);

/**
* Listar Todos os Alugueis Ativos
*/
router.get('/inactives', async (req, res) => {
   
  try{
   
    const r = await rentService.getInactives();
    if(r.length == 0){
      return res.status(404).json(
        { message: 'Nenhum aluguel foi encontrado',
          success: false,
        }
      );
    }
    return res.status(200).json({ data: r, success: true});
    
    
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
}
);

// Atualizar  aluguel
router.put(
  '/update',
  [
    check('_idRent', 'O id do aluguel da casa é obrigatorio').exists(),
    check('_idRenter', 'O id do locador da casa é obrigatorio').exists(),
    check('numPeoples', 'O numero de inquilinos é obrigatório').exists(),
    check('startRent', 'A data do começo do aluguel é obrigatorio').exists(),
    check('startRent', 'A data está no formato invalido').isDate(),
    check('numPeoples', 'O numero de inquilinos deve ser no mimimo 1').isInt({ min: 1}),
    check('price', 'O preço do aluguel é obrigatorio').exists(),
    check('price', 'O valor minimo de aluguel é 10 reais').isInt({ min: 10}),


  ],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ errors: errors.array() });
    }
   
    try {
      const { _idRent, _idRenter, numPeoples, startRent, price } = req.body;

      const rent = await rentService.getById(_idRent);
      
      if(isEmpty(rent)){
        return res.status(404).json(
          { message: 'Aluguel não encontrado',
            success: false,
          }
        );
      }

      if(rent.active == false){
       return res.status(404).json(
          { message: 'Não é possivel alterar esse alguel, pois ele ja foi finalizado!',
            success: false,
          }
        );
      }

      var p = {
        startRent: startRent,
        _idRenter : _idRenter,
        numPeoples: numPeoples,
        price: price,
        
      }
    
      await rentService.update(_idRent, p);
     
      return res.status(200).json({success: true, message: "Aluguel atualizado com sucesso!" });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "Ocorreu um erro ao atualizar esse aluguel", success: false});;
    }
  },
);

// Fechar  aluguel
router.put(
  '/closeRent',
  [
    check('_idRent', 'O id do aluguel da casa é obrigatorio').exists(),
    check('_idRenter', 'O id do locador da casa é obrigatorio').exists(),
   
  ],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ errors: errors.array() });
    }
   
    try {
      const { _idRent, _idRenter } = req.body;

      const rent = await rentService.getById(_idRent);
      
      if(isEmpty(rent)){
        return res.status(404).json(
          { message: 'Aluguel não encontrado',
            success: false,
          }
        );
      }

      if(rent._idRenter != _idRenter){
        return res.status(404).json(
          { message: 'O locador não corresponde com o aluguel informado',
            success: false,
          }
        );
      }

      if(rent.active == false){
        return res.status(404).json(
          { message: 'Esse aluguel ja foi finalizado!',
            success: false,
          }
        );
      }
    
      await rentService.closeRent(_idRent);
     
      return res.status(200).json({success: true, message: "Aluguel finalizado com sucesso!" });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "Ocorreu um erro ao finalizado esse aluguel", success: false});;
    }
  },
);

// remover  aluguel
router.delete(
  '/delete',
  [
    check('_idRent', 'O id do aluguel da casa é obrigatorio').exists(),
    check('_idRenter', 'O id do locador da casa é obrigatorio').exists(),
  

  ],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ errors: errors.array() });
    }
   
    try {
      const { _idRent, _idRenter} = req.body;

      const rent = await rentService.getById(_idRent);
      
      if(isEmpty(rent)){
        return res.status(404).json(
          { message: 'Aluguel não encontrado',
            success: false,
          }
        );
      }

      if(rent.active == false){
       return res.status(404).json(
          { message: 'Não é possivel remover esse alguel, pois ele ja foi finalizado!',
            success: false,
          }
        );
      }

      
    
      await rentService.remove(_idRent);
     
      return res.status(200).json({success: true, message: "Aluguel removido com sucesso!" });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "Ocorreu um erro ao remover esse aluguel", success: false});;
    }
  },
);


module.exports = router;
