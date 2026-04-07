module.exports = {
    default: {
        paths: ['features/**/*.feature'],
        require: [
            'src/support/world.ts',
            'src/support/hooks.ts',
            'step-definitions/**/*.ts',
        ],
        requireModule: ['ts-node/register'],
        format: [
            'progress-bar',
            'json:allure-results/cucumber-report.json',
        ],
    }
};