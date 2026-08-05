function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is missing`);
    }
    return value;
}

export const config = {
    accessSecret: required("ACCESS_SECRET"),
};

export default config;
