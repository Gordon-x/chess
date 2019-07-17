/**
 *
 * @constructor
 */
function FireArea(plateObj)
{
    let m = plateObj.getMatrix();

    //反向数值初始化，第一次赋值进行校正。
    this.maxV = 0;

    this.maxH = 0;

    this.minV = m.length;

    this.minH = m[0].length;
}