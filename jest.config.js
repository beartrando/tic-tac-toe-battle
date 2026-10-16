module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
<<<<<<< HEAD
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
            },
        ],
=======
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.spec.ts'],
    coverageDirectory: 'coverage',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.test.json',
        }],
>>>>>>> 101-create-track_id
    },
};
