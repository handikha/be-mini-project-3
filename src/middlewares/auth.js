import jsonWebToken from "jsonwebtoken";
import {User} from "../models/index.js";
import {secret} from "../config/auth.js";

const verifyToken = (req, res, next) => {
    let token = req.headers["Authorization"] || req.headers["authorization"];
    token = token.substring(7, token.length);

    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }

    jsonWebToken.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    let token = req.headers["Authorization"] || req.headers["authorization"]
    token = token.substring(7, req.headers["authorization"].length);

    console.log("token", token);

    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }
    let userId;
    try {
        const decoded = jsonWebToken.verify(token, secret);
        userId = decoded.id;
    } catch (err) {
        return res.status(401).send({
            message: "Unauthorized!",
        });
    }
    try {
        const user = await User.findByPk(userId);
        if (user.role === 1) {
            next();
        } else {
            res.status(403).send({
                message: "Require Admin Role!",
            });
        }
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

export {
    verifyToken,
    isAdmin,
};
