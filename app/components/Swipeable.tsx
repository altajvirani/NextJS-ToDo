import React, { useState } from "react";

interface SwipeableProps {
  swipeDirection: string;
  onSwipe: (...args: any[]) => void;
  onSwipeArgs?: any[] | null;
  minXDistance?: number;
  minYDistance?: number;
  maxXDistance?: number;
  maxYDistance?: number;
  className?: string;
  children: React.ReactNode;
}

const Swipeable: React.FunctionComponent<SwipeableProps> = ({
  swipeDirection,
  onSwipe,
  onSwipeArgs = null,
  minXDistance = 50,
  minYDistance = 50,
  maxXDistance = 50,
  maxYDistance = 50,
  className,
  children,
}: SwipeableProps) => {
  interface Coords {
    x: number;
    y: number;
  }

  const [touchStart, setTouchStart] = useState<Coords | null>(null);
  const [touchEnd, setTouchEnd] = useState<Coords | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    } as Coords);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    } as Coords);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;

    const isTopSwipe = distanceY > minYDistance && distanceX < maxXDistance;
    const isLeftSwipe = distanceX > minXDistance && distanceY < maxYDistance;
    const isBottomSwipe =
      distanceY < -minYDistance && distanceX > -maxXDistance;
    const isRightSwipe = distanceX < -minXDistance && distanceY > -maxYDistance;

    const mapSwipesToAction = [
      {
        name: "top",
        isSwiped: isTopSwipe,
      },
      {
        name: "left",
        isSwiped: isLeftSwipe,
      },
      {
        name: "bottom",
        isSwiped: isBottomSwipe,
      },
      {
        name: "right",
        isSwiped: isRightSwipe,
      },
      {
        name: "x",
        isSwiped: isLeftSwipe || isRightSwipe,
      },
      {
        name: "y",
        isSwiped: isTopSwipe || isBottomSwipe,
      },
    ];

    mapSwipesToAction.forEach((direction) =>
      swipeDirection === direction.name && direction.isSwiped
        ? onSwipeArgs
          ? onSwipe(...onSwipeArgs)
          : onSwipe()
        : null
    );
  };

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
};

export default Swipeable;
