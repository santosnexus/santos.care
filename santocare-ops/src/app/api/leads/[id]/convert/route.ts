import { NextResponse } from "next/server";
import { store } from "@/lib/db";
import { generateRefNumber } from "@/lib/utils";

/**
 * Convert a lead to a patient.
 *
 * Creates a new patient record from lead data, marks the lead as CONVERTED,
 * and links the two together.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const lead = await store.leads.find(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (lead.status === "CONVERTED" && lead.convertedToPatientId) {
      return NextResponse.json(
        { error: "Lead already converted", patientId: lead.convertedToPatientId },
        { status: 400 }
      );
    }

    // Create the patient from lead data
    const patientData: any = {
      referenceNumber: generateRefNumber(),
      name: lead.name,
      country: lead.country || "Unknown",
      phone: lead.phone || "",
      email: lead.email || `unknown-${Date.now()}@placeholder.local`,
      treatmentType: lead.treatmentInterest || "General",
      stage: "INQUIRY_RECEIVED",
      inquiryDate: new Date().toISOString(),
    };

    const created = await store.patients.create(patientData);
    const patientId = created.id || (created as any)._id;

    // Mark lead as converted
    await store.leads.update(params.id, {
      status: "CONVERTED",
      convertedToPatientId: patientId,
      conversionDate: new Date().toISOString(),
    } as any);

    return NextResponse.json({
      success: true,
      patient: created,
      leadId: params.id,
    });
  } catch (error) {
    console.error("Convert lead error:", error);
    return NextResponse.json(
      { error: "Failed to convert lead to patient" },
      { status: 500 }
    );
  }
}
