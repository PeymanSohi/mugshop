import React, { useEffect, useState } from 'react';
import { Coffee } from 'lucide-react';

const AnimatedBackground: React.FC = () => {
  const [shapes, setShapes] = useState<Array<{
    id: number;
    size: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);

  const [mugs, setMugs] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    rotation: number;
  }>>([]);

  const [coffeeBeans, setCoffeeBeans] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
  }>>([]);

  const [steamElements, setSteamElements] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Generate floating shapes
    const newShapes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 50,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    }));

    // Generate floating mugs
    const newMugs = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      rotation: Math.random() * 360
    }));

    // Generate coffee beans
    const newCoffeeBeans = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6
    }));

    // Generate steam elements
    const newSteamElements = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4
    }));

    setShapes(newShapes);
    setMugs(newMugs);
    setCoffeeBeans(newCoffeeBeans);
    setSteamElements(newSteamElements);
  }, []);

  return (
    <div className="animated-background">
      {/* Floating gradient shapes */}
      {shapes.map((shape) => (
        <div
          key={`shape-${shape.id}`}
          className="bg-shape animate-float"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.left}%`,
            top: `${shape.top}%`,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${shape.duration}s`
          }}
        />
      ))}

      {/* Floating mug icons */}
      {mugs.map((mug) => (
        <div
          key={`mug-${mug.id}`}
          className="bg-mug animate-drift"
          style={{
            left: `${mug.left}%`,
            top: `${mug.top}%`,
            animationDelay: `${mug.delay}s`,
            transform: `rotate(${mug.rotation}deg)`
          }}
        >
          <Coffee />
        </div>
      ))}

      {/* Coffee beans */}
      {coffeeBeans.map((bean) => (
        <div
          key={`bean-${bean.id}`}
          className="bg-coffee-bean animate-float-reverse"
          style={{
            left: `${bean.left}%`,
            top: `${bean.top}%`,
            animationDelay: `${bean.delay}s`
          }}
        />
      ))}

      {/* Steam effects */}
      {steamElements.map((steam) => (
        <div
          key={`steam-${steam.id}`}
          className="bg-steam animate-coffee-steam"
          style={{
            left: `${steam.left}%`,
            top: `${steam.top}%`,
            animationDelay: `${steam.delay}s`
          }}
        />
      ))}

      {/* Pulsing glow effects */}
      <div 
        className="absolute w-96 h-96 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
          top: '10%',
          right: '10%'
        }}
      />
      
      <div 
        className="absolute w-80 h-80 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)',
          bottom: '20%',
          left: '15%',
          animationDelay: '2s'
        }}
      />

      <div 
        className="absolute w-64 h-64 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animationDelay: '4s'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;