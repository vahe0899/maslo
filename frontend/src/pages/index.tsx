import Matter, { Bodies, Body, Composite, Composites, Constraint, Engine, Events, Render, World } from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import { useWatchingYou } from 'react-watching-you';
import WatchingYou from 'react-watching-you';
import DefaultLayout from '@/components/layout/DefaultLayout';
import FullscreenLottie from '@/components/shared/FullScreenLottie';

const IndexPage = () => {
    const sceneRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [won, setWon] = useState(false);
    const [hitCount, setHitCount] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [chewing, setChewing] = useState(false);
    const engineRef = useRef<Matter.Engine | null>(null);
    const pancakeRef = useRef<Composite | null>(null);
    const [showLottie, setShowLottie] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateDimensions = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!sceneRef.current) return;
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        const dpr = window.devicePixelRatio || 1;

        const engine = Engine.create();
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: dimensions.width,
                height: dimensions.height,
                wireframes: false,
                background: 'transparent',
                pixelRatio: dpr,
            },
        });

        const ground = Bodies.rectangle(dimensions.width / 2, dimensions.height + 100, 5000, 20, {
            isStatic: true,
        });

        pancakeRef.current = Composites.stack(100, 0, 10, 1, 0, 0, (x: number, y: number) => {
            return Bodies.rectangle(x, y, 8, 10, {
                restitution: 0.4,
                render: {
                    sprite: {
                        texture: '/img/pancake-round-corners.png',
                        xScale: 0.025,
                        yScale: 0.02,
                    },
                },
            });
        });

        const mouth = Bodies.rectangle(dimensions.width / 2, dimensions.height / 2 - 80, 100, 70, {
            isStatic: true,
            isSensor: true, // Сенсорный объект, чтобы блин не отскакивал
            render: { fillStyle: 'transparent' },
        });

        const panWidth = 300;
        const panHeight = 40;
        const pivotX = 100 - panWidth / 2; // Левый край сковородки
        const pivotY = dimensions.height - 300; // Высота сковородки

        // Сковородка
        const pan = Bodies.rectangle(pivotX + panWidth / 2, pivotY, panWidth, panHeight, {
            isStatic: false,
            // friction: 0.9,
            density: 0.1, // Лёгкость для импульса
            render: {
                fillStyle: 'gray',
            },
        });

        // Фиксированная точка (ось вращения)
        const pivot = Bodies.circle(pivotX, pivotY, 5, { isStatic: true, render: { fillStyle: 'red' } });

        // Шарнирное соединение
        const hinge = Constraint.create({
            bodyA: pivot,
            bodyB: pan,
            pointA: { x: 0, y: 0 },
            pointB: { x: -panWidth / 2, y: 0 }, // Прикрепляем сковородку за край
            stiffness: 1,
            damping: 0.3,
            length: 0,
        });

        let isHoldingSpace = false;

        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                isHoldingSpace = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.code === 'Space') {
                isHoldingSpace = false;
            }
        });

        Events.on(engine, 'beforeUpdate', () => {
            const minAngle = -Math.PI / 4; // -90° вниз
            const maxAngle = Math.PI / 5; // +20° вверх
            const liftSpeed = 0.15; // Скорость подъёма

            if (isHoldingSpace) {
                // Поднимаем сковородку
                if (pan.angle > minAngle) {
                    Body.setAngularVelocity(pan, -liftSpeed);
                } else {
                    Body.setAngle(pan, minAngle); // Фиксируем в максимальном положении
                    Body.setAngularVelocity(pan, 0);
                }
            } else {
                // Опускаем сковородку
                if (pan.angle < maxAngle) {
                    Body.setAngularVelocity(pan, liftSpeed);
                } else {
                    Body.setAngle(pan, maxAngle); // Фиксируем в нижнем положении
                    Body.setAngularVelocity(pan, 0);
                }
            }
        });

        Events.on(engine, 'collisionStart', (event) => {
            event.pairs.forEach(({ bodyA, bodyB }) => {
                if (
                    (bodyA === mouth || bodyB === mouth) &&
                    (pancakeRef.current?.bodies.includes(bodyA) || pancakeRef.current?.bodies.includes(bodyB))
                ) {
                    // Удаляем блин
                    pancakeRef.current?.bodies.forEach((body) => World.remove(engine.world, body));
                    World.remove(engine.world, pancakeRef.current);

                    // Увеличиваем счётчик попаданий
                    setHitCount((prev) => prev + 1);

                    // Запускаем анимацию жевания
                    startChewing();

                    // Генерируем новый блин
                    if (hitCount < 5) {
                        generateNewPancake();
                    }
                } else if (
                    (bodyA === ground || bodyB === ground) &&
                    (pancakeRef.current?.bodies.includes(bodyA) || pancakeRef.current?.bodies.includes(bodyB))
                ) {
                    pancakeRef.current?.bodies.forEach((body) => World.remove(engine.world, body));
                    World.remove(engine.world, pancakeRef.current);
                    generateNewPancake();
                }
            });
        });

        const startChewing = () => {
            setChewing(true);
            setTimeout(() => setChewing(false), 1000); // Жуем 1 секунду
        };

        const generateNewPancake = () => {
            const newPancake = Composites.stack(100, 50, 10, 1, 0, 0, (x: number, y: number) => {
                return Bodies.rectangle(x, y, 8, 10, {
                    restitution: 0.4,
                    render: {
                        sprite: {
                            texture: '/img/pancake-round-corners.png',
                            xScale: 0.025,
                            yScale: 0.02,
                        },
                    },
                });
            });

            Composites.chain(newPancake, 0.5, 0, -0.5, 0, {
                stiffness: 1.1,
                length: 0.1,
                damping: 0.1,
                render: {
                    visible: false,
                },
            });

            // Добавляем новый блин в мир
            World.add(engine.world, newPancake);

            // Обновляем ссылку на новый блин
            pancakeRef.current = newPancake;
        };

        Composites.chain(pancakeRef.current, 0.5, 0, -0.5, 0, {
            stiffness: 1.1,
            length: 0.1,
            damping: 0.1,
            render: {
                visible: false,
            },
        });

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false,
                },
            },
        });
        World.add(engine.world, mouseConstraint);

        render.mouse = mouse;

        World.add(engine.world, [
            // ground,
            pancakeRef.current,
            // platform,
            pivot,
            ground,
            pan,
            hinge,
            mouth,
        ]);
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        return () => {
            Matter.Render.stop(render);
            Matter.World.clear(engine.world, true);
            Matter.Engine.clear(engine);
            render.canvas.remove();
        };
    }, [dimensions]);

    useEffect(() => {
        if (hitCount >= 5) {
            setShowLottie(true);
            setTimeout(() => {
                setShowModal(true);
                setTimeout(() => setModalVisible(true), 10); // Небольшая задержка для плавности
            }, 1500);

            // Останавливаем физический движок
            if (engineRef.current) {
                Matter.Engine.clear(engineRef.current);
            }
        }
    }, [hitCount]);

    const eyesPower = { x: 14, y: 25 };

    return (
        <DefaultLayout>
            <div className="game-wrapper">
                <div
                    style={{
                        opacity: showLottie ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        position: 'absolute',
                        width: '100vw',
                        height: '100vh',
                        top: 0,
                        left: 0,
                    }}
                >
                    <FullscreenLottie />
                </div>{' '}
                <div ref={sceneRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}></div>
                <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: 24 }}>
                    Попаданий: {hitCount} {won && '🎉 Победа!'}
                </div>
                {isClient && (
                    <div className="eyes-container">
                        <div className="eye-white">
                            <WatchingYou rotatable={false} power={eyesPower}>
                                <div className="eye-brown">
                                    <div className="eye-black">
                                        <div className="eye-white-small"></div>
                                    </div>
                                </div>
                            </WatchingYou>
                        </div>
                        <div className="eye-white">
                            <WatchingYou rotatable={false} power={eyesPower}>
                                <div className="eye-brown">
                                    <div className="eye-black">
                                        <div className="eye-white-small"></div>
                                    </div>
                                </div>
                            </WatchingYou>
                        </div>
                    </div>
                )}
                <div className={`mouth ${chewing ? 'chewing' : ''}`}>
                    <div className="teeth">
                        <div className="tooth"></div>
                        <div className="tooth"></div>
                        <div className="tooth"></div>
                    </div>
                    <div className="bottom-teeth">
                        <div className="tooth"></div>
                        <div className="tooth"></div>
                        <div className="tooth"></div>
                        <div className="tooth"></div>
                    </div>
                </div>
                {showModal && (
                    <div className="modal-overlay">
                        <div className={`modal ${modalVisible ? 'visible' : ''}`}>
                            <h2>🎉 Поздравляем с Масленицей! 🥞</h2>
                            <p>Ты попал 5 раз! Ура!</p>
                            <button onClick={() => window.location.reload()}>Играть снова</button>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default IndexPage;
