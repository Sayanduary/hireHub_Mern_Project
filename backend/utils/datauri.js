import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
    if (!file) return null;
    const ext = path.extname(file.originalname);
    return parser.format(ext, file.buffer);
};

export default getDataUri;
