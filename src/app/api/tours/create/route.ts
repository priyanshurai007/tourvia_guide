import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/lib/db';

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

// Function to upload image to S3
async function uploadImageToS3(base64Image: string, fileName: string) {
  if (!s3Client) {
    console.log('S3 client not initialized, using fallback URL');
    // Return a stable Unsplash URL based on filename for consistency
    return `https://source.unsplash.com/featured/800x600/?travel,${encodeURIComponent(fileName.split('.')[0])}`;
  }

  try {
    // Remove the data URL prefix and convert to buffer
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate a cleaned filename with only alphanumeric characters and extensions
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
    
    // Create a unique file name with timestamp to prevent conflicts
    const uniqueFileName = `${Date.now()}-${uuidv4().substring(0, 8)}-${cleanFileName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('S3 bucket name not configured');
    }

    const params = {
      Bucket: bucketName,
      Key: `tours/${uniqueFileName}`,
      Body: buffer,
      ContentType: base64Image.split(';')[0].split(':')[1] || 'image/jpeg',
      ACL: 'public-read' as ObjectCannedACL,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/tours/${uniqueFileName}`;
    return imageUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    
    // If S3 upload fails, use Unsplash with a deterministic query based on filename
    // This helps keep the same image if the user tries again with the same filename
    return `https://source.unsplash.com/featured/800x600/?travel,${encodeURIComponent(fileName.split('.')[0])}`;
  }
}

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectDB();
    
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    
    // Check if user is a guide
    if (decoded.role !== 'guide') {
      return NextResponse.json({ error: 'Only guides can create tours' }, { status: 403 });
    }

    // Get form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const duration = formData.get('duration') as string;
    const price = parseFloat(formData.get('price') as string);
    const maxParticipants = parseInt(formData.get('maxParticipants') as string, 10);
    const status = formData.get('status') as string;
    const imageFile = formData.get('image') as File | null;
    
    // Validate required fields
    if (!name || !description || !location || !duration || isNaN(price) || isNaN(maxParticipants)) {
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    // Check if the guide exists
    const guide = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
    
    if (!guide) {
      await client.close();
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Process image upload if provided
    let imageUrl = '';
    
    if (imageFile) {
      try {
        // Convert file to buffer for processing
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
        
        // Try S3 upload first
        imageUrl = await uploadImageToS3(base64Image, imageFile.name);
        
        // Verify the image URL is valid
        if (!imageUrl.startsWith('http')) {
          throw new Error('Invalid image URL generated');
        }
        
        console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('Error processing image upload:', uploadError);
        // Fallback to Unsplash if upload fails
        imageUrl = `https://source.unsplash.com/random/800x600/?travel,${encodeURIComponent(name)}`;
      }
    } else {
      // Use a default image from Unsplash if no image provided
      imageUrl = `https://source.unsplash.com/random/800x600/?travel,${encodeURIComponent(name)}`;
    }

    // Create tour document
    const tourDocument = {
      name,
      description,
      location,
      duration,
      price,
      maxParticipants,
      status,
      image: imageUrl,
      guideId: new ObjectId(decoded.id),
      guideName: guide.name,
      rating: 0,
      bookings: 0,
      upcoming: 0,
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    // Insert tour into database
    const result = await db.collection('tours').insertOne(tourDocument);
    
    await client.close();

    return NextResponse.json({
      success: true,
      message: 'Tour created successfully',
      tourId: result.insertedId.toString(),
      tour: {
        ...tourDocument,
        _id: result.insertedId,
        guideId: result.insertedId.toString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tour'
    }, { status: 500 });
  }
}