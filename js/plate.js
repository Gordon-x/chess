/**
 * 棋盘对象
 * todo 悔棋暂不支持，记录落子历史，清除指定棋子，重新绘制棋子。
 * @param config
 * @constructor
 */
function Plate(config) {
    let me = this;
    let container = config['el'];

    /**
     * 棋盘画布对象
     * @type {CanvasRenderingContext2D}
     */
    let cxt2d = null;

    /**
     * 棋子绘制画布
     * @type {CanvasRenderingContext2D}
     */
    let cxtChess2d = null;
    let cxtBorder2d = null;

    let canvas;
    let canvasChess;
    let canvasBorder;

    /**
     * 画布边长
     * @type {number}
     */
    let canvasSideLen = 780;    //px

    /**
     * 棋盘边长
     * @type {number}
     */
    let plateSideLen = 0;

    /**
     * 棋盘线宽
     * @type {number}
     */
    let plateLineWidth = 1;

    /**
     * 棋盘格子数量
     * @type {number}
     */
    let cellNumOneSide = 14;

    /**
     * 格子边长
     * @type {number}
     */
    let cellSideLen = 0;

    /**
     * 棋盘原点
     * @type {number}
     */
    let plateOriginPosX = 0;
    let plateOriginPosY = 0;

    /**
     * 绘制棋子坐标基准
     * @type {number}
     */
    let drawChessBasePosX = 0;
    let drawChessBasePosY = 0;

    /**
     * 棋子半径
     * @type {number}
     */
    let singleChessRadius = 0;

    /**
     * 每边棋子最多数量
     * @type {number}
     */
    let chessNumOneSide = 0;

    /**
     * 落子定位框边长
     * @type {number}
     */
    let downChessBorderSideLen = 0;

    /**
     * 落子定位框原点坐标初始值
     * @type {number}
     */
    let chessBorderPosX = 0;
    let chessBorderPosY = 0;

    /**
     * 棋盘矩阵
     * @type {Array}
     */
    let cellMatrix = [];

    let game_over = false;

    let plateHtml = '<div class="play">\n' +
        '        <canvas id="canvas"></canvas>\n' +
        '        <canvas id="border"></canvas>\n' +
        '        <canvas id="chess"></canvas>\n' +
        '        <div class="user_info">\n' +
        '            <div id="white">\n' +
        '                <div class="rec"><span>昵称</span><span id="white_name"></span></div>\n' +
        '                <div class="rec"><span>步数</span><span id="white_step"></span></div>\n' +
        '                <div class="rec"><span>执子</span><span id="white_camp"></span></div>\n' +
        '                <div class="rec"><span>玩家</span><span id="white_type"></span></div>\n' +
        '                <div class="rec"><span id="white_win"></span></div>\n' +
        '            </div>\n' +
        '            <div id="black">\n' +
        '                <div class="rec"><span>昵称</span><span id="black_name"></span></div>\n' +
        '                <div class="rec"><span>步数</span><span id="black_step"></span></div>\n' +
        '                <div class="rec"><span>执子</span><span id="black_camp"></span></div>\n' +
        '                <div class="rec"><span>玩家</span><span id="black_type"></span></div>\n' +
        '                <div class="rec"><span id="black_win"></span></div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="mask">\n' +
        '        <button id="restart">重新开始</button>\n' +
        '    </div>';

    let initDom = function() {
        G(container).html(plateHtml);
    };

    /**
     * 初始化棋盘属性
     */
    let initPanelAttr = function () {
        //棋盘边长
        plateSideLen = canvasSideLen * 0.9;
        //格子边长
        downChessBorderSideLen = cellSideLen = plateSideLen / cellNumOneSide;
        //棋盘原点坐标
        plateOriginPosX = plateOriginPosY = canvasSideLen * 0.05;
        //绘制棋子基准
        drawChessBasePosX = plateOriginPosX + plateLineWidth;
        drawChessBasePosY = plateOriginPosY + plateLineWidth;
        //棋子半径
        singleChessRadius = 0.8 * cellSideLen / 2;
        //棋子个数
        chessNumOneSide = cellNumOneSide + 1;
        me.chessNumOneSide = chessNumOneSide;
        //定位框
        chessBorderPosX = plateOriginPosX - downChessBorderSideLen / 2;
        chessBorderPosY = plateOriginPosX - downChessBorderSideLen / 2;
    };

    let initCxt = function () {
        canvas = G('#canvas').elem();
        canvas.width = canvasSideLen;
        canvas.height = canvasSideLen;
        cxt2d = canvas.getContext("2d");

        canvasChess = G('#chess').elem();
        canvasChess.width = canvasSideLen + plateLineWidth * 2;
        canvasChess.height = canvasSideLen + plateLineWidth * 2;
        cxtChess2d = canvasChess.getContext("2d");

        canvasBorder = G('#border').elem();
        canvasBorder.width = canvasSideLen + plateLineWidth * 2;
        canvasBorder.height = canvasSideLen + plateLineWidth * 2;
        cxtBorder2d = canvasBorder.getContext("2d");
    };

    let initMatrix = function () {
        for (let v = 0; v < chessNumOneSide; v++) { //垂直
            cellMatrix[v] = [];
            for (let h = 0; h < chessNumOneSide; h++) { //水平
                cellMatrix[v][h] = null;
            }
        }
    };

    let renderPlate = function () {
        cxt2d.lineWidth = plateLineWidth;
        cxt2d.strokeStyle = "#333";
        cxt2d.fillStyle = "#d6c391";
        cxt2d.beginPath();
        cxt2d.rect(plateOriginPosX, plateOriginPosY, plateSideLen, plateSideLen);
        cxt2d.closePath();
        cxt2d.fill();
        cxt2d.stroke();

        cxt2d.strokeStyle = "#444";
        for (let i = 1; i < cellNumOneSide; i++) {
            cxt2d.beginPath();
            cxt2d.moveTo(plateOriginPosX + i * cellSideLen, plateOriginPosY);
            cxt2d.lineTo(plateOriginPosX + i * cellSideLen, plateOriginPosY + plateSideLen);
            cxt2d.stroke();

            cxt2d.beginPath();
            cxt2d.moveTo(plateOriginPosX, plateOriginPosY + i * cellSideLen);
            cxt2d.lineTo(plateOriginPosX + plateSideLen, plateOriginPosY + i * cellSideLen);
            cxt2d.stroke();
        }
    };

    /**
     * 绘制棋子
     * @param v
     * @param h
     * @param color
     */
    let drawOneChess = function (v, h, color) {
        cxtChess2d.fillStyle = color;
        if (v >= 0 && v < chessNumOneSide && h >= 0 && h < chessNumOneSide) {
            cxtChess2d.beginPath();
            cxtChess2d.arc(drawChessBasePosX + h * cellSideLen, drawChessBasePosY + v * cellSideLen, singleChessRadius, 0, 2 * Math.PI, true);
            cxtChess2d.closePath();
            cxtChess2d.fill();
        }
    };

    let clearAllChessDraw = function () {
        cxtChess2d.clearRect(0, 0, canvasChess.width, canvasChess.height);
    };

    let init = function () {
        initDom();
        initPanelAttr();
        initCxt();
        initMatrix();
        renderPlate();
    };

    //初始化；
    init();

    /** -------开放以下方法--------- */

    /**
     * 清除棋盘
     */
    this.clearAll = function () {
        initMatrix();
        clearAllChessDraw();
    };

    /**
     * 渲染全部存在的棋子
     */
    this.renderAllChess = function () {
        if (!game_over) {
            for (let v = 0; v < cellNumOneSide; v++) {
                for (let h = 0; h < cellNumOneSide; h++) {
                    let pos = cellMatrix[v][h];
                    if (pos) {
                        drawOneChess(v, h, pos.color);
                    }
                }
            }
        }
    };

    /**
     * 渲染一个棋子
     * @param v
     * @param h
     * @param runtimeChess
     */
    this.renderOneChess = function (v, h, runtimeChess) {
        if (!game_over && !cellMatrix[v][h]) {
            cellMatrix[v][h] = runtimeChess;
            drawOneChess(v, h, runtimeChess.chess.color);
            return true;
        }
        return false;
    };

    /**
     * 渲染框
     * @param v
     * @param h
     */
    this.renderChessBorder = function (v, h) {
        this.clearAllBorder();
        cxtBorder2d.strokeStyle = "#f00";
        cxtBorder2d.beginPath();
        cxtBorder2d.rect(chessBorderPosX + plateLineWidth + h * downChessBorderSideLen, chessBorderPosY + plateLineWidth + v * downChessBorderSideLen, downChessBorderSideLen, downChessBorderSideLen);
        cxtBorder2d.closePath();
        cxtBorder2d.stroke();
    };

    /**
     * 清除所有border
     */
    this.clearAllBorder = function () {
        cxtBorder2d.clearRect(0, 0, canvasBorder.width, canvasBorder.height);
    };


    this.getCrossPos = function (mouseX, mouseY) //e.clientX
    {
        let rect = canvas.getBoundingClientRect();

        // canvas对象border区域内相对定位
        let x = mouseX - rect.left - chessBorderPosX;
        let y = mouseY - rect.top - chessBorderPosY;

        let maxLen = chessNumOneSide * downChessBorderSideLen;

        if (x > maxLen || y > maxLen || x < 0 || y < 0) {
            return null;
        }

        let v = Math.floor(y / downChessBorderSideLen);
        let h = Math.floor(x / downChessBorderSideLen);

        v = Math.min(Math.max(v, 0), chessNumOneSide - 1);
        h = Math.min(Math.max(h, 0), chessNumOneSide - 1);

        return {
            v: v,
            h: h
        }
    };

    this.getEventAttach = function () {
        return canvasChess;
    };

    this.getMatrix = function () {
        return cellMatrix;
    };

    /**
     * 初始化事件
     * @param e
     */
    this.initEvent = function (e) {
        e.border();
        e.restart();
    };

    this.gameInit = function () {
        this.clearAll();
        G('.mask').hide(true);
    };

    this.gameOver = function () {
        game_over = true;
        setTimeout(function () {
            G('.mask').show(true);
        }, 100);
    };
}
