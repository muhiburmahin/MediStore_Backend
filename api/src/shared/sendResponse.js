const sendResponse = (res, payload) => {
    res.status(payload.statusCode).json({
        success: payload.success,
        message: payload.message,
        data: payload.data ?? null,
    });
};
export default sendResponse;
//# sourceMappingURL=sendResponse.js.map