import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION || "us-east-1";
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const bucket = process.env.S3_BUCKET;
const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;

let s3: S3Client | null = null;

function client() {
  if (s3) return s3;
  if (!endpoint || !accessKeyId || !secretAccessKey) return null;
  s3 = new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
  return s3;
}

export async function uploadToS3(key: string, body: Uint8Array, contentType: string) {
  const c = client();
  if (!c || !bucket) throw new Error("S3 is not configured");
  await c.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  const url = publicBaseUrl
    ? `${publicBaseUrl.replace(/\/$/, "")}/${key}`
    : `${endpoint!.replace(/\/$/, "")}/${bucket}/${key}`;

  return { bucket, key, url };
}
