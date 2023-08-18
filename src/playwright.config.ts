import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: false,
    reporter: [["html", { open: "never" }]],
    use: {
        actionTimeout: 0,
        trace: "on-first-retry",
        headless: true,
        viewport: {
            width: 1280,
            height: 720,
        },
        screenshot: "only-on-failure",
        launchOptions: {
            args: [
                "--enable-features=Vulkan,UseSkiaRenderer",
                "--use-vulkan=swiftshader",
                "--enable-unsafe-webgpu",
                "--disable-vulkan-fallback-to-gl-for-testing",
                "--dignore-gpu-blocklist",
                "--use-angle=vulkan",
            ],
        },
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
            },
        },
    ],
    timeout: 1200 * 1000,
});
