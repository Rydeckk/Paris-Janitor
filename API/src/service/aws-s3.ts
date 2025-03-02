import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.STORAGE_SECRET_KEY,
  },
  region: process.env.STORAGE_REGION,
});

const bucketName = process.env.STORAGE_BUCKET_NAME;

export const getObject = async (name) => {
  const params = { Bucket: bucketName, Key: name };
  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(client, command);
    return url;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const putObject = async (name, file, contentType) => {
  const params = {
    Bucket: bucketName,
    Key: name,
    Body: file,
    ContentType: contentType,
  };
  try {
    return await client.send(new PutObjectCommand(params));
  } catch (error) {
    console.error(error);
    return null;
  }
};
