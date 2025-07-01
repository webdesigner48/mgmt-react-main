import React, { useRef, useEffect } from 'react';
import './FloatingDots.css';

interface FloatingDotsProps {
  dropCount: number;
  flowCount: number;
  describtionCount: number;
}

interface DotState {
    element: HTMLDivElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

const FloatingDots: React.FC<FloatingDotsProps> = ({ dropCount, flowCount, describtionCount }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<Array<HTMLDivElement | null>>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.clientWidth === 0) return;

    const dots = dotsRef.current.filter((dot): dot is HTMLDivElement => dot !== null);
    const dotData: DotState[] = dots.map(dot => {
      const size = parseInt(dot.style.width, 10);
      return {
        element: dot,
        x: Math.random() * (container.clientWidth - size),
        y: Math.random() * (container.clientHeight - size),
        vx: (Math.random() - 0.5) * 0.5, // Slow speed
        vy: (Math.random() - 0.5) * 0.5, // Slow speed
        size: size,
      };
    });

    const animate = () => {
        dotData.forEach(data => {
            data.x += data.vx;
            data.y += data.vy;

            // Wall collision
            if (data.x <= 0 || data.x >= container.clientWidth - data.size) {
                data.vx *= -1;
            }
            if (data.y <= 0 || data.y >= container.clientHeight - data.size) {
                data.vy *= -1;
            }

            data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;
        });

        animationFrameId.current = requestAnimationFrame(animate);
    };

    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dropCount, flowCount, describtionCount]);

  const renderDots = (count: number, type: string) => {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(
        <div
          key={`${type}-${i}`}
          ref={el => { 
            if (el && !dotsRef.current.includes(el)) {
                dotsRef.current.push(el);
            }
          }}
          className={`floating-dot ${type}-dot`}
          style={{
            width: type === 'drop' ? '8px' : type === 'flow' ? '12px' : '16px',
            height: type === 'drop' ? '8px' : type === 'flow' ? '12px' : '16px',
          }}
        />
      );
    }
    return result;
  };

  return (
    <div ref={containerRef} className="content-square">
        <div className="ghost-dot"></div>
        {renderDots(dropCount, 'drop')}
        {renderDots(flowCount, 'flow')}
        {renderDots(describtionCount, 'describtion')}
    </div>
  );
};

export default FloatingDots;
