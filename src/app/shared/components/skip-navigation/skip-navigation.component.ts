/**
 * Skip Navigation Component
 * WCAG 2.1 - Criterion 2.4.1 Bypass Blocks (Level A)
 * Allows keyboard users to skip repetitive navigation
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skip-navigation',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="skip-navigation">
            <a href="#main-content" class="skip-link">
                Skip to main content
            </a>
            <a href="#navigation" class="skip-link">
                Skip to navigation
            </a>
            <a href="#footer" class="skip-link">
                Skip to footer
            </a>
        </div>
    `,
    styles: [`
        .skip-navigation {
            position: relative;
            z-index: 9999;
        }

        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: #000;
            color: #fff;
            padding: 8px 16px;
            text-decoration: none;
            font-weight: 600;
            border-radius: 0 0 4px 0;
            z-index: 10000;
            transition: top 0.2s ease-in-out;
        }

        .skip-link:focus {
            top: 0;
            outline: 3px solid #0066cc;
            outline-offset: 2px;
        }

        .skip-link:hover {
            background: #333;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .skip-link {
                border: 2px solid #fff;
            }
        }
    `]
})
export class SkipNavigationComponent {}
