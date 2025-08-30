import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
	params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const supabase = await createClient();
		const { data: pledge, error } = await supabase.from("pledges").select("*").eq("id", params.id).single();

		if (error) {
			if (error.code === "PGRST116") {
				return NextResponse.json({ error: "Pledge not found" }, { status: 404 });
			}
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to fetch pledge" }, { status: 500 });
		}

		return NextResponse.json({ pledge, success: true });
	} catch (error) {
		console.error("Error fetching pledge:", error);
		return NextResponse.json({ error: "Failed to fetch pledge" }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
	try {
		const body = await request.json();
		const supabase = await createClient();

		const { data: pledge, error } = await supabase.from("pledges").update(body).eq("id", params.id).select().single();

		if (error) {
			if (error.code === "PGRST116") {
				return NextResponse.json({ error: "Pledge not found" }, { status: 404 });
			}
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to update pledge" }, { status: 500 });
		}

		return NextResponse.json({ pledge, success: true });
	} catch (error) {
		console.error("Error updating pledge:", error);
		return NextResponse.json({ error: "Failed to update pledge" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("pledges").delete().eq("id", params.id);

		if (error) {
			console.error("Supabase error:", error);
			return NextResponse.json({ error: "Failed to delete pledge" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting pledge:", error);
		return NextResponse.json({ error: "Failed to delete pledge" }, { status: 500 });
	}
}
