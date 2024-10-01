import User from "../models/UserModel.js";


export const searchContacts = async (req, res, next) => {
    try {

        const { searchTerm } = req.body;

        if (searchTerm === undefined || searchTerm === null) {
            res.status(400).json({ message: "Please provide a search term" })
        }

        const sanitizedSearchedTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitizedSearchedTerm, "i");

        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [
                        {
                            firstName: regex
                        },
                        {
                            lastName: regex
                        },
                        {
                            email: regex
                        }
                    ]
                }
            ],
        })




        return res.status(200).json({contacts})

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}
