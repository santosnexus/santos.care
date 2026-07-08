import { NextResponse } from "next/server";

export function withErrorHandling(handler: (...args: any[]) => Promise<NextResponse>) {
  return async (...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("Unhandled API error:", error);
      const message = process.env.NODE_ENV === "production"
        ? "Internal server error"
        : `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`;
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
