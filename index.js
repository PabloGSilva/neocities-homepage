const widthX = 1500;
const widthY = 500;
const wallThickness = 80;

const MIN_SPEED = 0.05;
const DRIFT_FORCE = 0.0001;
const CHECK_INTERVAL = 15;

var Example = Example || {};

const albums = [
    {
        "albumCover": "https://f4.bcbits.com/img/a3409719243_10.jpg",
        "albumUrl": "https://therealmightymagician.bandcamp.com/album/well-make-it-someday",
        "albumName": "We'll Make It Someday",
        "albumGenres": ["Instrumental Hip Hop", "Cloud Rap"]
    }, {
        "albumCover": "https://f4.bcbits.com/img/a0251668676_10.jpg",
        "albumUrl": "https://therealmightymagician.bandcamp.com/album/assorted-machine-music",
        "albumName": "Assorted Machine Music",
        "albumGenres": ["Electronica", "IDM"]
    }, {
        "albumCover": "https://f4.bcbits.com/img/a0441114245_10.jpg",
        "albumUrl": "https://therealmightymagician.bandcamp.com/album/copper-wires-and-electricity-for-the-expression-of-nothing",
        "albumName": "Copper Wires for the Expression of Nothing",
        "albumGenres": ["Hardcore Electronic", "Breakcore"]
    }, {
        "albumCover": "https://f4.bcbits.com/img/a4029652682_10.jpg",
        "albumUrl": "https://therealmightymagician.bandcamp.com/album/discomfort-says-it-all",
        "albumName": "Discomfort Says It All",
        "albumGenres": ["Alternative Rock", "Dream Pop"]
    }, {
        "albumCover": "https://f4.bcbits.com/img/a0437579972_10.jpg",
        "albumUrl": "https://therealmightymagician.bandcamp.com/album/another-night-at-the-comfort-of-home",
        "albumName": "Another Night at the Comfort of Home",
        "albumGenres": ["House", "Dream Trance", "Progressive Techno"]
    },
]

function getSceneSize() {
    const el = document.getElementById('bumpy-div');
    if (el) {
        const rect = el.getBoundingClientRect();
        console.log(rect);
        return {
            width: Math.floor(rect.width || window.innerWidth),
            height: Math.floor(rect.height || window.innerHeight)
        };
    }
    console.log("window");
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function debounce(fn, wait = 150) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}

const rows = 1;
const columns = albums.length;

let stack = null;

Example.gyro = async function () {

    let { width: widthX, height: widthY } = getSceneSize();

    // tamanho do bloco calculado dinamicamente
    // garante que todos os blocks caibam, adicionando “2 colunas/linhas” de margem
    let sizeBlock = Math.floor(Math.min(
        widthX / (columns + 3),
        widthY / (rows + 3)
    ));

    // (opcional) limite máximo do bloco pra não ficar gigante em telas muito grandes
    sizeBlock = Math.min(sizeBlock, 200);

    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Events = Matter.Events,
        Body = Matter.Body;

    var engine = Engine.create(),
        world = engine.world;

    var render = Render.create({
        element: document.getElementById('bumpy-div'),
        engine: engine,
        options: {
            width: widthX,
            height: widthY,
            wireframes: false, // Para ver texturas
            background: '#222'
        }
    });

    Render.run(render);

    var runner = Runner.create();
    Runner.run(runner, engine);

    // Criar os blocos com capas
    let indexAlbum = 0;
    stack = Composites.stack(
        widthX / 2 - ((sizeBlock * columns) / 2),
        widthY / 2 - ((sizeBlock * rows) / 2),
        columns,
        rows,
        1,
        1,
        function (x, y) {
            const album = albums[indexAlbum % albums.length];
            indexAlbum++;

            return Bodies.rectangle(x, y, sizeBlock, sizeBlock, {
                restitution: 1,
                frictionAir: 0.02,
                friction: 0,
                frictionStatic: 0,
                render: {
                    sprite: {
                        texture: album.albumCover,
                        xScale: sizeBlock / 1000,
                        yScale: sizeBlock / 1000
                    }
                },
                plugin: {
                    albumData: album
                }
            });
        }
    );

    shuffleStack();

    Composite.add(world, [
        stack,
        Bodies.rectangle(widthX / 2, 0, widthX, wallThickness, { isStatic: true, restitution: 1 }),
        Bodies.rectangle(widthX / 2, widthY, widthX, wallThickness, { isStatic: true, restitution: 1 }),
        Bodies.rectangle(widthX, widthY / 2, wallThickness, widthY, { isStatic: true, restitution: 1 }),
        Bodies.rectangle(0, widthY / 2, wallThickness, widthY, { isStatic: true, restitution: 1 })
    ]);

    engine.gravity.y = 0;
    engine.gravity.x = 0;

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: widthX, y: widthY }
    });

    const BOOST = 0.0005; // ajuste fino

    Events.on(engine, 'afterUpdate', () => {
        for (const b of stack.bodies) {
            const vx = b.velocity.x;
            const vy = b.velocity.y;
            const speed = Math.hypot(vx, vy);
            if (speed < 0.01) {
                const f = BOOST * b.mass;
                Body.applyForce(b, b.position, {
                    x: (vx / speed) * f,
                    y: (vy / speed) * f
                });
            }
        }
    });

    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

function shuffleStack(amplifier = 0.2) {
    stack.bodies.forEach(body => {
        const forceMagnitude = amplifier * body.mass;
        Matter.Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * forceMagnitude,
            y: (Math.random() - 0.5) * forceMagnitude
        });
    });
}

Example.gyro.title = 'Gyroscope';
Example.gyro.for = '>=0.14.2';
Example.gyro();