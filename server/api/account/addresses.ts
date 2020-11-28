import mongoose from "mongoose";

import { Router } from "express";

import Address, { IAddress } from "../../models/Address";

const router = Router();

interface IPostInput {
    fullName: IAddress["fullName"],
    postalCode: IAddress["postalCode"],
    state: IAddress["state"],
    municipality: IAddress["municipality"],
    suburb: IAddress["suburb"],
    street: IAddress["street"],
    outdoorNumber: IAddress["outdoorNumber"],
    interiorNumber?: IAddress["interiorNumber"],
    phoneNumber: IAddress["phoneNumber"],
    additionalInformation?: IAddress["additionalInformation"]
}

router.get("/", async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.userId });

	res.json({
	    data: {
		addresses
	    }
	});
    } catch {
	res.json({
	    data: {
		addresses: []
	    }
	});
    }
});

router.post("/", async (req, res) => {
    const addressData = req.body as IPostInput;
    
    try {
        await Address.create({
            userId: req.userId,
	    ...addressData
        });

	res.json({
	    data: {
		message: "The address has been created successfully"
	    }
	});
    } catch (err) {
	if(err instanceof mongoose.Error.ValidationError) {
	    return res.json({
		status: 400,
		error: "Validation Error",
		message: err.message,
		path: req.originalUrl
	    });
	}

	res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
});

export default router;
