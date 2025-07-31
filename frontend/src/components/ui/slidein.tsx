import { useEffect, useRef, useState } from 'react';

export default function SlideInSection({ children, delay = '0ms', className = '' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ${
        isVisible ? 'animate-slidein opacity-100' : 'opacity-0'
      } ${className}`}
      style={{ '--slidein-delay': "0ms" }}
    >
      {children}
    </div>
  );
}

