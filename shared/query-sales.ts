import { readFileSync } from "node:fs";
import { join } from "node:path";

export function querySales(
  column: string,
  operator: string,
  value: string,
  limit = 20,
  csvPath = join(process.cwd(), "shared/data/sales.csv"),
): string {
  const content = readFileSync(csvPath, "utf8");
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(",").map((x) => x.trim());
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""])) as Record<
      string,
      string
    >;
  });

  if (!headers.includes(column)) {
    throw new Error(`列名 "${column}" 不存在。可用列：${headers.join("、")}`);
  }

  const num = (s: string) => Number(s);
  const matched = rows.filter((row) => {
    const cell = row[column];
    switch (operator) {
      case "=":
        return cell === value;
      case "!=":
        return cell !== value;
      case ">":
        return num(cell) > num(value);
      case "<":
        return num(cell) < num(value);
      case ">=":
        return num(cell) >= num(value);
      case "<=":
        return num(cell) <= num(value);
      case "contains":
        return cell.includes(value);
      default:
        return false;
    }
  });

  const shown = matched.slice(0, limit);
  let text = `查询条件：${column} ${operator} ${value}\n匹配 ${matched.length}/${rows.length} 行\n\n`;
  text += `${headers.join(", ")}\n`;
  for (const row of shown) {
    text += `${headers.map((h) => row[h]).join(", ")}\n`;
  }
  return text;
}
