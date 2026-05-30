import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Sentinel Robotics API",
    version: "1.0.0",
    endpoints: {
      identity: {
        "POST /api/robots/register": "Register a new robot (generates keypair, DID)",
        "GET /api/robots/register": "List all robots",
        "GET /api/robots/:id": "Get robot details",
        "PATCH /api/robots/:id": "Update robot status/name",
        "POST /api/robots/:id": "Rotate robot keys",
      },
      verification: {
        "POST /api/verify/firmware": "Submit firmware for hash verification",
        "POST /api/verify/telemetry": "Submit signed telemetry event",
        "GET /api/verify/trust/:robotId": "Get computed trust score",
      },
      fleet: {
        "GET /api/fleet": "List all fleets",
        "POST /api/fleet": "Create a fleet",
        "GET /api/fleet/stats": "Fleet-wide statistics",
        "POST /api/robots/:id/command": "Send command to robot",
        "GET /api/robots/:id/command": "Get command history",
      },
      audit: {
        "GET /api/audit": "Query audit logs (filters: robotId, action, limit, offset)",
        "POST /api/audit": "Verify audit chain integrity",
        "GET /api/audit/:robotId": "Export full audit trail (compliance)",
      },
    },
  });
}
