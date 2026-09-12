export const jsonToolResult = async (response: { ok: boolean; text(): Promise<string> }) => {
  const text = await response.text();

  return {
    content: [{ type: "text" as const, text }],
    ...(response.ok ? {} : { isError: true }),
  };
};
