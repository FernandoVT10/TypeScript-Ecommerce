import fs from "fs";

function loadEmailTemplate(templateName: string, data: object) {
    const url = `${__dirname}/../../mails/${templateName}.html`;
    const buffer = fs.readFileSync(url);
    let template = buffer.toString();

    // Here we go to replace the {some} with its corresponding value
    Object.keys(data).forEach(key => {
	const regex = new RegExp(`{${key}}`, "g");

	template = template.replace(regex, data[key]);
    });

    return template;
}

export default loadEmailTemplate;
