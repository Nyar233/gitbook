import { argosScreenshot } from '@argos-ci/playwright';
import {
    CustomizationHeaderPreset,
    CustomizationLocale,
    CustomizationSettings,
} from '@gitbook/api';
import { test, Page } from '@playwright/test';
import rison from 'rison';

import { getContentTestURL } from '../tests/utils';

interface Test {
    name: string;
    url: string;
    run?: (page: Page) => Promise<unknown>;
}

interface TestsCase {
    name: string;
    baseUrl: string;
    tests: Array<Test>;
}

const allLocales: CustomizationLocale[] = [
    CustomizationLocale.Fr,
    CustomizationLocale.Es,
    CustomizationLocale.Ja,
    CustomizationLocale.Zh,
];

const testCases: TestsCase[] = [
    {
        name: 'GitBook',
        baseUrl: 'https://docs.gitbook.com',
        tests: [
            {
                name: 'Home',
                url: '',
            },
            {
                name: 'Search',
                url: '?q=',
            },
            {
                name: 'Search Results',
                url: '?q=gitbook',
                run: (page) => page.waitForSelector('[data-test="search-results"]'),
            },
            {
                name: 'AI Search',
                url: '?q=What+is+GitBook%3F&ask=true',
                run: (page) => page.waitForSelector('[data-test="search-ask-answer"]'),
            },
            {
                name: 'Not found',
                url: 'content-not-found',
            },
        ],
    },
    {
        name: 'GitBook Examples',
        baseUrl: 'https://examples.gitbook.com',
        tests: [
            {
                name: 'Landing page',
                url: '',
            },
        ],
    },
    {
        name: 'Snyk',
        baseUrl: 'https://docs.snyk.io',
        tests: [
            {
                name: 'Home',
                url: '',
            },
        ],
    },
    {
        name: 'Rocket.Chat',
        baseUrl: 'https://docs.rocket.chat',
        tests: [
            {
                name: 'Home',
                url: '',
            },
            {
                name: 'PDF',
                url: '~gitbook/pdf?limit=10',
            },
        ],
    },
    {
        name: 'Commerce Layer',
        baseUrl: 'https://docs.commercelayer.io/core/',
        tests: [
            {
                name: 'Home',
                url: '',
            },
            {
                name: 'API Reference',
                url: 'v/api-reference/',
            },
        ],
    },
    {
        name: 'Naviga',
        baseUrl: 'https://docs.navigaglobal.com/naviga-dashboard-overview/',
        tests: [
            {
                name: 'Home',
                url: 'v/dashboard-5.4/',
            },
        ],
    },
    {
        name: 'Mattermost',
        baseUrl: 'https://handbook.mattermost.com/',
        tests: [
            {
                name: 'Home',
                url: '',
            },
        ],
    },
    {
        name: 'Tile DB',
        baseUrl: 'https://docs.tiledb.com/main/',
        tests: [
            {
                name: 'Home',
                url: '',
            },
        ],
    },
    {
        name: 'Nimbleway',
        baseUrl: 'https://docs.nimbleway.com/',
        tests: [
            {
                name: 'Home',
                url: '',
            },
        ],
    },
    {
        name: 'Parcellab',
        baseUrl: 'https://how.parcellab.works/docs/',
        tests: [
            {
                name: 'Home',
                url: '',
            },
        ],
    },
    {
        name: 'CitrusAd',
        baseUrl: 'https://help.citrusad.com/citrus-ads/',
        tests: [
            {
                name: 'Home',
                url: '',
            },
        ],
    },
    {
        name: 'ThousandEyes',
        baseUrl: 'https://docs.thousandeyes.com/',
        tests: [
            {
                name: 'Home',
                url: '',
            },
        ],
    },
    {
        name: 'Versioning',
        baseUrl: 'https://gitbook.gitbook.io/test-1-1/',
        tests: [
            {
                name: 'Revision',
                url: '~/revisions/S55pwsEr5UVoroaOiWnP',
            },
        ],
    },
    {
        name: 'PDF',
        baseUrl: 'https://gitbook.gitbook.io/test-1-1/',
        tests: [
            {
                name: 'PDF',
                url: '~gitbook/pdf?limit=10',
            },
        ],
    },
    {
        name: 'Content tests',
        baseUrl: 'https://gitbook.gitbook.io/test-1-1/',
        tests: [
            {
                name: 'Text',
                url: 'text-page',
            },
            {
                name: 'Long text',
                url: 'text-page/long-text',
            },
            {
                name: 'Images',
                url: 'blocks/block-images',
            },
            {
                name: 'Inline Images',
                url: 'blocks/inline-images',
            },
            {
                name: 'Tabs',
                url: 'blocks/tabs',
            },
            {
                name: 'Hints',
                url: 'blocks/hints',
            },
            {
                name: 'Integration Blocks',
                url: 'blocks/integrations',
            },
            {
                name: 'Tables',
                url: 'blocks/tables',
            },
            {
                name: 'Expandables',
                url: 'blocks/expandables',
            },
            {
                name: 'API Blocks',
                url: 'blocks/api-blocks',
            },
            {
                name: 'Headings',
                url: 'blocks/headings',
            },
            {
                name: 'Marks',
                url: 'blocks/marks',
            },
            {
                name: 'Emojis',
                url: 'blocks/emojis',
            },
        ],
    },
    {
        name: 'Customization',
        baseUrl: 'https://gitbook.gitbook.io/test-1-1/',
        tests: [
            {
                name: 'Without header',
                url: getCustomizationURL({
                    header: {
                        preset: CustomizationHeaderPreset.None,
                        links: [],
                    },
                }),
            },
        ],
    },
    {
        name: 'Share links',
        baseUrl: 'https://gitbook.gitbook.io/test-share-links/',
        tests: [
            {
                name: 'Valid link',
                url: 'Fc6mMII9FKgnwm7qqynx/',
            },
            {
                name: 'Invalid link',
                url: 'invalid/',
            },
        ],
    },
    {
        name: 'Languages',
        baseUrl: 'https://gitbook.gitbook.io/test-1-1/',
        tests: allLocales.map((locale) => ({
            name: locale,
            url: getCustomizationURL({
                internationalization: {
                    locale,
                    inherit: false,
                },
            }),
        })),
    },
];

for (const testCase of testCases) {
    test.describe(testCase.name, () => {
        for (const testEntry of testCase.tests) {
            test(testEntry.name, async ({ page, baseURL }) => {
                const contentUrl = new URL(testEntry.url, testCase.baseUrl);
                const url = getContentTestURL(contentUrl.toString(), baseURL);
                await page.goto(url);
                if (testEntry.run) {
                    await testEntry.run(page);
                }
                await argosScreenshot(page, `${testCase.name} - ${testEntry.name}`, {
                    viewports: ['macbook-13', 'iphone-x', 'ipad-2'],
                });
            });
        }
    });
}

/**
 * Create a URL with customization settings.
 */
function getCustomizationURL(partial: Partial<CustomizationSettings>): string {
    const encoded = rison.encode_object(partial);

    const searchParams = new URLSearchParams();
    searchParams.set('customization', encoded);

    return `?${searchParams.toString()}`;
}