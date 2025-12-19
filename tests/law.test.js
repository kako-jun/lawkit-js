const lawkit = require('../index.js');

describe('law()', () => {
    describe('Basic API', () => {
        test('law function exists', () => {
            expect(typeof lawkit.law).toBe('function');
        });

        test('returns array of results', () => {
            const data = [123, 234, 345, 456, 567, 678, 789, 890, 901];
            const results = lawkit.law('validate', data);
            expect(Array.isArray(results)).toBe(true);
        });
    });

    describe('Benford Analysis', () => {
        test('analyzes Benford distribution', () => {
            const data = [
                123, 234, 345, 156, 178, 189, 267, 289, 378,
                412, 523, 634, 745, 856, 967, 1234, 2345, 3456
            ];

            const results = lawkit.law('benford', data);

            expect(results).toHaveLength(1);
            expect(results[0].resultType).toBe('BenfordAnalysis');
            expect(results[0].observedDistribution).toHaveLength(9);
            expect(results[0].expectedDistribution).toHaveLength(9);
            expect(typeof results[0].chiSquare).toBe('number');
            expect(typeof results[0].pValue).toBe('number');
            expect(typeof results[0].riskLevel).toBe('string');
        });
    });

    describe('Pareto Analysis', () => {
        test('analyzes Pareto distribution', () => {
            const data = [
                10000, 9000, 8000, 7000,
                1000, 900, 800, 700, 600, 500, 400, 300, 200, 100
            ];

            const results = lawkit.law('pareto', data);

            expect(results).toHaveLength(1);
            expect(results[0].resultType).toBe('ParetoAnalysis');
            expect(typeof results[0].top20PercentContribution).toBe('number');
            expect(typeof results[0].paretoRatio).toBe('number');
            expect(typeof results[0].concentrationIndex).toBe('number');
        });
    });

    describe('Zipf Analysis', () => {
        test('analyzes Zipf distribution', () => {
            const data = [1000, 500, 333, 250, 200, 167, 143, 125, 111, 100];

            const results = lawkit.law('zipf', data);

            expect(results).toHaveLength(1);
            expect(results[0].resultType).toBe('ZipfAnalysis');
            expect(typeof results[0].zipfCoefficient).toBe('number');
            expect(typeof results[0].correlationCoefficient).toBe('number');
        });
    });

    describe('Normal Analysis', () => {
        test('analyzes normal distribution', () => {
            const data = [
                98, 99, 100, 101, 102, 99, 100, 101, 100, 99,
                101, 100, 99, 100, 101, 98, 102, 100, 99, 101
            ];

            const results = lawkit.law('normal', data);

            expect(results).toHaveLength(1);
            expect(results[0].resultType).toBe('NormalAnalysis');
            expect(typeof results[0].mean).toBe('number');
            expect(typeof results[0].stdDev).toBe('number');
            expect(typeof results[0].skewness).toBe('number');
            expect(typeof results[0].kurtosis).toBe('number');
        });
    });

    describe('Poisson Analysis', () => {
        test('analyzes Poisson distribution', () => {
            const data = [0, 1, 2, 1, 3, 0, 2, 1, 4, 2, 1, 0, 3, 2, 1, 5, 0, 2, 1, 3];

            const results = lawkit.law('poisson', data);

            expect(results).toHaveLength(1);
            expect(results[0].resultType).toBe('PoissonAnalysis');
            expect(typeof results[0].lambda).toBe('number');
            expect(typeof results[0].varianceRatio).toBe('number');
        });
    });

    describe('Validation', () => {
        test('validates data', () => {
            const data = [123, 234, 345, 456, 567, 678, 789, 890, 901];

            const results = lawkit.law('validate', data);

            expect(results).toHaveLength(1);
            expect(results[0].resultType).toBe('ValidationResult');
            expect(typeof results[0].validationPassed).toBe('boolean');
            expect(typeof results[0].dataQualityScore).toBe('number');
        });
    });

    describe('Options', () => {
        test('accepts confidence_level option', () => {
            const data = [123, 234, 345, 456, 567, 678, 789, 890, 901];

            const results = lawkit.law('benford', data, {
                confidenceLevel: 0.99
            });

            expect(results).toHaveLength(1);
        });

        test('accepts risk_threshold option', () => {
            const data = [123, 234, 345, 456, 567, 678, 789, 890, 901];

            const results = lawkit.law('benford', data, {
                riskThreshold: 'high'
            });

            expect(results).toHaveLength(1);
        });
    });

    describe('Error Handling', () => {
        test('throws on unknown subcommand', () => {
            expect(() => lawkit.law('unknown', [1, 2, 3])).toThrow();
        });

        test('throws on empty data', () => {
            expect(() => lawkit.law('benford', [])).toThrow();
        });
    });
});
