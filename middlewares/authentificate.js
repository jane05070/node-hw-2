import jwt from "jsonwebtoken";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
import User from "../models/user.js";

const { JWT_SECRET } = process.env;

const authentificate = async (req, res, next) => {
    const { authorization = ""} = req.body;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        throw HttpError(401, "Not authorized");
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user) {
            throw HttpError(401, "Not authorized")
        }
        req.user = user;
        next();
    }
    catch {
        throw HttpError(401, "Not authorized")
    }
}

export default ctrlWrapper(authentificate);