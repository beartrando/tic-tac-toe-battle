function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is missing`);
    }
    return value;
}

export const config = {
    jwtAccessSecret: required("JWT_ACCESS_SECRET"),
};

export default config;
