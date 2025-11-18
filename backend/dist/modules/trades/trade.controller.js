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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel = exports.release = exports.confirmReceipt = exports.markPaid = exports.listMine = exports.create = void 0;
const TradeService = __importStar(require("./trade.service"));
const client_1 = require("@prisma/client");
const create = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { offerId, fromAmount, toAmount, expiresAt } = req.body;
        const trade = await TradeService.createTrade(userId, { offerId, fromAmount, toAmount, expiresAt });
        res.status(201).json(trade);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.create = create;
const listMine = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const trades = await TradeService.listMyTrades(userId);
    res.json(trades);
};
exports.listMine = listMine;
const markPaid = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const trade = await TradeService.updateStatus(userId, id, client_1.TradeStatus.BUYER_MARKED_PAID);
    res.json(trade);
};
exports.markPaid = markPaid;
const confirmReceipt = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const trade = await TradeService.updateStatus(userId, id, client_1.TradeStatus.SELLER_CONFIRMED_RECEIPT);
    res.json(trade);
};
exports.confirmReceipt = confirmReceipt;
const release = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const trade = await TradeService.updateStatus(userId, id, client_1.TradeStatus.RELEASED, client_1.EscrowStatus.RELEASED);
    res.json(trade);
};
exports.release = release;
const cancel = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const trade = await TradeService.updateStatus(userId, id, client_1.TradeStatus.CANCELLED, client_1.EscrowStatus.REFUNDED);
    res.json(trade);
};
exports.cancel = cancel;
