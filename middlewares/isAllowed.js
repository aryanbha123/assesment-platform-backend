export const isAllowed = (req, res, next) => {
    const reqUserId = req.body._id;
    const userId = req.user._id;
    if (userId === reqUserId) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};