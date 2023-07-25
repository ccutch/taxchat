import { PdfReader } from "pdfreader";
import {readFile} from 'fs/promises'


export async function parsePdf(filePath) {
  const pdfReader = new PdfReader();
  const buf = await readFile(filePath)
  const fileData = await new Promise((res, rej) => {
    let data = "";
    pdfReader.parseBuffer(buf, (err, item) => {
      if (err) return rej(err);
      if (item) data += `${item.text}`;
      else res(data);
    });
  })

  console.log('file data', fileData)

  if (!fileData) throw new Error("Erro loading file")

  return fileData;
}