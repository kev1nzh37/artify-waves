export const parseColor = (input: string) => {
    let r = 0, g = 0, b = 0;
    input = input.toLowerCase();

    // 如果是 rgb 格式
    if (input.startsWith('rgb')) {
        let parts = input.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
        if (parts) {
            r = parseInt(parts[1], 10);
            g = parseInt(parts[2], 10);
            b = parseInt(parts[3], 10);
        }
    } else if (input.startsWith('#')) {
        // 处理六位和三位的十六进制颜色
        if (input.length === 7) {
            r = parseInt(input.slice(1, 3), 16);
            g = parseInt(input.slice(3, 5), 16);
            b = parseInt(input.slice(5, 7), 16);
        } else if (input.length === 4) {
            r = parseInt(input[1] + input[1], 16);
            g = parseInt(input[2] + input[2], 16);
            b = parseInt(input[3] + input[3], 16);
        }
    }

    // 将 RGB 值转换为 0 到 1 之间的数值，因为 OGL 的 Color 构造函数接受的是这种格式
    return { r: r / 255, g: g / 255, b: b / 255 };
}