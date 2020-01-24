const moment = require('moment');

const conexao = require('../infra/conexao');

class Atendimento{
    adiciona(atendimento, res){

        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

        const dataIsValid = moment(data).isSameOrAfter(dataCriacao);
        const clientIsValid = atendimento.cliente.length >= 5

        const atendimentoDatado = {...atendimento, dataCriacao, data}

        const validacoes = [
            {
                nome: 'data',
                valido: dataIsValid,
                mensagem: 'Data deve ser maior ou igual que a data atual'
            },
            {
                nome: 'cliente',
                valido: clientIsValid,
                mensagem: 'Cliente deve ter ao menos 5 caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)

        const erroExist = erros.length

        if(erroExist){
            res.status(400).json(erros)
        }else{
            const sql = 'INSERT INTO Atendimentos SET ?'
    
            conexao.query(sql, atendimentoDatado, (erro, resultado) => {
                if (erro) {
                    res.status(400).json(erro)
                } else {
                    res.status(201).json(atendimento)
                }
            })
        }

    }

    lista(res){
        const sql = "SELECT * FROM Atendimentos"

        conexao.query(sql, (erro, resultado) =>{
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json(resultado)
            }
        })
    }

    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id = ${id}`
        conexao.query(sql, (erro, resultado) =>{
            const atendimento = resultado[0]
            if (erro) {
                res.status(400).json(erro)
            }else{
                res.status(200).json(atendimento)
            }
        })
    }

    altera(id, valores, res){

        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }

        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'
        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            }else{
                res.status(200).json({...valores, id})
            }
        })
    }

    delete(id, res){
        const sql = 'DELETE FROM Atendimentos WHERE id=?'

        conexao.query(sql, id, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            }else{
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento();