const widthX = 1200;
const widthY = 650;
const sizeBlock = 150;

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
    },
]

const rows = 1;
const columns = albums.length;

Example.gyro = async function () {

    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies;

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
    const stack = Composites.stack(
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
                        xScale: sizeBlock / 1200,
                        yScale: sizeBlock / 1200
                    }
                },
                plugin: {
                    albumData: album
                }
            });
        }
    );

    // Dar impulso inicial aos blocos
    stack.bodies.forEach(body => {
        const forceMagnitude = 0.1 * body.mass;
        Matter.Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * forceMagnitude,
            y: (Math.random() - 0.5) * forceMagnitude
        });
    });

    const wallThickness = 60;
    Composite.add(world, [
        stack,
        Bodies.rectangle(widthX / 2, 0, widthX, wallThickness, { isStatic: true, restitution: 1 }),
        Bodies.rectangle(widthX / 2, widthY, widthX, wallThickness, { isStatic: true, restitution: 1 }),
        Bodies.rectangle(widthX, widthY / 2, wallThickness, widthY, { isStatic: true, restitution: 1 }),
        Bodies.rectangle(0, widthY / 2, wallThickness, widthY, { isStatic: true, restitution: 1 })
    ]);

    engine.gravity.y = 0;
    engine.gravity.x = 0;

    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: widthX, y: widthY }
    });

    const playArea = {
        min: { x: wallThickness / 2, y: wallThickness / 2 },
        max: { x: widthX - wallThickness / 2, y: widthY - wallThickness / 2 }
    };

    const halfBlock = sizeBlock / 2;

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    Events.on(engine, 'beforeUpdate', () => {
        // 1) trava o mouse dentro da área
        const m = mouseConstraint.mouse;
        m.position.x = clamp(m.position.x, playArea.min.x, playArea.max.x);
        m.position.y = clamp(m.position.y, playArea.min.y, playArea.max.y);

        // 2) garante que os bodies fiquem dentro
        for (const b of stack.bodies) {
            let x = b.position.x;
            let y = b.position.y;

            const minX = playArea.min.x + halfBlock;
            const maxX = playArea.max.x - halfBlock;
            const minY = playArea.min.y + halfBlock;
            const maxY = playArea.max.y - halfBlock;

            let fixX = false, fixY = false;

            if (x < minX) { x = minX; fixX = true; }
            if (x > maxX) { x = maxX; fixX = true; }
            if (y < minY) { y = minY; fixY = true; }
            if (y > maxY) { y = maxY; fixY = true; }

            if (fixX || fixY) {
                Body.setPosition(b, { x, y });

                // zera a velocidade no(s) eixo(s) que encostou pra não “tremer”
                Body.setVelocity(b, {
                    x: fixX ? 0 : b.velocity.x,
                    y: fixY ? 0 : b.velocity.y
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

Example.gyro.title = 'Gyroscope';
Example.gyro.for = '>=0.14.2';
Example.gyro();