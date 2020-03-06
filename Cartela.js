class Cartela {

    constructor(redis, cfg) {
        this.redis = redis;
        this.cfg = cfg;
    }

    async numeros_disponivel() {
        await this.redis.sadd(this.cfg.nome_lista_numeros, this.cfg.numeros_cartela)
            .catch(err => console.log(err));
    }

    async adicionar(i) {
        await this.redis.srandmember(this.cfg.nome_lista_numeros, this.cfg.max_numeros_cartela)
            .then(res => {
                this.redis.sadd(this.cfg.nome_lista_cartela + i, res);
            })
    }
}
module.exports = Cartela;