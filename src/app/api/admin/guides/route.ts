import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { MongoClient, ObjectId } from "mongodb";

// Define interface for decoded JWT token
interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// GET request handler for admin to fetch guides
export async function GET(req: NextRequest) {
  try {
    // Get token from cookie
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: No token provided" },
        { status: 401 }
      );
    }

    // Decode the token
    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Decode token and verify admin role
    const decodedToken = jwtDecode<DecodedToken>(token);

    if (decodedToken.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Admin privileges required" },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Initialize MongoDB client
    const client = new MongoClient(process.env.MONGODB_URI as string);
    
    try {
      await client.connect();
      console.log("Connected to MongoDB for guides data");
      
      const db = client.db();
      
      // Build query based on search and status filters
      const query: any = { role: "guide" };
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { specialty: { $regex: search, $options: "i" } }
        ];
      }
      
      if (status && status !== "All") {
        query.status = status;
      }
      
      // Count total guides matching the query
      const total = await db.collection("users").countDocuments(query);
      
      // Sort options
      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
      
      // Fetch guides with pagination and sorting
      const guides = await db.collection("users")
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Transform guide data with additional statistics
      const transformedGuides = await Promise.all(guides.map(async (guide) => {
        // Get total bookings for the guide
        const totalBookings = await db.collection("bookings").countDocuments({
          guideId: new ObjectId(guide._id)
        });
        
        // Get confirmed bookings
        const confirmedBookings = await db.collection("bookings").countDocuments({
          guideId: new ObjectId(guide._id),
          status: "confirmed"
        });
        
        // Get completed bookings
        const completedBookings = await db.collection("bookings").countDocuments({
          guideId: new ObjectId(guide._id),
          status: "completed"
        });
        
        // Get cancelled bookings
        const cancelledBookings = await db.collection("bookings").countDocuments({
          guideId: new ObjectId(guide._id),
          status: "cancelled"
        });
        
        // Calculate total revenue
        const bookings = await db.collection("bookings")
          .find({
            guideId: new ObjectId(guide._id),
            status: { $in: ["confirmed", "completed"] }
          })
          .toArray();
        
        const totalRevenue = bookings.reduce((total, booking) => total + (booking.totalPrice || 0), 0);
        
        // Get average rating
        const reviews = await db.collection("reviews")
          .find({ guideId: new ObjectId(guide._id) })
          .toArray();
        
        const totalRatings = reviews.length;
        const averageRating = totalRatings > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings
          : 0;
        
        // Process languages array
        const languages = Array.isArray(guide.languages) 
          ? guide.languages 
          : guide.languages ? [guide.languages] : ["English"];
        
        // Process specialties array
        const specialties = Array.isArray(guide.specialties) 
          ? guide.specialties 
          : guide.specialties ? [guide.specialties] : ["Tours"];
        
        return {
          id: guide._id.toString(),
          name: guide.name || "Unknown Guide",
          email: guide.email,
          phone: guide.phone || "",
          location: guide.location || "Unknown",
          profileImage: guide.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(guide.name || "Guide")}&background=random`,
          languages: languages,
          specialties: specialties,
          rating: averageRating,
          totalRatings: totalRatings,
          status: guide.status || "Active",
          totalBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings,
          totalRevenue,
          createdAt: guide.createdAt || new Date(),
          updatedAt: guide.updatedAt || guide.createdAt || new Date()
        };
      }));
      
      // Calculate pagination details
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;
      
      // Return guides data with pagination info
      return NextResponse.json({
        success: true,
        guides: transformedGuides,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore
        }
      });
    } finally {
      await client.close();
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.error("Error fetching guides data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guides data" },
      { status: 500 }
    );
  }
} 