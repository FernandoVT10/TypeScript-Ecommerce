const EMAIL_VALIDATION_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const IMAGE_TYPES = [
    "image/jpg",
    "image/jpeg",
    "image/png"
];

const validate = {
    email: (v: string) => EMAIL_VALIDATION_REGEX.test(v),
    image: (type: string) => IMAGE_TYPES.reduce(
	(acc, imageType) => imageType === type ? true : acc, false
    )
}

export default validate;
