function Controller(config) {
    if (!config.hasOwnProperty('all')
        || config['all'].constructor.name !== 'Array'
        || config['all'].length !== 2
    ) {
        throw new Error('玩家配置不正确！');
    }
    let allPlayer = config['all'],
        defaultIdx = 0,
        curPlayer = allPlayer[defaultIdx] || null,
        round = 1,
        startTime = Date.now();


    this.setStartTime = function () {
        startTime = Date.now();
    };

    let changeStyle = function () {
        let opponent = allPlayer[+!defaultIdx];
        G(ELEM_MAP[curPlayer.camp]).removeClass('active');
        G(ELEM_MAP[opponent.camp]).addClass('active');
    };

    /**
     * 切换控制
     */
    this.changePlayer = function () {
        changeStyle();

        defaultIdx = +!defaultIdx;
        curPlayer = allPlayer[defaultIdx];
    };

    /**
     * 激活初始玩家
     */
    let initActivePlayer = function () {
        let opponent = allPlayer[+!defaultIdx];
        G(ELEM_MAP[curPlayer.camp]).addClass('active');
    };
    initActivePlayer();

    /**
     * 获取玩家
     * @returns {*|null}
     */
    this.getPlayer = function () {
        return curPlayer;
    };

    /**
     * 获取敌人
     * @returns {*}
     */
    this.getEnemy = function() {
        return allPlayer[+!defaultIdx];
    };

    this.setRound = function (r) {
        round = r;
    };

    /**
     * 初始化落子事件
     * @param e
     */
    this.initEvent = function (e) {
        e.play();
    }
}