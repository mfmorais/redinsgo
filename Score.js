class Score {
    constructor(redis, cfg) {
        this.redis = redis;
        this.cfg = cfg;
    }

    async adicionar(i) {
        await this.redis.set(this.cfg.nome_lista_score + i, 0).catch(err => console.log(err));
    }
}
module.exports = Score;