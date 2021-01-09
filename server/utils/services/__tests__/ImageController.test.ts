import fs from "fs";
import sharp from "sharp";
import { mocked } from "ts-jest/utils";
import { uploadImage, uploadImages, deleteImage, deleteImages, fileFilter } from "../ImageController";

jest.mock("sharp");
jest.mock("fs");
jest.mock("../../../config", () => ({
    IMAGES_DIRECTORY: "/some/place/"
}));

const IMAGE_SIZES_MOCK = [
    {
	label: "large",
	width: 1920,
	height: 1080
    },
    {
	label: "medium",
	width: 1280,
	height: 720
    },
    {
	label: "mini",
	width: 250,
	height: 250
    }
];

const LABELS_MOCK = IMAGE_SIZES_MOCK.map(imageSize => imageSize.label);

const FILE_MOCK = {
    buffer: Buffer.from("test"),
    mimetype: "image/webp"
} as Express.Multer.File

const sharpMock = mocked(sharp);
const sharpResizeMock = jest.fn();
const sharpWebpMock = jest.fn();
const sharpToBufferMock = jest.fn();

const writeFileSyncMocked = mocked(fs.writeFileSync);
const existsSyncMock = mocked(fs.existsSync);
const unlinkSyncMock = mocked(fs.unlinkSync);

describe("/utils/services/ImageController", () => {
    beforeEach(() => {
	jest.resetAllMocks();

	sharpToBufferMock.mockImplementation(() => Buffer.from("test"))

	sharpWebpMock.mockImplementation(() => ({
	    toBuffer: sharpToBufferMock
	}))

	sharpResizeMock.mockImplementation(() => ({
	    webp: sharpWebpMock
	}));

	sharpMock.mockImplementation(() => ({
	    resize: sharpResizeMock
	} as any))

	existsSyncMock.mockImplementation(() => true);

	Date.now = () => 12345;
    });

    describe("UploadImage Function", () => {
	it("should resize, crop and upload the image correclty", async () => {
	    const res = await uploadImage(FILE_MOCK, IMAGE_SIZES_MOCK, "test/");
	    expect(res).toBe("12345.webp");

	    const bufferMock = Buffer.from("test");

	    IMAGE_SIZES_MOCK.forEach(imageSize => {
		const { width, height, label } = imageSize;

		expect(sharpResizeMock).toHaveBeenCalledWith(width, height, {
		    fit: "cover"
		});

		expect(writeFileSyncMocked).toHaveBeenCalledWith(
		    `/some/place/test/${label}-12345.webp`, bufferMock
		);
	    });

	    expect(sharp).toHaveBeenCalledWith(FILE_MOCK.buffer);
	    expect(sharp).toHaveBeenCalledTimes(3);

	    expect(sharpResizeMock).toHaveBeenCalledTimes(3);
	    expect(sharpWebpMock).toHaveBeenCalledTimes(3);
	    expect(sharpToBufferMock).toHaveBeenCalledTimes(3);
	    expect(writeFileSyncMocked).toHaveBeenCalledTimes(3);
	});
    });

    describe("UploadImages Function", () => {
        it("should call uploadImage with all the images correclty", async () => {
	    const res = await uploadImages([FILE_MOCK, FILE_MOCK], IMAGE_SIZES_MOCK, "test/");
	    expect(res).toEqual([
		"12345.webp",
		"12345.webp"
	    ]);
        });
    });

    describe("DeleteImage Function", () => {
	it("should remove the images", () => {
	    deleteImage("12345.webp", LABELS_MOCK, "test/");

	    LABELS_MOCK.forEach(label => {
	    	expect(unlinkSyncMock).toHaveBeenCalledWith(`/some/place/test/${label}-12345.webp`);
	    });

	    expect(unlinkSyncMock).toHaveBeenCalledTimes(3);
	    expect(existsSyncMock).toHaveBeenCalledTimes(3);
	});
    });

    describe("DeleteImagges Function", () => {
        it("should call deleteImage with all the images correclty", () => {
	    deleteImages([
	    	"12345.webp",
		"67890.webp"
	    ], LABELS_MOCK, "test/");

	    LABELS_MOCK.forEach(label => {
	    	expect(unlinkSyncMock).toHaveBeenCalledWith(`/some/place/test/${label}-12345.webp`);
	    });

	    LABELS_MOCK.forEach(label => {
	    	expect(unlinkSyncMock).toHaveBeenCalledWith(`/some/place/test/${label}-67890.webp`);
	    });

	    expect(unlinkSyncMock).toHaveBeenCalledTimes(6);
	    expect(existsSyncMock).toHaveBeenCalledTimes(6);
        });
    });

    describe("FileFilter", () => {
        it("should accept the file when is an image", () => {
	    const callback = jest.fn();
            
	    fileFilter(null, FILE_MOCK, callback);

	    expect(callback).toHaveBeenCalledWith(null, true);
        });

        it("should call the callback with an error when the file is not an image", () => {
	    const callback = jest.fn();

	    const fileMock = {
	    	mimetype: "file/test"
	    } as Express.Multer.File
            
	    fileFilter(null, fileMock, callback);

	    expect(callback).toHaveBeenCalledWith(new Error("Please upload only image"));
        });
    });
});
