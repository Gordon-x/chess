

function App(config) {
    let c = config;

    this.init = function () {
        let p = new Plate(c);

        let firstPlayer = new Player({
            name: 'gordon',
            type: TYPE_HUMAN,
            camp: CAMP_BLACK,
        });
        let secondPlayer = new Player({
            name: 'smith',
            type: TYPE_AI,
            camp: CAMP_WHITE,
        });

        let ctrl = new Controller({
            all: [firstPlayer, secondPlayer],
        });

        let fireArea = new FireArea(p);

        let ai = new AI({
            plate: p,
            fire: fireArea,
        });

        let pe = new PlayEvent([p, ctrl, this, ai, fireArea]);
    }
}