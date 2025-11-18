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
exports.listByStatus = exports.create = exports.listMine = exports.list = void 0;
const OfferService = __importStar(require("./offer.service"));
const list = async (_req, res) => {
    const offers = await OfferService.listOffers();
    res.json(offers);
};
exports.list = list;
const listMine = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const offers = await OfferService.listMyOffers(userId);
    res.json(offers);
};
exports.listMine = listMine;
const create = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const { side, fromCurrency, toCurrency, rate, minAmount, maxAmount, paymentMethodsAccepted } = req.body;
    const offer = await OfferService.createOffer(userId, {
        side,
        fromCurrency,
        toCurrency,
        rate,
        minAmount,
        maxAmount,
        paymentMethodsAccepted,
    });
    res.status(201).json(offer);
};
exports.create = create;
const listByStatus = async (req, res) => {
    const status = req.params.status;
    const offers = await OfferService.listOffers(status);
    res.json(offers);
};
exports.listByStatus = listByStatus;
