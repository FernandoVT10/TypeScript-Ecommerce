const EMAIL_VALIDATION_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const validate = {
    email: (v: string) => EMAIL_VALIDATION_REGEX.test(v),
    image: (type: string) => type.startsWith("image")
}

export default validate;
