/**
 * 玩家
 * @constructor
 */
function Player(config) {
    this.name = config['name'] || 'gordon';   //玩家名称
    this.type = config['type'] || TYPE_HUMAN;   //玩家类型
    this.camp = config['camp'];   //玩家阵营
    this.step = 0;   //当前步数

    this.win = false;

    let me = this;

    this.updateInfo = function () {
        G(ELEM_MAP[me.camp] + '_name').html(me.name);
        G(ELEM_MAP[me.camp] + '_step').html(me.step);
        G(ELEM_MAP[me.camp] + '_camp').html(NAME_MAP[me.camp]);
        G(ELEM_MAP[me.camp] + '_win').html(me.win ? '胜利' : '');
        G(ELEM_MAP[me.camp] + '_type').html(TYPE_MAP[me.type]);
    };

    this.updateInfo();

    /**
     * 步数增长；
     */
    this.increaseStep = function () {
        this.step++;
        this.updateInfo();
    }
}