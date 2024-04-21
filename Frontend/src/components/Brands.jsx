import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import { wrap } from "@motionone/utils";

function ParallaxText({ children, baseVelocity = 100 }) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="parallax overflow-x-auto" style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
            <motion.div className="scroller  " style={{ x }}>
                <span className="w-2/3 justify-self-center ">{children} </span>
                <span className="w-2/3 justify-self-center">{children} </span>
                <span className="w-2/3 justify-self-center">{children} </span>
                <span className="w-2/3 justify-self-center">{children} </span>
            </motion.div>
        </div>
    );
}

export default function Brands() {
    return (
        <div className="flex flex-col items-center justify-center px-20">
            <p className="font-rubikmonoone text-orange-500 text-3xl pt-2">BRANDS</p>
            <ParallaxText baseVelocity={-5}>
                <div className="grid grid-cols-6 gap-5 px-3 items-center">
                    <img src="/assets/images/brands/adidas.png" />
                    <img src="/assets/images/brands/bitis.png" />
                    <img src="/assets/images/brands/Lining.png" />
                    <img src="/assets/images/brands/NB.png" />
                    <img src="/assets/images/brands/nike.png" />
                    <img src="/assets/images/brands/Yonex.png" />
                </div>
            </ParallaxText>
        </div>
    );
}
