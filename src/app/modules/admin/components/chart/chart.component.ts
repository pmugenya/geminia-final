import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-chart',
    template: `
        <div class="chart-container">
            <canvas #chartCanvas></canvas>
        </div>
    `,
    styles: [`
        .chart-container {
            position: relative;
            height: 100%;
            width: 100%;
        }
    `],
    standalone: true,
    imports: [CommonModule]
})
export class ChartComponent implements OnInit, AfterViewInit {
    @Input() type: 'line' | 'bar' | 'doughnut' | 'pie' = 'line';
    @Input() data: any;
    @Input() options: any;
    @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        // Chart rendering will be implemented here
        // For now, we'll use a simple canvas drawing
        this.renderSimpleChart();
    }

    private renderSimpleChart(): void {
        const canvas = this.chartCanvas.nativeElement;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Simple gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(4, 178, 225, 0.3)');
        gradient.addColorStop(1, 'rgba(4, 178, 225, 0.05)');

        // Draw simple line chart
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        // Sample data points
        const points = [0.7, 0.5, 0.8, 0.6, 0.9, 0.7, 0.85];
        const step = canvas.width / (points.length - 1);
        
        points.forEach((point, index) => {
            const x = index * step;
            const y = canvas.height - (point * canvas.height * 0.8);
            ctx.lineTo(x, y);
        });
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Draw line
        ctx.strokeStyle = '#04b2e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        points.forEach((point, index) => {
            const x = index * step;
            const y = canvas.height - (point * canvas.height * 0.8);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#04b2e1';
        points.forEach((point, index) => {
            const x = index * step;
            const y = canvas.height - (point * canvas.height * 0.8);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
