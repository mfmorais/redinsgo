class Usuario {

    constructor(redis, cfg) {
        this.redis = redis;
        this.cfg = cfg;
    }

    async adicionar(i) {
        let key = this.cfg.nome_lista_usuario + i;
        let name = 'user' + i;
        let bcartela = this.cfg.nome_lista_cartela + i
        let bscore = this.cfg.nome_lista_score + i

        await this.redis.hset(key, 'name', name);
        await this.redis.hset(key, 'bcartela', bcartela);
        await this.redis.hset(key, 'bscore', bscore);
    }
}
module.exports = Usuario;