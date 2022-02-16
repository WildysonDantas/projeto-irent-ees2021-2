# Projeto Irent EES 2021.2 
Micro-serviço de Alugueis que faz parte do sistema Irent

## API
O arquivo de rotas da api esta na raiz do projeto. Esse arquivo pode ser aberto com o programa Insomnia

## Rotas da API
URL_BASE -> https://irent-rent.herokuapp.com/api/v1/rent
* Home [GET] -> /home
* Aluguel por ID [GET] -> /getById + param{id}
* Remover aluguel [DELETE] -> /delete + param{_idRent, _idRenter}
* Atualizar aluguel [PUT] -> /update + param{price, startRent, numPeoples, _idRent,  _idRenter}
*  Registrar aluguel [POST] -> /register + param{price, startRent, numPeoples, _idRent,  _idRenter, _idHouse}
* Fechar aluguel [PUT] -> /closeRent + param{_idRent, _idRenter}
* * Todos os alugueis [GET] -> /
* Todos os Alugueis Ativos [GET] -> /actives
* Todos os Alugueis Inativos [GET] -> /inactives
* Todos os alugueis do Proprietario [GET] -> /getByIdRenter + param{id}
* Todos os alugueis da Casa [GET] -> /getByIdHouse + param{id}
* * Todos os alugueis do Inquilino [GET] -> /getByIdTenant + param{id}
