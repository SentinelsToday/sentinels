import { insforge } from "./insforge";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

type WhereInput = Record<string, unknown>;
type DataInput = Record<string, unknown>;

interface FindManyParams {
  where?: WhereInput;
  orderBy?: Record<string, string> | Record<string, string>[];
  take?: number;
  skip?: number;
  include?: Record<string, unknown>;
  select?: Record<string, unknown>;
}

const TABLE_MAP: Record<string, string> = {
  firmwareRecords: "FirmwareRecord",
  telemetryEvents: "TelemetryEvent",
  auditLogs: "AuditLog",
  commands: "Command",
  robots: "Robot",
};

function applyWhere(
  builder: ReturnType<ReturnType<typeof insforge.database.from>["select"]>,
  where?: WhereInput
) {
  if (where) {
    for (const [key, value] of Object.entries(where)) {
      if (value !== undefined) {
        builder = (builder as unknown as { eq: (k: string, v: unknown) => typeof builder }).eq(key, value);
      }
    }
  }
  return builder;
}

function createModel(tableName: string) {
  return {
    async findUnique({ where, include }: { where: WhereInput; include?: Record<string, unknown> }): Promise<Record<string, unknown> | null> {
      const [[key, value]] = Object.entries(where);
      const { data, error } = await insforge.database
        .from(tableName)
        .select("*")
        .eq(key, value)
        .maybeSingle();
      if (error || !data) return null;

      const result = data as Record<string, unknown>;
      if (include) {
        for (const [relation, opts] of Object.entries(include)) {
          if (opts) {
            const fk = "robotId";
            const relatedTable = TABLE_MAP[relation] || relation;
            const { data: related } = await insforge.database
              .from(relatedTable)
              .select("*")
              .eq(fk, result.id as string);
            result[relation] = related || [];
          }
        }
      }
      return result;
    },

    async findFirst({ where, orderBy }: { where?: WhereInput; orderBy?: Record<string, string> } = {}): Promise<Record<string, unknown> | null> {
      let query = insforge.database.from(tableName).select("*") as ReturnType<typeof applyWhere>;
      query = applyWhere(query, where);
      if (orderBy) {
        const [[col, dir]] = Object.entries(orderBy);
        query = (query as unknown as { order: (c: string, o: { ascending: boolean }) => typeof query }).order(col, { ascending: dir === "asc" });
      }
      const { data } = await (query as ReturnType<typeof applyWhere>).limit(1).maybeSingle();
      return (data as Record<string, unknown>) || null;
    },

    async findMany(params: FindManyParams = {}): Promise<Record<string, unknown>[]> {
      const { where, orderBy, take, skip } = params;
      let query = insforge.database.from(tableName).select("*") as ReturnType<typeof applyWhere>;
      query = applyWhere(query, where);

      if (orderBy) {
        const orders = Array.isArray(orderBy) ? orderBy : [orderBy];
        for (const order of orders) {
          const [[col, dir]] = Object.entries(order);
          query = (query as unknown as { order: (c: string, o: { ascending: boolean }) => typeof query }).order(col, { ascending: dir === "asc" });
        }
      }

      if (take && skip !== undefined) {
        query = (query as unknown as { range: (s: number, e: number) => typeof query }).range(skip, skip + take - 1);
      } else if (take) {
        query = (query as unknown as { limit: (n: number) => typeof query }).limit(take);
      }

      const { data } = await (query as unknown as Promise<{ data: unknown[] | null }>);
      return (data as Record<string, unknown>[]) || [];
    },

    async create({ data }: { data: DataInput }) {
      const { data: result, error } = await insforge.database
        .from(tableName)
        .insert(data)
        .select();
      if (error) throw new Error(`Insert failed: ${error.message}`);
      return result?.[0] || null;
    },

    async update({ where, data }: { where: WhereInput; data: DataInput }) {
      const [[key, value]] = Object.entries(where);
      const { data: result, error } = await insforge.database
        .from(tableName)
        .update(data)
        .eq(key, value)
        .select();
      if (error) throw new Error(`Update failed: ${error.message}`);
      return result?.[0] || null;
    },

    async delete({ where }: { where: WhereInput }) {
      const [[key, value]] = Object.entries(where);
      const { error } = await insforge.database
        .from(tableName)
        .delete()
        .eq(key, value);
      if (error) throw new Error(`Delete failed: ${error.message}`);
      return { id: value };
    },

    async deleteMany({ where }: { where?: WhereInput } = {}) {
      const query = insforge.database.from(tableName).delete();
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) query.eq(key, value);
        }
      }
      const { error } = await query;
      if (error) throw new Error(`DeleteMany failed: ${error.message}`);
      return { count: 0 };
    },

    async count({ where }: { where?: WhereInput } = {}) {
      const query = insforge.database.from(tableName).select("*", { count: "exact", head: true });
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) query.eq(key, value);
        }
      }
      const { count } = await query;
      return count || 0;
    },

    async aggregate({ _avg, where }: { _avg?: Record<string, boolean>; where?: WhereInput }) {
      const query = insforge.database.from(tableName).select("*");
      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value !== undefined) query.eq(key, value);
        }
      }
      const { data } = await query;
      const result: { _avg: Record<string, number | null> } = { _avg: {} };
      if (_avg && data) {
        for (const field of Object.keys(_avg)) {
          const values = (data as Record<string, unknown>[])
            .map((r) => Number(r[field]))
            .filter((v) => !isNaN(v));
          result._avg[field] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
        }
      }
      return result;
    },
  };
}

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
  waitlistEntry: createModel("WaitlistEntry"),
  user: createModel("User"),
  organization: createModel("Organization"),
  orgMember: createModel("OrgMember"),
};
