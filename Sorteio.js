class Sorteio {

    constructor(redis, cfg) {
        this.redis = redis;
        this.cfg = cfg;
    }

    async sortear() {
        for await (i of this.cfg.numeros_cartela) {
            let numero_sorteado = await this.redis.srandmember(this.cfg.nome_lista_numeros, 1)
                .then(res => {
                    return res;
                })
                .catch(err => console.log(err));

            await this.verifica_cartela_usuarios(numero_sorteado);
            await this.adicionar_numero_sorteado(numero_sorteado);
            await this.remover_numero_sorteado(numero_sorteado);

            let isGa = await this.existe_ganhador();
            if (isGa) {
                break;
            }
        }
    }

    async verifica_cartela_usuarios(numero_sorteado) {
        for await (i of this.cfg.max_qtd_user) {
            await this.redis.sismember(this.cfg.nome_lista_cartela + i, numero_sorteado)
                .then(res => {
                    if (res == 1) {
                        this.somar_pontuacao_usuario(i)
                    }
                })
                .catch(err => console.log(err));
        }
    }

    async somar_pontuacao_usuario(i) {
        await this.redis.get(this.cfg.nome_lista_score + i).then(res => {
            this.redis.set(this.cfg.nome_lista_score + i, Number(res) + 1)
                .catch(err => console.log(err));
        })
            .catch(err => console.log(err));
    }

    async adicionar_numero_sorteado(numero_sorteado) {
        await this.redis.sadd(this.cfg.nome_lista_sorteados, numero_sorteado);
    }

    async remover_numero_sorteado(numero_sorteado) {
        await this.redis.srem(this.cfg.nome_lista_numeros, numero_sorteado).catch(err => console.log(err));
    }

    async existe_ganhador(i) {
        let returno = false;
        for await (i of this.cfg.max_qtd_user) {
            let score = await this.redis.get(this.cfg.nome_lista_score + i)
                .then(res => {
                    if (res == null) {
                        res = 0;
                    }
                    return res;
                })
                .catch(err => console.log(err));
            if (score == this.cfg.max_numeros_cartela) {
                returno = true;
                await this.adicionar_ganhador(i);
            }
        }
        return returno;
    }

    async adicionar_ganhador(i) {
        console.log('#############################');
        await this.redis.hget(this.cfg.nome_lista_usuario + i, 'name')
            .then(res => console.log('Usuario: ', res))
            .catch(err => console.log(err));

        await this.redis.get(this.cfg.nome_lista_score + i)
            .then(res => console.log('Pontos: ', res))
            .catch(err => console.log(err));

        await this.redis.smembers(this.cfg.nome_lista_cartela + i)
            .then(res => console.log('Numeros Cartela: ', res))
            .catch(err => console.log(err));

        await this.redis.smembers(this.cfg.nome_lista_sorteados)
            .then(res => console.log('Numeros Sorteados: ', res))
            .catch(err => console.log(err));
        console.log('#############################');
    }
}
module.exports = Sorteio;