
function AI(config) {
    /**
     * 计算最佳落子位置 包含以下
     * 可胜利的落子位置集合A
     * 可阻挡对手胜利的位置集合B
     * 对手距离胜利多少步，
     * AI距离胜利多少步，
     * 取A，B交集 ||
     * 至少5步胜利。
     */

    let plate = config['plate'];

    /**
     * 交战热点区域
     */
    let fireArea = config['fire'];

    /**
     *
     * @param aiRuntime
     * @param humanRuntime
     */
    this.analyse = function(aiRuntime, humanRuntime) {
        /**
         * 棋盘矩阵
         * @type {Array}
         */
        let matrix = plate.getMatrix();
        /**
         * v: 棋盘纵向索引，h：棋盘横向索引
         * @type {{v: number, h: number}}
         */
        let bestPos = {v: 0, h: 0},
            pos = {v: 0, h: 0};

        let score = -100000;
        let baseScore = 10;
        for (let v = fireArea.minV; v < fireArea.maxV; v++) {
            for(let h = fireArea.minH; h < fireArea.maxH; h++) {
                if (matrix[v][h] === null) {
                    pos.v = v;
                    pos.h = h;
                    aiRuntime.absPos = humanRuntime.absPos = pos;
                    aiRuntime.analyseAround(matrix);
                    humanRuntime.analyseAround(matrix);

                    for(let i in aiRuntime.arounds) {
                        let curScore = 0;
                        if (aiRuntime.arounds.hasOwnProperty(i)) {
                            let aroundLength = aiRuntime.arounds[i].length;
                            if (aroundLength === 1) {
                                continue;
                            }
                            let checkPos = aiRuntime.arounds[i].indexOf(0);
                            let frontTotal = 0;
                            let backTotal = 0;
                            let frontChess = 0;
                            let backChess = 0;
                            let frontNearEmpty = 0;
                            let frontInnerEmpty = 0;
                            let backNearEmpty = 0;
                            let backInnerEmpty = 0;
                            let frontEnd = 0;
                            let backEnd = 0;
                            for (let toFront = checkPos - 1, toBack = checkPos + 1; ;toFront--, toBack++) {
                                if (toFront < 0 && toBack >= aroundLength) {
                                    break;
                                }

                                if (toFront >= 0) {
                                    if (aiRuntime.arounds[i][toFront] === null) {
                                        frontChess > 0 ? frontInnerEmpty++ : frontNearEmpty++;
                                    } else if (aiRuntime.arounds[i][toFront].player.type === TYPE_AI) {
                                        frontChess++;
                                    } else if (aiRuntime.arounds[i][toFront].player.type === TYPE_HUMAN) {
                                        frontEnd = 1;
                                    }
                                    frontTotal++;
                                }
                                if (toBack < aroundLength) {
                                    if (aiRuntime.arounds[i][toBack] === null) {
                                        backChess > 0 ? backInnerEmpty++ : backNearEmpty++;
                                    } else if (aiRuntime.arounds[i][toBack].player.type === TYPE_AI) {
                                        backChess++;
                                    } else if (aiRuntime.arounds[i][toBack].player.type === TYPE_HUMAN) {
                                        backEnd = 1;
                                    }
                                    backTotal++;
                                }
                            }
                            let total = frontTotal + backTotal;
                            let weight = 1;
                            let totalChess = frontChess + backChess;
                            let totalNearEmpty = frontNearEmpty + backNearEmpty;
                            let totalInnerEmpty = frontInnerEmpty + backInnerEmpty;

                            if (frontEnd + backEnd === 0) {
                                weight = 2;
                            }
                            if (total === totalChess + backEnd || total === totalChess + frontEnd) {
                                if (totalChess >= 4) {
                                    curScore += 11000;
                                } else if (totalChess > 2) {
                                    curScore += baseScore * totalChess + baseScore * weight * totalChess;
                                } else if (totalChess > 1) {
                                    curScore += baseScore * totalChess + baseScore * weight;
                                } else {
                                    curScore += baseScore * Math.random();      //1子随机摆放
                                }
                            } else if (total === totalChess + frontEnd + backEnd) {
                                if (totalChess >= 4) {
                                    curScore += 11000;
                                } else {
                                    curScore = 0;
                                }
                            } else if (totalInnerEmpty > 0 && totalNearEmpty === 0) {
                                if (totalChess >= 4) {
                                    curScore += baseScore * totalChess - baseScore * totalInnerEmpty;
                                } else if (totalChess > 2) {
                                    curScore += baseScore * totalChess;
                                } else if (totalChess > 1) {
                                    if (frontEnd > 0 && backEnd > 0) {
                                        curScore = 0
                                    } else {
                                        curScore += baseScore * totalChess;
                                    }
                                } else {
                                    curScore += baseScore * Math.random();      //1子随机摆放
                                }
                            }
                            /*switch (total) {
                                case frontEnd > 0 && totalChess + frontEnd:
                                case backEnd > 0 && totalChess + backEnd:
                                case totalChess:
                                    if (frontEnd + backEnd === 0) {
                                        weight = 2;
                                    }
                                    if (totalChess >= 4) {
                                        willWin = true;
                                    } else if (totalChess > 1) {
                                        curScore += baseScore * totalChess + baseScore * weight;
                                    } else {
                                        curScore += baseScore * Math.random();      //1子随机摆放
                                    }
                                    break;
                                case totalChess + totalInnerEmpty + frontEnd + backEnd && totalInnerEmpty <= 2:
                                    switch (totalChess) {
                                        case totalChess >= 4:
                                            curScore += baseScore * 4 + baseScore * totalInnerEmpty;
                                            break;
                                        case 3:
                                            curScore += baseScore * 3 + baseScore * weight;
                                            break;
                                        case 2:
                                            if (frontEnd > 0 && backEnd > 0) {
                                                curScore = 0
                                            } else {
                                                curScore += baseScore * 2 + baseScore * weight;
                                            }
                                            break;
                                        default:
                                            curScore += baseScore * Math.random();
                                    }
                                    break;
                            }*/

                            if (curScore >= score) {
                                bestPos.v = v;
                                bestPos.h = h;
                                score = curScore;
                            }
                        }

                    }
                    for(let i in humanRuntime.arounds) {
                        let curScore = 0;
                        if (humanRuntime.arounds.hasOwnProperty(i)) {
                            let aroundLength = humanRuntime.arounds[i].length;
                            if (aroundLength === 1) {
                                continue;
                            }
                            let checkPos = humanRuntime.arounds[i].indexOf(0);
                            let frontTotal = 0;
                            let backTotal = 0;
                            let frontChess = 0;
                            let backChess = 0;
                            let frontNearEmpty = 0;
                            let frontInnerEmpty = 0;
                            let backNearEmpty = 0;
                            let backInnerEmpty = 0;
                            let frontEnd = 0;
                            let backEnd = 0;
                            for (let toFront = checkPos - 1, toBack = checkPos + 1; ;toFront--, toBack++) {
                                if (toFront < 0 && toBack >= aroundLength) {
                                    break;
                                }

                                if (toFront >= 0) {
                                    if (humanRuntime.arounds[i][toFront] === null) {
                                        frontChess > 0 ? frontInnerEmpty++ : frontNearEmpty++;
                                    } else if (humanRuntime.arounds[i][toFront].player.type === TYPE_HUMAN) {
                                        frontChess++;
                                    } else if (humanRuntime.arounds[i][toFront].player.type === TYPE_AI) {
                                        frontEnd = 1;
                                    }
                                    frontTotal++;
                                }
                                if (toBack < aroundLength) {
                                    if (humanRuntime.arounds[i][toBack] === null) {
                                        backChess > 0 ? backInnerEmpty++ : backNearEmpty++;
                                    } else if (humanRuntime.arounds[i][toBack].player.type === TYPE_HUMAN) {
                                        backChess++;
                                    } else if (humanRuntime.arounds[i][toBack].player.type === TYPE_AI) {
                                        backEnd = 1;
                                    }
                                    backTotal++;
                                }
                            }
                            let total = frontTotal + backTotal;
                            let weight = 1;
                            let totalChess = frontChess + backChess;
                            let totalNearEmpty = frontNearEmpty + backNearEmpty;
                            let totalInnerEmpty = frontInnerEmpty + backInnerEmpty;

                            if (total === totalChess + backEnd || total === totalChess + frontEnd) {
                                if (totalChess >= 4) {
                                    curScore += 10000;
                                } else if (totalChess > 2) {
                                    curScore += baseScore * totalChess + baseScore * weight * (totalChess - 1);
                                } else if (totalChess > 1) {
                                    curScore += baseScore * totalChess + baseScore * weight;
                                } else {
                                    curScore += baseScore * Math.random();      //1子随机摆放
                                }
                            } else if (total === totalChess + frontEnd + backEnd) {
                                if (totalChess >= 4) {
                                    curScore += 10000;
                                } else {
                                    curScore = 0;
                                }
                            } else if (totalInnerEmpty > 0 && totalNearEmpty === 0) {
                                if (totalChess >= 4) {
                                    curScore += baseScore * totalChess + baseScore * totalInnerEmpty;
                                } else if (totalChess > 2) {
                                    curScore += baseScore * totalChess + baseScore * weight;
                                } else if (totalChess > 1) {
                                    if (frontEnd > 0 && backEnd > 0) {
                                        curScore = baseScore
                                    } else {
                                        curScore += baseScore * totalChess + baseScore * weight;
                                    }
                                } else {
                                    curScore += baseScore * Math.random();      //1子随机摆放
                                }
                            }

                            /*switch (total) {
                                case frontEnd > 0 && totalChess + frontEnd:
                                case backEnd > 0 && totalChess + backEnd:
                                case totalChess:
                                    if (frontEnd + backEnd === 0) {
                                        weight = 2;
                                    }

                                    if (totalChess >= 4) {
                                        curScore += 9000;
                                    } else if (totalChess > 1) {
                                        curScore += baseScore * totalChess + baseScore * weight;
                                    } else {
                                        curScore += baseScore * Math.random();      //1子随机摆放
                                    }
                                    break;
                                case totalChess + totalInnerEmpty + frontEnd + backEnd && totalInnerEmpty <= 2:
                                    switch (totalChess) {
                                        case frontChess + backChess >= 4:
                                        case 4:
                                            curScore += baseScore * 4 + baseScore * totalInnerEmpty * 2;
                                            break;
                                        case 3:
                                            curScore += baseScore * 3 + baseScore * weight * 2;
                                            break;
                                        case 2:
                                            if (frontEnd > 0 && backEnd > 0) {
                                                curScore = 0
                                            } else {
                                                curScore += baseScore * 2 + baseScore * weight;
                                            }
                                            break;
                                        default:
                                            curScore += baseScore * Math.random();
                                    }
                                    break;
                            }*/
                            if (curScore >= score) {
                                bestPos.v = v;
                                bestPos.h = h;
                                score = curScore;
                            }
                        }

                    }

                    /*for(let i in aiRuntime.arounds) {
                        let curScore = 0;
                        if (aiRuntime.arounds.hasOwnProperty(i)) {
                            let aroundLength = aiRuntime.arounds[i].length;
                            if (aroundLength === 1) {
                                continue;
                            }
                            let start = aiRuntime.arounds[i].indexOf(0);
                            let a = 0;
                            let b = 0;
                            let e = 0;
                            let ais = 0;
                            let bis = 0;
                            let eScore = 0;
                            for (let j = start - 1, k = start + 1; ;j--, k++) {
                                if (j < 0 && k >= aroundLength) {
                                    break;
                                }

                                if (j >= 0 && aiRuntime.arounds[i][j] === null) {
                                    e++;
                                    if (a === 0) {
                                        eScore += 500/((start - j) * 2);
                                    }
                                }
                                if (k < aroundLength && aiRuntime.arounds[i][k] === null) {
                                    e++;
                                    if (b === 0) {
                                        eScore += 500/((k-start) * 2);
                                    }
                                }
                                if (j >= 0 && aiRuntime.arounds[i][j] && aiRuntime.arounds[i][j].player.type === TYPE_AI) {
                                    a++;
                                }
                                if (k < aroundLength && aiRuntime.arounds[i][k] && aiRuntime.arounds[i][k].player.type === TYPE_AI) {
                                    b++;
                                }

                                if (j >= 0 && aiRuntime.arounds[i][j] && aiRuntime.arounds[i][j].player.type === TYPE_HUMAN) {
                                    ais ++;
                                }
                                if (k < aroundLength && aiRuntime.arounds[i][k] && aiRuntime.arounds[i][k].player.type === TYPE_HUMAN) {
                                    bis ++;
                                }
                            }
                            switch (a + b) {
                                case 9:
                                case 8:
                                case 7:
                                case 6:
                                case 5:
                                    curScore += 1400;
                                    if (e === 0) {
                                        curScore += 2000;
                                    }
                                    break;
                                case 4:
                                    //活4
                                    if (ais === 0 && bis === 0 && e === 0) {
                                        curScore += 2000;
                                    }
                                    //眠4
                                    if ((ais > 0 && bis === 0 || ais === 0 && bis > 0 ) && e === 0) {
                                        curScore += 1200;
                                    }

                                    if (e > 0) {
                                        curScore -= 5 * e;
                                    }

                                    break;
                                case 3:
                                    if (ais === 0 && bis === 0 && e === 0) {
                                        curScore += 1000;
                                    }
                                    if ((ais > 0 && bis === 0 || ais === 0 && bis > 0 ) && e === 0) {
                                        curScore += 800;
                                    }
                                    if (e > 0) {
                                        curScore -= 5 * e;
                                    }
                                    break;
                                case 2:
                                    if (ais === 0 && bis === 0 && e === 0) {
                                        curScore += 500;
                                    }
                                    if ((ais > 0 && bis === 0 || ais === 0 && bis > 0 ) && e === 0) {
                                        curScore += 300;
                                    }
                                    if (e > 0) {
                                        curScore -= 5 * e;
                                    }
                                    break;
                                default:
                                    curScore += Math.random() * 10;
                                    if (e) {
                                        curScore -= 100*e;
                                    }
                            }

                            curScore -= eScore;
                        }

                        if (curScore >= score) {
                            bestPos.v = v;
                            bestPos.h = h;
                            score = curScore;
                        }
                    }

                    for(let i in humanRuntime.arounds) {
                        let curScore = 0;
                        if (humanRuntime.arounds.hasOwnProperty(i)) {
                            let aroundLength = humanRuntime.arounds[i].length;
                            if (aroundLength === 1) {
                                continue;
                            }
                            let start = humanRuntime.arounds[i].indexOf(0);
                            let a = 0;
                            let b = 0;
                            let e = 0;
                            let ais = 0;
                            let bis = 0;
                            let eScore = 0;
                            for (let j = start - 1, k = start + 1; ;j--, k++) {
                                if (j < 0 && k >= aroundLength) {
                                    break;
                                }

                                if (j >= 0 && humanRuntime.arounds[i][j] === null) {
                                    e++;
                                    if (a === 0) {
                                        eScore += 500/((start - j) * 2);
                                    }
                                }
                                if (k < aroundLength && humanRuntime.arounds[i][k] === null) {
                                    e++;
                                    if (b === 0) {
                                        eScore += 500/((k-start) * 2);
                                    }
                                }
                                if (j >= 0 && humanRuntime.arounds[i][j] && humanRuntime.arounds[i][j].player.type === TYPE_HUMAN) {
                                    a++;
                                }
                                if (k < aroundLength && humanRuntime.arounds[i][k] && humanRuntime.arounds[i][k].player.type === TYPE_HUMAN) {
                                    b++;
                                }

                                if (j >= 0 && humanRuntime.arounds[i][j] && humanRuntime.arounds[i][j].player.type === TYPE_AI) {
                                    ais ++;
                                }
                                if (k < aroundLength && humanRuntime.arounds[i][k] && humanRuntime.arounds[i][k].player.type === TYPE_AI) {
                                    bis ++;
                                }
                            }
                            switch (a + b) {
                                case 9:
                                case 8:
                                case 7:
                                case 6:
                                case 5:
                                    curScore += 1400;
                                    if (e === 0) {
                                        curScore += 2000;
                                    }
                                    break;
                                case 4:
                                    //活4
                                    if (ais === 0 && bis === 0 && e === 0) {
                                        curScore += 1300;
                                    }
                                    //眠4
                                    if ((ais > 0 && bis === 0 || ais === 0 && bis > 0 ) && e === 0) {
                                        curScore += 1100;
                                    }

                                    if (e > 0) {
                                        curScore -= 5 * e;
                                    }

                                    break;
                                case 3:
                                    if (ais === 0 && bis === 0 && e === 0) {
                                        curScore += 900;
                                    }
                                    if ((ais > 0 && bis === 0 || ais === 0 && bis > 0 ) && e === 0) {
                                        curScore += 500;
                                    }
                                    if (e > 0) {
                                        curScore -= 5 * e;
                                    }
                                    break;
                                case 2:
                                    if (ais === 0 && bis === 0 && e === 0) {
                                        curScore += 500;
                                    }
                                    if ((ais > 0 && bis === 0 || ais === 0 && bis > 0 ) && e === 0) {
                                        curScore += 300;
                                    }
                                    if (e > 0) {
                                        curScore -= 5 * e;
                                    }
                                    break;
                                default:
                                    curScore += Math.random() * 10;
                                    if (e) {
                                        curScore -= 100*e;
                                    }
                            }

                            curScore -= eScore;
                        }

                        if (curScore > score) {
                            bestPos.v = v;
                            bestPos.h = h;
                            score = curScore;
                        }
                    }
*/


                }
            }
        }

        return bestPos;
    };

    this.initAround = function (m, v, h) {
        let leftTop2RightBottom = [0],
            left2Right = [0],
            leftBottom2RightTop = [0],
            Bottom2Top = [0];
        let maxCheckNum = 7;

        let i = 1;

        let vl = m.length;
        let hl = m[0].length;

        while (i < maxCheckNum) {
            let v1 = v - i;
            let v2 = v + i;
            let h1 = h - i;
            let h2 = h + i;

            let gtMinBoundary = v1 >= 0 && h2 >= 0;
            let ltMaxBoundary = v2 < vl && h2 < hl;

            if (gtMinBoundary && m[v1][h1] && m[v1][h1].player.type === TYPE_AI) {
               leftTop2RightBottom.unshift(m[v1][h1]);
            }

            if (ltMaxBoundary && m[v2][h2] && camp === m[v2][h2].player.camp) {
                leftTop2RightBottom.push(m[v2][h2]);
            }

            if (ltMaxBoundary && m[v][h2] && camp === m[v][h2].player.camp) {
                left2Right.push(m[v][h2]);
            }

            if (gtMinBoundary && m[v][h1] && camp === m[v][h1].player.camp) {
                left2Right.unshift(m[v][h1]);
            }

            if (v2 < vl && h1 >= 0 && m[v2][h1] && camp === m[v2][h1].player.camp) {
                leftBottom2RightTop.unshift(m[v2][h1]);
            }

            if (v1 >= 0 && h2 < hl && m[v1][h2] && camp === m[v1][h2].player.camp) {
                leftBottom2RightTop.push(m[v1][h2]);
            }

            if (v1 >= 0 && m[v1][h] && camp === m[v1][h].player.camp) {
                Bottom2Top.unshift(m[v1][h]);
            }

            if (v2 < vl && m[v2][h] && camp === m[v2][h].player.camp) {
                Bottom2Top.push(m[v2][h]);
            }

            i++;
        }
        this.arounds['lt2rb'] = leftTop2RightBottom;
        this.arounds['l2r'] = left2Right;
        this.arounds['lb2rt'] = leftBottom2RightTop;
        this.arounds['t2b'] = Bottom2Top;
    };
}