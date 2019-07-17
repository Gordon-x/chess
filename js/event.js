/**
 * 事件
 * @param inject
 * @constructor
 */
function PlayEvent(inject = []) {

    /**
     * border事件体
     * @param e
     */
    let moveForBorder = function (e) {
        e = e ? event : window.event;
        let plateObj = injectObj[Plate.name]; //棋盘
        let idx = plateObj.getCrossPos(e.clientX, e.clientY);
        if (idx) {
            plateObj.renderChessBorder(idx.v, idx.h);
        } else {
            plateObj.clearAllBorder();
        }
    };

    /**
     * 创建运行对象
     * @param player
     * @param idx
     * @returns {Runtime}
     */
    let createRuntimeObj = function(player, idx) {
        let chess = new Chess(player);
        return new Runtime({
            pos: idx,
            chess: chess,
        });
    };

    /**
     * 设置作战区域
     * @param v
     * @param h
     */
    let setFireArea = function(v, h) {
        let plateObj = injectObj[Plate.name]; //棋盘
        let m = plateObj.getMatrix();
        let vl = m.length,
            hl = m[0].length;

        let vMin = Math.max(0, Math.min(vl, v - 7));
        let hMin = Math.max(0, Math.min(hl, h - 7));
        let vMax = Math.max(0, Math.min(vl, v + 7));
        let hMax = Math.max(0, Math.min(hl, h + 7));
        injectObj['FireArea'].minV = Math.min(injectObj['FireArea'].minV, vMin);
        injectObj['FireArea'].minH = Math.min(injectObj['FireArea'].minH, hMin);
        injectObj['FireArea'].maxV = Math.max(injectObj['FireArea'].maxV, vMax);
        injectObj['FireArea'].maxH = Math.max(injectObj['FireArea'].maxH, hMax);
    };

    /**
     * 落子
     * @param e
     */
    let putChessDown = function (e) {
        e = e ? event : window.event;
        let plateObj = injectObj[Plate.name]; //棋盘
        let ctrl = injectObj['Controller'];
        let curUser = ctrl.getPlayer();
        if (curUser.type === TYPE_HUMAN) {
            let idx = plateObj.getCrossPos(e.clientX, e.clientY);
            if (idx) {
                setFireArea(idx.v, idx.h);
                let runtimeChessObj = createRuntimeObj(curUser, idx);
                if (plateObj.renderOneChess(idx.v, idx.h, runtimeChessObj)) {
                    //初始化周围情况
                    runtimeChessObj.initAround(plateObj.getMatrix(), false);
                    curUser.increaseStep();
                    if (runtimeChessObj.judgeWin()) {
                        curUser.win = true;
                        curUser.updateInfo();
                        plateObj.gameOver();
                    } else {
                        ctrl.changePlayer();
                        if (ctrl.getPlayer().type === TYPE_AI) {
                            putChessDown();
                        }
                    }
                }
            }
        } else if (curUser.type === TYPE_AI) {
            let ai = injectObj['AI'];
            /**
             * 创建ai将要下的棋，未落子
             * @type {Runtime}
             */
            let aiRuntimeChessObj = createRuntimeObj(curUser, {});
            /**
             * 创建人类的棋子，未落子
             * @type {Runtime}
             */
            let humanRuntimeChessObj = createRuntimeObj(ctrl.getEnemy(), {});

            let idx = ai.analyse(aiRuntimeChessObj, humanRuntimeChessObj);
            if (idx) {
                let runtimeChessObj = createRuntimeObj(curUser, idx);
                setFireArea(idx.v, idx.h);
                if (plateObj.renderOneChess(idx.v, idx.h, runtimeChessObj)) {
                    //初始化周围情况
                    runtimeChessObj.initAround(plateObj.getMatrix(), false);
                    curUser.increaseStep();
                    if (runtimeChessObj.judgeWin()) {
                        curUser.win = true;
                        curUser.updateInfo();
                        plateObj.gameOver();
                    } else {
                        ctrl.changePlayer();
                    }
                }
            }
        }
    };

    /**
     * border事件
     */
    this.border = function () {
        let plateObj = injectObj[Plate.name]; //棋盘
        let el = plateObj.getEventAttach();
        el.onmousemove = moveForBorder;
        el.onmouseout = plateObj.clearAllBorder;
    };

    this.restart = function () {
        document.querySelector('#restart').onclick = function (e) {
            let plateObj = injectObj[Plate.name]; //棋盘
            plateObj.gameInit();
            injectObj[App.name].init();
        }
    };

    /**
     * 下棋
     * @param el
     */
    this.play = function (el) {
        let plateObj = injectObj[Plate.name]; //棋盘
        plateObj.getEventAttach().onclick = putChessDown;
    };

    let me = this;
    let il = inject.length,
        injectObj = {};
    for (let i = 0; i < il; i++) {
        injectObj[inject[i].constructor.name] = inject[i];
        if (inject[i].hasOwnProperty('initEvent')) {
            inject[i].initEvent(me);
        }
    }
}