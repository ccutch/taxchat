import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {
  VectorStoreToolkit,
  createVectorStoreAgent,
} from "langchain/agents";
import { OpenAI } from 'langchain';
import { parsePdf } from './pdf_loader.js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';


// Load the file and transform into documents
const text = await parsePdf('./example.pdf')
const splitter =  new RecursiveCharacterTextSplitter({
  chunkSize: 1000,

})
const docs =  await splitter.createDocuments([text]);

// Split that into smaller pieces
const vectorStore = await HNSWLib.fromDocuments(docs,new OpenAIEmbeddings());
const model = new OpenAI({ temperature: 0 });

/* Create the agent */
const vectorStoreInfo = {
  name: "eds_resume",
  description: "This is a copy of Ed Sweeny's Resume",
  vectorStore,
};

const toolkit = new VectorStoreToolkit(vectorStoreInfo, model);
const agent = createVectorStoreAgent(model, toolkit);
const {output} = await agent.call({ input: `Who is ed sweeny?` });

console.log(output)




