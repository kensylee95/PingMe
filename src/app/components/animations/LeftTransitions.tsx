import {easeInOut, motion, Variants } from "framer-motion";

const LeftTransition: React.FC<React.PropsWithChildren<{ children: React.ReactNode; className?: string }>> = ({ children, className }) => {
    const variants:Variants|undefined = {
        initial: {opacity:0, x: "-100%",},
        animate: {opacity:[0,1], x: ["-100%", 0], transition:{ duration: 0.5, ease: easeInOut, delay: 0.15 }},
        exit: {opacity:[1,0], x: [0, "-100%"], transition:{ duration: 0.5, ease: easeInOut, delay: 0.15 } }
    };

    return (
            <motion.div
                className={className}
                initial="initial" // Set the initial state
                animate="animate"
                exit="exit"
                variants={variants}
            >
                {children}
            </motion.div>
    );
};

export default LeftTransition;
