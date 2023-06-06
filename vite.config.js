import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        coverage: {
            provider: 'istanbul',
            reportsDirectory: './coverage',
            reporter: ['lcov', 'text-summary']
        }
    }
});
