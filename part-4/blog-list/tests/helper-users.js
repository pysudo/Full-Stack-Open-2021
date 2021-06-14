const User = require("../models/user");

const initialUsers = [
    {
        _id: "60c61bed4739a00964b19aad",
        name: "D.K",
        username: "driftking",
        password: "$2b$12$9IqQA/4Vot2ghSEvhW4Ue.WMLaRV3VgRFskH/o9yuqegnA2YUbRES",
        __v: 0
    },
    {
        _id: "60c61c2d4739a00964b19aae",
        name: "Ellie",
        username: "ellie",
        password: "$2b$12$GH/NzmCo.G1VZeWYmcjDOOwAqR1y4NMOpnseWsjDGPCptgZIRvg5i",
        __v: 0
    },
    {
        _id: "60c61c464739a00964b19aaf",
        name: "Swedish Car",
        username: "saab",
        password: "$2b$12$RI2pMv2v.sEeEi0D4VVxa.bFxKuv/1xBLbB30kmahdBXWcivFX6qa",
        __v: 0
    }
];


const validLoginCredentials = {
    username: "driftking",
    password: "duck"
};


const getAllInDB = async () => {
    const users = await User.find({});

    return users.map(user => user.toJSON());
};


module.exports = {
    initialUsers,
    validLoginCredentials,
    getAllInDB
};