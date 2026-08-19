// ========================================== */
// LOADER.JS - Complete (CSS + HTML)         */
// ========================================== */

/* 🔹 FUNCTION 1: CSS Load Karna */
export async function loadCSS(filePath) {
    try {
        const response = await fetch(`${filePath}?v=6`);
        if (!response.ok) {
            throw new Error(`CSS load nahi hui: ${filePath}`);
        }
        return await response.text();
    } catch (error) {
        console.error('❌ CSS error:', error);
        return ''; // Empty string return karo (component toot na jaye)
    }
}

/* 🔹 FUNCTION 2: HTML Load Karna */
export async function loadHTML(filePath) {
    try {
        const response = await fetch(`${filePath}?v=6`);
        if (!response.ok) {
            throw new Error(`HTML load nahi hua: ${filePath}`);
        }
        return await response.text();
    } catch (error) {
        console.error('❌ HTML error:', error);
        return ''; // Empty string return karo
    }
}

/* 🔹 FUNCTION 3: CSS + HTML Ek Sath Load Karna (Optional - Convenience) */
export async function loadComponent(folderPath) {
    // Yeh ek saath CSS aur HTML load karega
    // folderPath: "components/header" (bina slash ke)
    try {
        const css = await loadCSS(`${folderPath}.css`);
        const html = await loadHTML(`${folderPath}.html`);
        return { css, html };
    } catch (error) {
        console.error('❌ Component load nahi hua:', error);
        return { css: '', html: '' };
    }
}