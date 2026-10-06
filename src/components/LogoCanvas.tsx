import React, { useRef, useState, useEffect } from 'react';
import { LogoProject, LogoElement } from '../types';

interface LogoCanvasProps {
  project: LogoProject;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<LogoElement>) => void;
  onDeleteElement: (id: string) => void;
  zoom: number;
  showGrid: boolean;
}

export const LogoCanvas: React.FC<LogoCanvasProps> = ({
  project,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  zoom,
  showGrid
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState<{ x: number; y: number; w: number; h: number; rot: number }>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    rot: 0
  });

  const selectedElement = project.elements.find(el => el.id === selectedElementId);

  // Keyboard navigation / delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (!selectedElementId || !selectedElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteElement(selectedElementId);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUpdateElement(selectedElementId, { y: selectedElement.y - (e.shiftKey ? 10 : 2) });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onUpdateElement(selectedElementId, { y: selectedElement.y + (e.shiftKey ? 10 : 2) });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onUpdateElement(selectedElementId, { x: selectedElement.x - (e.shiftKey ? 10 : 2) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onUpdateElement(selectedElementId, { x: selectedElement.x + (e.shiftKey ? 10 : 2) });
      } else if (e.key === 'Escape') {
        onSelectElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, selectedElement, onDeleteElement, onUpdateElement, onSelectElement]);

  // Pointer move & up handlers
  const handlePointerDown = (e: React.PointerEvent, element: LogoElement) => {
    e.stopPropagation();
    if (element.locked) return;

    onSelectElement(element.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({
      x: element.x,
      y: element.y,
      w: element.width,
      h: element.height,
      rot: element.rotation
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerDown = (e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    if (!selectedElement || selectedElement.locked) return;

    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({
      x: selectedElement.x,
      y: selectedElement.y,
      w: selectedElement.width,
      h: selectedElement.height,
      rot: selectedElement.rotation
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!selectedElement || selectedElement.locked) return;

    setIsRotating(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({
      x: selectedElement.x,
      y: selectedElement.y,
      w: selectedElement.width,
      h: selectedElement.height,
      rot: selectedElement.rotation
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!selectedElementId || !selectedElement) return;

    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;

    if (isDragging) {
      let newX = Math.round(elementStart.x + dx);
      let newY = Math.round(elementStart.y + dy);

      // Snap to canvas center
      const centerX = project.canvasWidth / 2 - selectedElement.width / 2;
      const centerY = project.canvasHeight / 2 - selectedElement.height / 2;

      if (Math.abs(newX - centerX) < 8) newX = centerX;
      if (Math.abs(newY - centerY) < 8) newY = centerY;

      onUpdateElement(selectedElementId, { x: newX, y: newY });
    } else if (isResizing && resizeHandle) {
      let newW = elementStart.w;
      let newH = elementStart.h;
      let newX = elementStart.x;
      let newY = elementStart.y;

      if (resizeHandle.includes('e')) newW = Math.max(20, elementStart.w + dx);
      if (resizeHandle.includes('s')) newH = Math.max(20, elementStart.h + dy);
      if (resizeHandle.includes('w')) {
        const potentialW = elementStart.w - dx;
        if (potentialW > 20) {
          newW = potentialW;
          newX = elementStart.x + dx;
        }
      }
      if (resizeHandle.includes('n')) {
        const potentialH = elementStart.h - dy;
        if (potentialH > 20) {
          newH = potentialH;
          newY = elementStart.y + dy;
        }
      }

      onUpdateElement(selectedElementId, {
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newW),
        height: Math.round(newH)
      });
    } else if (isRotating) {
      const centerX = elementStart.x + elementStart.w / 2;
      const centerY = elementStart.y + elementStart.h / 2;
      
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const mouseCanvasX = (e.clientX - canvasRect.left) / zoom;
        const mouseCanvasY = (e.clientY - canvasRect.top) / zoom;
        const angleRad = Math.atan2(mouseCanvasY - centerY, mouseCanvasX - centerX);
        let angleDeg = Math.round((angleRad * 180) / Math.PI + 90);
        // Snap to 0, 90, 180, 270 if close
        if (Math.abs(angleDeg % 90) < 5) {
          angleDeg = Math.round(angleDeg / 90) * 90;
        }
        onUpdateElement(selectedElementId, { rotation: angleDeg });
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setResizeHandle(null);
  };

  const sortedElements = [...project.elements]
    .filter(el => el.isVisible)
    .sort((a, b) => a.zIndex - b.zIndex);

  const getElementFilter = (el: LogoElement) => {
    return [
      `brightness(${el.brightness ?? 100}%)`,
      `contrast(${el.contrast ?? 100}%)`,
      `saturate(${el.saturation ?? 100}%)`,
      `hue-rotate(${el.hueRotate ?? 0}deg)`,
      `sepia(${el.sepia ?? 0}%)`,
      `grayscale(${el.grayscale ?? 0}%)`,
      `invert(${el.invert ?? 0}%)`,
      `blur(${el.blur ?? 0}px)`,
      el.shadowColor ? `drop-shadow(${el.shadowOffsetX || 0}px ${el.shadowOffsetY || 4}px ${el.shadowBlur || 8}px ${el.shadowColor})` : ''
    ].filter(Boolean).join(' ');
  };

  return (
    <div
      ref={containerRef}
      onClick={() => onSelectElement(null)}
      className="flex-1 bg-stone-950 overflow-auto flex items-center justify-center p-8 relative select-none"
    >
      {/* Workspace Canvas Frame */}
      <div
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          width: `${project.canvasWidth}px`,
          height: `${project.canvasHeight}px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          backgroundColor: project.background.type === 'solid' ? project.background.color : 'transparent',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
        className={`relative transition-shadow rounded-sm ${
          project.background.type === 'transparent' ? 'bg-checkerboard' : ''
        }`}
      >
        {/* Alignment Grid Overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        )}

        {/* Center Crosshairs */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/10 pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-500/10 pointer-events-none" />

        {/* Render elements */}
        {sortedElements.map((el) => {
          const isSelected = el.id === selectedElementId;
          const filterCss = getElementFilter(el);

          return (
            <div
              key={el.id}
              id={`el-${el.id}`}
              onPointerDown={(e) => handlePointerDown(e, el)}
              style={{
                position: 'absolute',
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                transform: `rotate(${el.rotation}deg)`,
                opacity: el.opacity / 100,
                filter: filterCss,
                cursor: el.locked ? 'default' : 'move',
                zIndex: el.zIndex
              }}
              className="touch-none group"
            >
              {/* Element Content */}
              {el.type === 'text' && (
                <div
                  style={{
                    color: el.fill,
                    fontSize: `${el.fontSize || 32}px`,
                    fontWeight: el.fontWeight || 'normal',
                    textAlign: el.textAlign || 'center',
                    letterSpacing: `${el.letterSpacing || 0}px`,
                    lineHeight: 1.2
                  }}
                  className={`w-full h-full flex items-center justify-center select-none ${el.fontFamily || 'font-jakarta'}`}
                >
                  {el.text}
                </div>
              )}

              {el.type === 'image' && el.imageUrl && (
                <img
                  src={el.imageUrl}
                  alt={el.name}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              )}

              {(el.type === 'symbol' || el.type === 'shape' || el.type === 'badge') && el.svgPath && (
                <svg
                  viewBox={el.viewBox || '0 0 100 100'}
                  className="w-full h-full pointer-events-none"
                  style={{ overflow: 'visible' }}
                >
                  <path
                    d={el.svgPath}
                    fill={el.fill}
                    stroke={el.stroke || 'none'}
                    strokeWidth={el.strokeWidth || 0}
                  />
                </svg>
              )}

              {/* Selection Box & Transform Handles */}
              {isSelected && !el.locked && (
                <div className="absolute inset-0 border-2 border-emerald-400 pointer-events-none ring-1 ring-emerald-950/50">
                  {/* Rotation handle on top */}
                  <div
                    onPointerDown={handleRotatePointerDown}
                    style={{ left: '50%', top: '-24px', transform: 'translateX(-50%)' }}
                    className="absolute w-4 h-4 rounded-full bg-emerald-400 border-2 border-stone-900 cursor-grab pointer-events-auto hover:scale-125 transition-transform"
                    title="Drag to rotate"
                  />
                  <div
                    style={{ left: '50%', top: '-14px', transform: 'translateX(-50%)' }}
                    className="absolute w-0.5 h-3 bg-emerald-400 pointer-events-none"
                  />

                  {/* 8 Resizing handles */}
                  {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((handle) => {
                    let positionStyle: React.CSSProperties = {};
                    if (handle === 'nw') positionStyle = { top: -4, left: -4 };
                    if (handle === 'ne') positionStyle = { top: -4, right: -4 };
                    if (handle === 'sw') positionStyle = { bottom: -4, left: -4 };
                    if (handle === 'se') positionStyle = { bottom: -4, right: -4 };
                    if (handle === 'n') positionStyle = { top: -4, left: '50%', transform: 'translateX(-50%)' };
                    if (handle === 's') positionStyle = { bottom: -4, left: '50%', transform: 'translateX(-50%)' };
                    if (handle === 'w') positionStyle = { left: -4, top: '50%', transform: 'translateY(-50%)' };
                    if (handle === 'e') positionStyle = { right: -4, top: '50%', transform: 'translateY(-50%)' };

                    return (
                      <div
                        key={handle}
                        onPointerDown={(e) => handleResizePointerDown(e, handle)}
                        style={positionStyle}
                        className="absolute w-2.5 h-2.5 bg-white border border-emerald-500 rounded-sm pointer-events-auto cursor-nwse-resize hover:scale-125"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
