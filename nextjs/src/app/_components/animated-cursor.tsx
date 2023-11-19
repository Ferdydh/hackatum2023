import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Ducky from "../img/Ducky.png";
import Image from "next/image";

type CommandType = "NewFile" | "OpenFile" | "TerminalExecute"

interface AnimatedCursorProps {
  command: { commandType: CommandType, full_path: string },
}
export const AnimatedCursor = ({ command }: AnimatedCursorProps) => {
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [active, setActive] = useState(false)

  const [targetX, setTargetX] = useState(0)
  const [targetY, setTargetY] = useState(0)


  useEffect(() => {
    let rect;

    switch (command.commandType) {
      case "NewFile":
        rect = document.getElementById("file-add")?.getBoundingClientRect()
        break;
      case "OpenFile":
        rect = document.getElementById(command.full_path)?.getBoundingClientRect()
        break;
      case "TerminalExecute":
        rect = document.getElementById("terminal")?.getBoundingClientRect()
        break;
      default:
        break;
    }

    setTargetX(rect?.x || 0)
    setTargetY(rect?.y || 0)
  }, [command])


  const props = useSpring({
    to: { left: `${targetX}px`, top: `${targetY}px` },
    from: { left: `${currentX}px`, top: `${currentY}px` },
    config: { duration: 500 },
  });

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