export const env = (p:string, defaultVal = undefined) => {
    if (!process.env[p] && !defaultVal) {
        throw new Error(`Missing environment variable ${p}`);
    }

    return process.env[p] || defaultVal;
};
