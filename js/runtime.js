function Runtime(config) {
    this.absPos = config['pos'];

    this.chess = config['chess'];

    this.player = this.chess.belong;

    this.arounds = {};

    /**
     * 8个方向，4条线；
     */
    let leftTop2RightBottom = [this],
        left2Right = [this],
        leftBottom2RightTop = [this],
        Bottom2Top = [this];
    let maxCheckNum = 5;
    let lt = true,
        l = true,
        lb = true,
        b = true,
        rb = true,
        r = true,
        rt = true,
        t = true;

    this.analyseAround = function (m) {
        leftTop2RightBottom = [0];
        left2Right = [0];
        leftBottom2RightTop = [0];
        Bottom2Top = [0];
        maxCheckNum = 6;
        lt = true;
        l = true;
        lb = true;
        b = true;
        rb = true;
        r = true;
        rt = true;
        t = true;
        this.calculateAround(m);
    };

    this.initAround = function (m, ai) {
        let i = 1;

        let v = this.absPos.v;
        let h = this.absPos.h;

        let camp = this.player.camp;

        let vl = m.length;
        let hl = m[0].length;

        while (i < maxCheckNum) {
            let v1 = v - i;//向上
            let v2 = v + i;//向下
            let h1 = h - i;//向左
            let h2 = h + i;//向右

            let gtMinBoundary = v1 >= 0 && h1 >= 0; //大于最小边界
            let ltMaxBoundary = v2 < vl && h2 < hl; //小于等于最大边界

            if (gtMinBoundary && m[v1][h1] && camp === m[v1][h1].player.camp) {
                lt && leftTop2RightBottom.unshift(m[v1][h1]);
            } else {
                lt = ai || false;
            }

            if (ltMaxBoundary && m[v2][h2] && camp === m[v2][h2].player.camp) {
                rb && leftTop2RightBottom.push(m[v2][h2]);
            } else {
                rb =  ai || false;
            }

            if (ltMaxBoundary && m[v][h2] && camp === m[v][h2].player.camp) {
                r && left2Right.push(m[v][h2]);
            } else {
                r =  ai || false;
            }

            if (gtMinBoundary && m[v][h1] && camp === m[v][h1].player.camp) {
                l && left2Right.unshift(m[v][h1]);
            } else {
                l =  ai || false;
            }

            if (v2 < vl && h1 >= 0 && m[v2][h1] && camp === m[v2][h1].player.camp) {
                lb && leftBottom2RightTop.unshift(m[v2][h1]);
            } else {
                lb =  ai || false;
            }

            if (v1 >= 0 && h2 < hl && m[v1][h2] && camp === m[v1][h2].player.camp) {
                rt && leftBottom2RightTop.push(m[v1][h2]);
            } else {
                rt =  ai || false;
            }

            if (v1 >= 0 && m[v1][h] && camp === m[v1][h].player.camp) {
                t && Bottom2Top.unshift(m[v1][h]);
            } else {
                t =  ai || false;
            }

            if (v2 < vl && m[v2][h] && camp === m[v2][h].player.camp) {
                b && Bottom2Top.push(m[v2][h]);
            } else {
                b =  ai || false;
            }

            i++;
        }
        this.arounds['lt2rb'] = leftTop2RightBottom;
        this.arounds['l2r'] = left2Right;
        this.arounds['lb2rt'] = leftBottom2RightTop;
        this.arounds['t2b'] = Bottom2Top;
    };

    this.calculateAround = function (m) {
        let i = 1;

        let v = this.absPos.v;
        let h = this.absPos.h;

        let camp = this.player.camp;

        let vl = m.length;
        let hl = m[0].length;

        while (i < maxCheckNum) {
            let v1 = v - i;//向上
            let v2 = v + i;//向下
            let h1 = h - i;//向左
            let h2 = h + i;//向右

            let gtMinBoundary = v1 >= 0 && h1 >= 0; //大于最小边界
            let ltMaxBoundary = v2 < vl && h2 < hl; //小于等于最大边界

            if (gtMinBoundary) {
                lt && leftTop2RightBottom.unshift(m[v1][h1]);
                if (m[v1][h1] && camp !== m[v1][h1].player.camp) {
                    lt = false;
                }
            }
            if (ltMaxBoundary) {
                rb && leftTop2RightBottom.push(m[v2][h2]);
                if (m[v2][h2] && camp !== m[v2][h2].player.camp) {
                    rb = false;
                }
            }
            if (h1 >= 0) {
                l && left2Right.unshift(m[v][h1]);
                if (m[v][h1] && camp !== m[v][h1].player.camp) {
                    l =  false;
                }
            }
            if (h2 < hl) {
                r && left2Right.push(m[v][h2]);
                if (m[v][h2] && camp !== m[v][h2].player.camp) {
                    r = false;
                }
            }
            if (v2 < vl && h1 >= 0) {
                lb && leftBottom2RightTop.unshift(m[v2][h1]);
                if (m[v2][h1] && camp !== m[v2][h1].player.camp) {
                    lb =  false;
                }
            }

            if (v1 >= 0 && h2 < hl) {
                rt && leftBottom2RightTop.push(m[v1][h2]);
                if (m[v1][h2] && camp !== m[v1][h2].player.camp) {
                    rt = false;
                }
            }
            if (v1 >= 0) {
                t && Bottom2Top.unshift(m[v1][h]);
                if (m[v1][h] && camp !== m[v1][h].player.camp) {
                    t = false;
                }
            }
            if (v2 < vl) {
                b && Bottom2Top.push(m[v2][h]);
                if (m[v2][h] && camp !== m[v2][h].player.camp) {
                    b = false;
                }
            }
            i++;
        }

        let lt2rbStart = 0,
            l2rStart = 0,
            lb2rtStart = 0,
            t2bStart = 0;

        while(1) {
            let lt2rb = leftTop2RightBottom.length,
                l2r = left2Right.length,
                lb2rt = leftBottom2RightTop.length,
                t2b = Bottom2Top.length;
            if (lt2rb > 0 && leftTop2RightBottom[lt2rbStart] === null) {
                leftTop2RightBottom.shift();
                lt2rb = leftTop2RightBottom.length;
            }
            if (lt2rb > 0 && leftTop2RightBottom[lt2rb - 1] === null) {
                leftTop2RightBottom.pop();
                lt2rb = leftTop2RightBottom.length;
            }

            if (l2r > 0 && left2Right[l2rStart] === null) {
                left2Right.shift();
                l2r = left2Right.length;
            }
            if (l2r > 0 && left2Right[l2r - 1] === null) {
                left2Right.pop();
                l2r = left2Right.length;
            }

            if (lb2rt > 0 && leftBottom2RightTop[lb2rtStart] === null) {
                leftBottom2RightTop.shift();
                lb2rt = leftBottom2RightTop.length;
            }
            if (lb2rt > 0 && leftBottom2RightTop[lb2rt - 1] === null) {
                leftBottom2RightTop.pop();
                lb2rt = leftBottom2RightTop.length;
            }

            if (t2b > 0 && Bottom2Top[t2bStart] === null) {
                Bottom2Top.shift();
                t2b = Bottom2Top.length;
            }
            if (t2b > 0 && Bottom2Top[t2b - 1] === null) {
                Bottom2Top.pop();
                t2b = Bottom2Top.length;
            }

            if (leftTop2RightBottom[lt2rbStart] !== null
                && leftTop2RightBottom[lt2rb - 1] !== null
                && left2Right[l2rStart] !== null
                && left2Right[l2r - 1] !== null
                && leftBottom2RightTop[lb2rtStart] !== null
                && leftBottom2RightTop[lb2rt - 1] !== null
                && Bottom2Top[t2bStart] !== null
                && Bottom2Top[t2b - 1] !== null
            ) {
                break;
            }
        }
        this.arounds['lt2rb'] = leftTop2RightBottom;
        this.arounds['l2r'] = left2Right;
        this.arounds['lb2rt'] = leftBottom2RightTop;
        this.arounds['t2b'] = Bottom2Top;
    };

    this.judgeWin = function () {
        for (let i in this.arounds) {
            if (this.arounds.hasOwnProperty(i) && this.arounds[i].length === 5) {
                return true;
            }
        }
        return false;
    };
}