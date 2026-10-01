import { Type } from "typebox";
import { defineTool } from "@earendil-works/pi-coding-agent";
import { querySales } from "../query-sales.js";

/** Shared DataAgent query tool (P05 / P06). */
export const queryDataTool = defineTool({
  name: "query_data",
  label: "查询销售数据",
  description:
    "查询销售数据（sales.csv）。按指定列的条件过滤，返回匹配的行。字段：日期、产品、地区、销售额、数量、销售人员。需要汇总销售额时先查出匹配行再自行相加。",
  parameters: Type.Object({
    column: Type.String({
      description: "要过滤的列名，如：地区、产品、销售人员、销售额",
    }),
    operator: Type.Union(
      [
        Type.Literal("="),
        Type.Literal("!="),
        Type.Literal(">"),
        Type.Literal("<"),
        Type.Literal(">="),
        Type.Literal("<="),
        Type.Literal("contains"),
      ],
      { description: "比较运算符：= != > < >= <= contains" },
    ),
    value: Type.String({ description: "过滤条件的值" }),
    limit: Type.Optional(Type.Number({ description: "最多返回行数，默认 20" })),
  }),
  async execute(_id, params) {
    const text = querySales(
      params.column,
      params.operator,
      params.value,
      params.limit,
    );
    return { content: [{ type: "text", text }], details: {} };
  },
});
