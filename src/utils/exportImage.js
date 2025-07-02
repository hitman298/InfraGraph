import { toPng, toSvg } from 'html-to-image';

export const exportCanvasAsImage = async (canvasRef, format = 'png') => {
  if (!canvasRef.current) return;

  try {
    const dataUrl = format === 'svg'
      ? await toSvg(canvasRef.current)
      : await toPng(canvasRef.current, { cacheBust: true });

    const link = document.createElement('a');
    link.download = `diagram.${format}`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('🛑 Export failed:', error);
  }
};
