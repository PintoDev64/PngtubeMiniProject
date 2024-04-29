import { readFileSync } from "fs";

export function ImageBase64(img: string) {
    const bitmapImage = readFileSync(img)
    return `data:image/png;base64,${Buffer.from(bitmapImage).toString('base64')}`;
}