const Redis = require('ioredis');
const redis = new Redis();

const Usuario = require('./Usuario');
const Cartela = require('./Cartela');
const Score = require('./Score');
const Sorteio = require('./Sorteio');

redis.on('connect', function () {
    redis.flushall();
    start();
});

redis.on('error', function (error) {
    console.error(error);
});

const cfg = {
    max_qtd_user: Array.from(Array(50), (_, i) => i + 1),
    numeros_cartela: Array.from(Array(99), (_, i) => i + 1),
    max_numeros_cartela: 15,
    nome_lista_numeros: 'numeros_cartela',
    nome_lista_sorteados: 'numeros_sorteados',
    nome_lista_usuario: 'user:',
    nome_lista_cartela: 'cartela:',
    nome_lista_score: 'score:'
}

async function start() {
    init();
}

async function init() {
    await new Cartela(redis, cfg).numeros_disponivel();

    for await (i of cfg.max_qtd_user) {
        await new Usuario(redis, cfg).adicionar(i);
        await new Cartela(redis, cfg).adicionar(i);
        await new Score(redis, cfg).adicionar(i);

    }

    await new Sorteio(redis, cfg).sortear();
}