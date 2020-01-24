const customExpress = require('./config/custom-express');
const conexao = require('./infra/conexao');
const Tabelas = require('./infra/tabelas')

conexao.connect((erro) => {
    if (erro) {
        console.log(erro);
    } else {

        console.log('> Conectado com sucesso ao banco de dados')

        Tabelas.init(conexao)


        const app = customExpress();

        app.listen(3000, () => {
        console.log("> Servidor rodando na porta 3000")})
    }
});


