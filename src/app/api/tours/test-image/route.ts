import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client if credentials are available
const s3Client = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

export async function GET(request: Request) {
  // Get configuration details
  const config = {
    hasS3: !!s3Client,
    region: process.env.AWS_REGION || 'not_set',
    hasBucket: !!process.env.AWS_S3_BUCKET_NAME,
    bucketName: process.env.AWS_S3_BUCKET_NAME || 'not_set',
    fallbackImageUrl: `https://source.unsplash.com/featured/800x600/?travel,test`
  };
  
  // Check if we have AWS credentials
  if (!s3Client) {
    return NextResponse.json({
      success: false,
      message: "S3 client not configured, using fallback images",
      config,
      imageUrl: config.fallbackImageUrl
    });
  }

  try {
    // Test with a simple image (1x1 pixel transparent GIF)
    const base64Gif = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const buffer = Buffer.from(base64Gif, 'base64');
    
    // Generate test filename
    const testFileName = `test-${Date.now()}-${uuidv4().substring(0, 8)}.gif`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    if (!bucketName) {
      return NextResponse.json({
        success: false,
        message: "S3 bucket name not configured",
        config,
        imageUrl: config.fallbackImageUrl
      });
    }
    
    // Prepare S3 upload
    const params = {
      Bucket: bucketName,
      Key: `tests/${testFileName}`,
      Body: buffer,
      ContentType: 'image/gif',
      ACL: 'public-read',
    };
    
    // Attempt upload
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Generate image URL
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/tests/${testFileName}`;
    
    return NextResponse.json({
      success: true,
      message: "S3 test successful",
      config,
      imageUrl,
      testDetails: {
        fileName: testFileName,
        fileSize: buffer.length,
        contentType: 'image/gif'
      }
    });
  } catch (error) {
    console.error('Error testing S3:', error);
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error during S3 test",
      config,
      imageUrl: config.fallbackImageUrl,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      } : error
    }, { status: 500 });
  }
} 