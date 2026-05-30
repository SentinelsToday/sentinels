import { insforge } from "./insforge";

// Thin adapter that provides Prisma-like interface over InsForge SDK
// This replaces the Prisma client for production use with InsForge PostgreSQL

function createModel(tableName: string) {
  return {
    async findUnique({ where, include }: { where: Record<string, any>; include?: Record<string, any> }) {
      const [[key, value]] = Object.entries(where);
      let query = insforge.database.from(tableName).select("*").eq(key, value);
      const { data, error } = await query.maybeSingle();
      if (error || !data) return null;

      // Handle includes (relations)
      if (include) {
        for (const [relation, opts] of Object.entries(include)) {
          if (opts) {
            const fk = "robotId";
            const { data: related } = await insforge.database
              .from(relation === "firmwareRecords" ? "FirmwareRecord" :
                    relation === "telemetryEvents" ? "TelemetryEvent" :
                    relation === "auditLogs" ? "AuditLog" :
                    relation === "commands" ? "Command" :
                    relation === "robots" ? "Robot" : relation)
              .select("*")
              .eq(fk, data.id);
            (data as any)[relation] = related || [];
          }
        }
      }
      return data;
    },

    async findFirst({ where, orderBy }: { where?: Record<string, any>; orderBy?: Record<string, string> } = {}) {
      let query = insforge.database.from(tableName).select("*");
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) query = query.eq(key, value);
        }
      }
      if (orderBy) {
        const [[col, dir]] = Object.entries(orderBy);
        query = query.order(col, { ascending: dir === "asc" });
      }
      const { data } = await query.limit(1).maybeSingle();
      return data || null;
    },

    async findMany({ where, orderBy, take, skip, include }: {
      where?: Record<string, any>;
      orderBy?: Record<string, string> | Record<string, string>[];
      take?: number;
      skip?: number;
      include?: Record<string, any>;
      select?: Record<string, any>;
    } = {}) {
      let query = insforge.database.from(tableName).select("*");

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) query = query.eq(key, value);
        }
      }

      if (orderBy) {
        const orders = Array.isArray(orderBy) ? orderBy : [orderBy];
        for (const order of orders) {
          const [[col, dir]] = Object.entries(order);
          query = query.order(col, { ascending: dir === "asc" });
        }
      }

      if (take && skip !== undefined) {
        query = query.range(skip, skip + take - 1);
      } else if (take) {
        query = query.limit(take);
      }

      const { data, error } = await query;
      return data || [];
    },

    async create({ data }: { data: any }) {
      const { data: result, error } = await insforge.database
        .from(tableName)
        .insert(data)
        .select();
      if (error) throw new Error(`Insert failed: ${error.message}`);
      return result?.[0] || null;
    },

    async update({ where, data }: { where: Record<string, any>; data: Record<string, any> }) {
      const [[key, value]] = Object.entries(where);
      const { data: result, error } = await insforge.database
        .from(tableName)
        .update(data)
        .eq(key, value)
        .select();
      if (error) throw new Error(`Update failed: ${error.message}`);
      return result?.[0] || null;
    },

    async delete({ where }: { where: Record<string, any> }) {
      const [[key, value]] = Object.entries(where);
      const { error } = await insforge.database
        .from(tableName)
        .delete()
        .eq(key, value);
      if (error) throw new Error(`Delete failed: ${error.message}`);
      return { id: value };
    },

    async deleteMany({ where }: { where?: Record<string, any> } = {}) {
      let query = insforge.database.from(tableName).delete();
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) query = query.eq(key, value);
        }
      }
      const { error } = await query;
      if (error) throw new Error(`DeleteMany failed: ${error.message}`);
      return { count: 0 };
    },

    async count({ where }: { where?: Record<string, any> } = {}) {
      let query = insforge.database.from(tableName).select("*", { count: "exact", head: true });
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) query = query.eq(key, value);
        }
      }
      const { count } = await query;
      return count || 0;
    },

    async aggregate({ _avg, where }: { _avg?: Record<string, boolean>; where?: Record<string, any> }) {
      // For avg trust score etc - fetch all and compute
      let query = insforge.database.from(tableName).select("*");
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) query = query.eq(key, value);
        }
      }
      const { data } = await query;
      const result: Record<string, any> = { _avg: {} };
      if (_avg && data) {
        for (const field of Object.keys(_avg)) {
          const values = data.map((r: any) => Number(r[field])).filter((v: number) => !isNaN(v));
          result._avg[field] = values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) / values.length : null;
        }
      }
      return result;
    },
  };
}

// Export db object with same interface as Prisma client
export const db = {
  robot: createModel("Robot"),
  fleet: createModel("Fleet"),
  firmwareRecord: createModel("FirmwareRecord"),
  telemetryEvent: createModel("TelemetryEvent"),
  auditLog: createModel("AuditLog"),
  command: createModel("Command"),
  softwareUpdate: createModel("SoftwareUpdate"),
  wallet: createModel("Wallet"),
  transaction: createModel("Transaction"),
  webhook: createModel("Webhook"),
  user: createModel("User"),
  organization: createModel("Organization"),
  orgMember: createModel("OrgMember"),
};
