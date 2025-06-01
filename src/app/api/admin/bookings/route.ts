/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import connectDB from "@/lib/db";
import Tour from "@/models/Tour";
import Booking from '@/models/Booking';

interface DecodedToken {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

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

        // Decode and verify admin role
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.role !== "admin") {
            return NextResponse.json(
                { success: false, error: "Unauthorized access: Admin privileges required" },
                { status: 403 }
            );
        }

        await connectDB();

        // Get query parameters
        const { searchParams } = req.nextUrl;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const sortBy = searchParams.get("sortBy") || "updatedAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        // Count total tours matching the query
        const total = await Booking.countDocuments(query);

        // Sort options
        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

        // Fetch tours with pagination and sorting
        const bookings = await Booking.find(query)
            .populate('guideId', 'name email phone avatar')
            .populate('tourId', 'title price')
            .populate('travelerId', 'name email phone avatar')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const transformedBookings = bookings.map(booking => ({
            ...booking.toObject(),
            guide: booking.guideId,
            tour: booking.tourId,
            customer: booking.travelerId,
        }));

        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;

        return NextResponse.json({
            success: true,
            bookings: transformedBookings,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasMore
            }
        });

    } catch (error) {
        console.error("Error fetching bookings data:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch bookings data" },
            { status: 500 }
        );
    }
}
