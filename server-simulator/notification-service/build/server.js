"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const cors_1 = __importDefault(require("cors"));
const notification_service_router_1 = __importDefault(require("./notification-service-router"));
const app = (0, express_1.default)();
const server = http.createServer(app);
const port = 3008;
let io = require("socket.io")(server);
io.on("connection", function (socket) {
    console.log("a user connected");
});
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.get("/", (req, res, next) => {
    res.send("Notification root route is working");
});
app.use("/user", notification_service_router_1.default);
app.use(express_1.default.static("public"));
app.get("/kickedOut", function (req, res) {
    res.send("Under Maintenance !");
    io.emit("kickedOut", {
        message: "Game đang được bảo trì, vui lòng quay lại sau 10 phút.",
        umInfo: {
            isUM: true,
            startTime: "2023-05-12T09:43:00.000Z",
            endTime: "2023-05-12T10:43:00.000Z",
        },
    });
});
app.get("/reload", function (req, res) {
    res.send("Force reload!");
    io.emit("reload", true);
});
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
