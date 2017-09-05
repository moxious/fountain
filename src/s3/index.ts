import * as aws from 'aws-sdk';
import { env } from '../env';

export const s3 = () =>
    new aws.S3({
        accessKeyId: env('FOUNTAIN_ACCESS_KEY_ID'),
        secretAccessKey: env('FOUNTAIN_SECRET_ACCESS_KEY'),
    });
