import { FileFilterCallback } from "multer";

import path from "path";
import fs from "fs";
import sharp from "sharp";

import { IMAGES_DIRECTORY } from "../../config";

type Sizes = Array<{
    label: string,
    width: number,
    height: number
}>

const resizeImage = (fileBuffer: Buffer, width: number, height: number) => {
    return sharp(fileBuffer).resize(width, height, {
    	fit: "cover"
    }).webp().toBuffer();
}

export const uploadImage = async (file: Express.Multer.File, sizes: Sizes, filePath: string) => {
    const images = await Promise.all(sizes.map(size => {
    	return resizeImage(file.buffer, size.width, size.height);
    }));

    const filename = `${Date.now()}.webp`;

    images.forEach((image, index) => {
	const label = sizes[index].label;
	const imagePath = path.join(IMAGES_DIRECTORY, filePath, `${label}-${filename}`);

	fs.writeFileSync(imagePath, image)
    });

    return filename;
}

export const uploadImages = (files: Express.Multer.File[], sizes: Sizes, filePath: string) => {
    return Promise.all(files.map(file => {
    	return uploadImage(file, sizes, filePath);
    }));
}

export const deleteImage = (filename: string, labels: string[], filePath: string) => {
    labels.forEach(label => {
	const imagePath = path.join(IMAGES_DIRECTORY, filePath, `${label}-${filename}`);

	if(fs.existsSync(imagePath)) {
	    fs.unlinkSync(imagePath);
	}
    });
}

export const deleteImages = (filesname: string[], labels: string[], filePath: string) => {
    filesname.forEach(filename => {
	deleteImage(filename, labels, filePath);
    });
}

export const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if(file.mimetype.startsWith("image")) {
	cb(null, true);
    } else {
    	cb(new Error("Please upload only image"));
    }
}
