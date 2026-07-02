import { NextResponse } from "next/server";
import { store, isMockMode } from "@/lib/db";
import { generateRefNumber } from "@/lib/utils";

async function getTenantId(request: Request): Promise<string | undefined> {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenantId") || request.headers.get("x-tenant-id");
  return tenantId || undefined;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");
    const country = searchParams.get("country");
    const coordinatorId = searchParams.get("coordinatorId");
    const search = searchParams.get("search")?.toLowerCase();
    const tenantId = await getTenantId(request);

    let patients = await store.patients.list(tenantId);

    if (stage) patients = patients.filter((p: any) => p.stage === stage);
    if (country) patients = patients.filter((p: any) => p.country === country);
    if (coordinatorId) patients = patients.filter((p: any) => p.assignedCoordinatorId === coordinatorId);
    if (search) {
      patients = patients.filter((p: any) =>
        p.name?.toLowerCase().includes(search) ||
        p.email?.toLowerCase().includes(search) ||
        p.referenceNumber?.toLowerCase().includes(search)
      );
    }

    patients.sort((a: any, b: any) => new Date(b.inquiryDate).getTime() - new Date(a.inquiryDate).getTime());

    return NextResponse.json({
      patients,
      total: patients.length,
      mockMode: isMockMode,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tenantId = body.tenantId || "santos";

    const newPatient = {
      tenantId,
      referenceNumber: body.referenceNumber || generateRefNumber(),
      name: body.name,
      country: body.country,
      phone: body.phone,
      email: body.email,
      whatsapp: body.whatsapp,
      treatmentType: body.treatmentType,
      treatmentDescription: body.treatmentDescription,
      preferredHospital: body.preferredHospital,
      stage: body.stage || "INQUIRY_RECEIVED",
      estimatedCost: body.estimatedCost,
      inquiryDate: new Date().toISOString(),
    };

    const created = await store.patients.create(newPatient);
    return NextResponse.json({ patient: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
