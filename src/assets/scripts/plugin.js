if (process == null) {
    var nodeEnv = "production";

    if (localStorage && localStorage.getItem("enabledMobxDebug") == "true") {
        nodeEnv = "development";
    }

    var process = {
        env: {
            NODE_ENV: nodeEnv,
        },
    };
}

if (global == null) {
    var global = globalThis;
}
