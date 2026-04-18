"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface GraficoProps {
  tipo: "line" | "bar" | "pie" | "doughnut";
  titulo: string;
  dados: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string;
    }[];
  };
  eixoX?: string;
  eixoY?: string;
}

export default function Grafico({ tipo, titulo, dados, eixoX, eixoY }: GraficoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: tipo,
      data: dados,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: dados.datasets.length > 1,
            position: "bottom" as const,
          },
          title: {
            display: !!titulo,
            text: titulo,
            font: { size: 16 },
          },
        },
        scales: tipo !== "pie" && tipo !== "doughnut" ? {
          x: {
            title: {
              display: !!eixoX,
              text: eixoX,
            },
          },
          y: {
            title: {
              display: !!eixoY,
              text: eixoY,
            },
            beginAtZero: true,
          },
        } : undefined,
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [tipo, titulo, dados, eixoX, eixoY]);

  return (
    <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}