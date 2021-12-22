// const express = require('express');
const mongoose = require('mongoose');

// ==> Importar o arquivo 'db.config.js'
const database = require('./db.config');

mongoose.Promise = global.Promise;

// ==> Conexão da base de dados
mongoose
  .connect(database.local.localDatabaseUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('✅ A base de dados foi conectada com sucesso!');
  }, (err) => {
    console.log(`🚨 Erro ao conectar com a base de dados...: ${err}`);
    process.exit();
  });
