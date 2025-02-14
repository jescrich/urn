import { Urn } from "@this/urn"; // Adjust path if needed

describe("URN", () => {
  // Entity and ID extraction
  it("should return entity name", async () => {
    const urn = "urn:orders:1234";
    expect(Urn.entity(urn)).toBe("orders");
  });

  it("should return entity ID", async () => {
    const urn = "urn:orders:1234";
    expect(Urn.id(urn)).toBe("1234");
  });

  it("should return any other value in a complex URN", async () => {
    const urn = "urn:orders:1234:vendorCode:abcd";
    expect(Urn.value(urn, "vendorCode")).toBe("abcd");
  });

  it("should return product code from a product URN", async () => {
    const urn = "urn:product:65b2713b1267994147953b27:vendor:foo:sku:999";
    expect(Urn.value(urn, "sku")).toBe("999");
  });

  it("should return null for a non-existing key", async () => {
    const urn = "urn:product:65b2713b1267994147953b27:vendor:foo:sku:123";
    expect(Urn.value(urn, "foo")).toBe(null);
  });

  // **Validation Tests**
  it("should recognize a valid URN", () => {
    const urn = "urn:orders:1234";
    expect(Urn.isValid(urn)).toBe(true);
  });

  it("should reject an invalid URN (missing entity)", () => {
    const urn = "urn::1234";
    expect(Urn.isValid(urn)).toBe(false);
  });

  it("should reject an invalid URN (invalid format)", () => {
    const urn = "invalid:orders:1234";
    expect(Urn.isValid(urn)).toBe(false);
  });

  it("should reject a URN that exceeds 255 characters", () => {
    const longUrn = "urn:long" + ":a".repeat(250);
    expect(Urn.isValid(longUrn)).toBe(false);
  });

  // **Attribute Handling**
  it("should add an attribute", () => {
    const urn = "urn:orders:1234";
    const updatedUrn = Urn.addAttribute(urn, "customer", "john-doe");
    expect(Urn.value(updatedUrn, "customer")).toBe("john-doe");
  });

  it("should remove an existing attribute", () => {
    const urn = "urn:orders:1234:customer:john-doe";
    const updatedUrn = Urn.removeAttribute(urn, "customer");
    expect(Urn.value(updatedUrn, "customer")).toBe(null);
  });

  it("should return all attributes", () => {
    const urn = "urn:orders:1234:customer:john-doe:status:pending";
    expect(Urn.getAllAttributes(urn)).toEqual({ customer: "john-doe", status: "pending" });
  });

  // **UUID Generation**
  it("should generate a valid UUID URN", () => {
    const urn = Urn.createUUID("session");
    expect(urn).toMatch(/^urn:session:[a-f0-9-]{36}$/);
  });

  // **Normalization**
  it("should normalize a URN", () => {
    const urn = "URN:EXAMPLE:Animal:Ferret:Nose";
    const normalized = Urn.normalize(urn);
    expect(normalized).toBe("urn:example:Animal:Ferret:Nose");
  });

  // **Vendor Extraction**
  it("should extract vendor from URN", () => {
    const urn = "urn:orders:1234:vendor:amazon";
    expect(Urn.vendor(urn)).toBe("amazon");
  });

  it("should return null for missing vendor", () => {
    const urn = "urn:orders:1234";
    expect(Urn.vendor(urn)).toBe(null);
  });

  // **Error Handling**
  it("should throw an error for malformed URN parsing", () => {
    expect(() => Urn.parse("invalidURN")).toThrow("Invalid URN: Must start with the 'urn:' scheme");
  });

  it("should throw an error for missing entity or ID", () => {
    expect(() => Urn.parse("urn::")).toThrow("Invalid URN: Entity or ID is empty");
  });

  it("should throw an error for unmatched key-value pairs", () => {
    expect(() => Urn.parse("urn:orders:1234:status")).toThrow("Invalid URN: Attribute key without value");
  });
});
