import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Ducky from "../img/Ducky.png";
import MrDucky from "../img/MrDucky.png";
import Image from "next/image";


interface AnimatedCursorProps {
  targetX: number,
  targetY: number,
  selectedAvatar: string,
}
export const AnimatedCursor = ({ targetX, targetY, selectedAvatar }: AnimatedCursorProps) => {
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [active, setActive] = useState(false)

  const props = useSpring({
    to: { left: `${targetX}px`, top: `${targetY}px` },
    from: { left: `${currentX}px`, top: `${currentY}px` },
    config: { duration: 500 },
  });

  console.log(selectedAvatar)
  const avatarImageSrc = selectedAvatar === "ducky" ? Ducky : MrDucky;

  return (
    <animated.div
      style={{ ...props }}
      className="z-20 absolute"
    >
      <Image
        src={Ducky}
        alt="Ducky"
        className="mx-3 h-7 w-10 object-contain"
      />
    </animated.div>
  );
}