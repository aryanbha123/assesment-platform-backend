export const isAllowed = (req, res, next) => {
    const reqUserId = req.params.userId;
    const userId = req.user._id.toString();

    if (userId === reqUserId) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden" });
    }
};
