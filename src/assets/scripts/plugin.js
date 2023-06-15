if (process == null) {
    var process = {
        env: {
            NODE_ENV: "production",
        },
    };
}

if (global == null) {
    var global = globalThis;
}
