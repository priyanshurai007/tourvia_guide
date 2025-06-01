import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Find all guides without a slug
    const guides = await User.find({ 
      role: 'guide',
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });
    
    console.log(`Found ${guides.length} guides without slugs`);
    
    // Update each guide with a slug
    const updates = await Promise.all(
      guides.map(async (guide) => {
        // Create a basic slug from the name
        let baseSlug = guide.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .trim(); // Trim leading/trailing spaces/hyphens
        
        // Check if the slug already exists
        const existingUser = await User.findOne({ slug: baseSlug, _id: { $ne: guide._id } });
        
        // If slug exists, append the guide's ID to make it unique
        const finalSlug = existingUser ? `${baseSlug}-${guide._id}` : baseSlug;
        
        // Update the guide with the new slug
        await User.updateOne(
          { _id: guide._id },
          { $set: { slug: finalSlug } }
        );
        
        return {
          id: guide._id,
          name: guide.name,
          oldSlug: guide.slug,
          newSlug: finalSlug
        };
      })
    );
    
    // As a fallback, ensure the guide-ID format still works in the frontend
    const guidesWithIds = await User.find({ 
      role: 'guide'
    }).select('_id name');
    
    return NextResponse.json({
      success: true,
      updated: updates,
      message: `Updated ${updates.length} guides with slugs.`,
      allGuides: guidesWithIds.map(g => ({
        id: g._id.toString(),
        name: g.name,
        idSlug: `guide-${g._id.toString()}`
      }))
    });
  } catch (error) {
    console.error('Error generating slugs:', error);
    return NextResponse.json(
      { success: false, error: 'Error generating slugs' },
      { status: 500 }
    );
  }
} 