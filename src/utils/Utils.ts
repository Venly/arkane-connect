export default class Utils {
    public static getOrigin(url: string) {
        const parts: any = url.match(/^.+\:\/\/[^\‌​/]+/);
        return (Array.isArray(parts) && parts.length > 0) ? parts[0] : 'unknown';
    }

    public static shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    public static isWhitelistedOrigin(origin: string): boolean {
        const array = ['http://localhost:4000'];
        return !!array.find((val: string) => val === origin);
    }
}
