/**
 * SEO Service
 * Manages dynamic meta tags, structured data, and SEO optimization
 * Implements Google's SEO best practices
 */

import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface PageMetadata {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
}

export interface StructuredData {
    '@context': string;
    '@type': string;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private readonly defaultTitle = 'Geminia Insurance - Marine & Travel Insurance';
    private readonly defaultDescription = 'Get instant quotes for marine cargo and travel insurance. Comprehensive coverage, competitive rates, and fast claims processing.';
    private readonly defaultImage = '/assets/images/og-image.png';
    private readonly siteUrl = 'https://yoursite.com';

    constructor(
        private meta: Meta,
        private titleService: Title,
        @Inject(DOCUMENT) private document: Document
    ) {}

    /**
     * Update page metadata for SEO
     * @param metadata - Page metadata object
     */
    updateMetadata(metadata: Partial<PageMetadata>): void {
        const pageMetadata: PageMetadata = {
            title: metadata.title || this.defaultTitle,
            description: metadata.description || this.defaultDescription,
            keywords: metadata.keywords || 'insurance, marine insurance, travel insurance, cargo insurance',
            image: metadata.image || this.defaultImage,
            url: metadata.url || this.siteUrl,
            type: metadata.type || 'website',
            author: metadata.author,
            publishedTime: metadata.publishedTime,
            modifiedTime: metadata.modifiedTime
        };

        // Update title
        this.titleService.setTitle(pageMetadata.title);

        // Update standard meta tags
        this.meta.updateTag({ name: 'description', content: pageMetadata.description });
        this.meta.updateTag({ name: 'keywords', content: pageMetadata.keywords });
        this.meta.updateTag({ name: 'author', content: pageMetadata.author || 'Geminia Insurance' });

        // Update Open Graph meta tags (Facebook, LinkedIn)
        this.meta.updateTag({ property: 'og:title', content: pageMetadata.title });
        this.meta.updateTag({ property: 'og:description', content: pageMetadata.description });
        this.meta.updateTag({ property: 'og:image', content: pageMetadata.image });
        this.meta.updateTag({ property: 'og:url', content: pageMetadata.url });
        this.meta.updateTag({ property: 'og:type', content: pageMetadata.type });
        this.meta.updateTag({ property: 'og:site_name', content: 'Geminia Insurance' });

        // Update Twitter Card meta tags
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: pageMetadata.title });
        this.meta.updateTag({ name: 'twitter:description', content: pageMetadata.description });
        this.meta.updateTag({ name: 'twitter:image', content: pageMetadata.image });

        // Article specific meta tags
        if (pageMetadata.type === 'article') {
            if (pageMetadata.publishedTime) {
                this.meta.updateTag({ property: 'article:published_time', content: pageMetadata.publishedTime });
            }
            if (pageMetadata.modifiedTime) {
                this.meta.updateTag({ property: 'article:modified_time', content: pageMetadata.modifiedTime });
            }
            if (pageMetadata.author) {
                this.meta.updateTag({ property: 'article:author', content: pageMetadata.author });
            }
        }

        // Update canonical URL
        this.updateCanonicalUrl(pageMetadata.url);
    }

    /**
     * Add structured data (JSON-LD) to page
     * @param data - Structured data object
     */
    addStructuredData(data: StructuredData): void {
        const script = this.document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        script.id = 'structured-data';

        // Remove existing structured data
        const existing = this.document.getElementById('structured-data');
        if (existing) {
            existing.remove();
        }

        this.document.head.appendChild(script);
    }

    /**
     * Add organization structured data
     */
    addOrganizationSchema(): void {
        const organizationSchema: StructuredData = {
            '@context': 'https://schema.org',
            '@type': 'InsuranceAgency',
            'name': 'Geminia Insurance',
            'description': 'Marine cargo and travel insurance provider',
            'url': this.siteUrl,
            'logo': `${this.siteUrl}/assets/images/logo.png`,
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+254-XXX-XXXXXX',
                'contactType': 'Customer Service',
                'areaServed': 'KE',
                'availableLanguage': ['English', 'Swahili']
            },
            'address': {
                '@type': 'PostalAddress',
                'addressCountry': 'KE',
                'addressLocality': 'Nairobi'
            },
            'sameAs': [
                'https://facebook.com/geminia',
                'https://twitter.com/geminia',
                'https://linkedin.com/company/geminia'
            ]
        };

        this.addStructuredData(organizationSchema);
    }

    /**
     * Add product structured data for insurance products
     * @param productName - Name of the insurance product
     * @param description - Product description
     * @param price - Product price
     */
    addProductSchema(productName: string, description: string, price?: number): void {
        const productSchema: StructuredData = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': productName,
            'description': description,
            'brand': {
                '@type': 'Brand',
                'name': 'Geminia Insurance'
            },
            'offers': {
                '@type': 'Offer',
                'priceCurrency': 'KES',
                'price': price || 0,
                'availability': 'https://schema.org/InStock',
                'url': this.siteUrl
            }
        };

        this.addStructuredData(productSchema);
    }

    /**
     * Add breadcrumb structured data
     * @param breadcrumbs - Array of breadcrumb items
     */
    addBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): void {
        const breadcrumbSchema: StructuredData = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'name': crumb.name,
                'item': `${this.siteUrl}${crumb.url}`
            }))
        };

        this.addStructuredData(breadcrumbSchema);
    }

    /**
     * Add FAQ structured data
     * @param faqs - Array of FAQ items
     */
    addFAQSchema(faqs: Array<{ question: string; answer: string }>): void {
        const faqSchema: StructuredData = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer
                }
            }))
        };

        this.addStructuredData(faqSchema);
    }

    /**
     * Update canonical URL
     * @param url - Canonical URL
     */
    private updateCanonicalUrl(url: string): void {
        let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
        
        if (!link) {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.document.head.appendChild(link);
        }
        
        link.setAttribute('href', url);
    }

    /**
     * Remove all structured data
     */
    removeStructuredData(): void {
        const script = this.document.getElementById('structured-data');
        if (script) {
            script.remove();
        }
    }

    /**
     * Generate meta tags for social sharing
     * @param metadata - Page metadata
     */
    generateSocialMetaTags(metadata: PageMetadata): void {
        this.updateMetadata(metadata);
    }

    /**
     * Set page language
     * @param lang - Language code (e.g., 'en', 'sw')
     */
    setPageLanguage(lang: string): void {
        this.document.documentElement.lang = lang;
        this.meta.updateTag({ property: 'og:locale', content: lang === 'sw' ? 'sw_KE' : 'en_US' });
    }

    /**
     * Add alternate language links
     * @param languages - Array of language codes and URLs
     */
    addAlternateLanguages(languages: Array<{ lang: string; url: string }>): void {
        // Remove existing alternate links
        const existingLinks = this.document.querySelectorAll('link[rel="alternate"]');
        existingLinks.forEach(link => link.remove());

        // Add new alternate links
        languages.forEach(({ lang, url }) => {
            const link = this.document.createElement('link');
            link.setAttribute('rel', 'alternate');
            link.setAttribute('hreflang', lang);
            link.setAttribute('href', url);
            this.document.head.appendChild(link);
        });
    }
}
