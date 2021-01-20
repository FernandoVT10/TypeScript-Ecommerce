const readFileAsDataURL = async (file: File): Promise<string> => {
    return new Promise(resolve => {
        const reader = new FileReader;

        reader.addEventListener("load", () => resolve(reader.result.toString()));

        reader.readAsDataURL(file);
    });
}

export default readFileAsDataURL;
