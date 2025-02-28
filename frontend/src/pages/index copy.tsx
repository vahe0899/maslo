import Matter, { Bodies, Composites, Constraint, Engine, Render, World } from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';

const IndexPage = () => {
    const sceneRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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
                background: '#111',
                pixelRatio: dpr,
            },
        });

        const ground = Bodies.rectangle(dimensions.width / 2, dimensions.height - 10, dimensions.width, 20, {
            isStatic: true,
        });

        const pancake = Composites.stack(500, 0, 10, 1, 0, 0, (x: number, y: number) => {
            return Bodies.rectangle(x, y, 30, 42, {
                restitution: 0.4,
                render: {
                    sprite: {
                        texture: '/img/pancake-round-corners.png',
                        xScale: 0.1,
                        yScale: 0.08,
                    },
                },
            });
        });

        Composites.chain(pancake, 0.5, 0, -0.5, 0, {
            stiffness: 1.1,
            length: 0.1,
            damping: 0.1,
            render: {
                visible: false,
            },
        });

        const box = Bodies.rectangle(dimensions.width / 2, 200, 50, 50);

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

        Composite.add(engine.world, [box, ground, pancake]);
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

    return (
        <DefaultLayout>
            <div ref={sceneRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}></div>
        </DefaultLayout>
    );
};

export default IndexPage;
